const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const app = require('../src/app');
const { connectDB, closeDB } = require('../src/config/db');
const { seedData } = require('../src/seed/seedData');
const User = require('../src/models/User');

let server;
let baseUrl;

test.before(async () => {
  await connectDB();
  await seedData();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await closeDB();
});

test('GET /api/health returns 200 healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('POST /api/auth/login succeeds for seeded user', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'athul@example.com',
      password: 'password123'
    })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.equal(data.user.email, 'athul@example.com');
});

test('POST /api/auth/login returns 403 for suspended user (FR-6.3)', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'suspended@example.com',
      password: 'password123'
    })
  });
  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.success, false);
});

test('GET /api/items filters by member locality (FR-3.1)', async () => {
  // Login first
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'athul@example.com', password: 'password123' })
  });
  const { token } = await loginRes.json();

  const res = await fetch(`${baseUrl}/api/items`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.items.length > 0);
  // All items must match the user's locality
  data.items.forEach(item => {
    assert.equal(item.locality.name, 'Sahrdaya Green Valley');
  });
});
