const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('Connecting to MongoDB via MONGODB_URI...');
      await mongoose.connect(uri);
      console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn(`MongoDB direct connection failed: ${err.message}. Checking fallback...`);
    }
  }

  // Fallback to MongoMemoryServer for instant local run if no external DB configured
  try {
    console.log('Starting local MongoMemoryServer instance for zero-config local development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to in-memory MongoDB at: ${memoryUri}`);
  } catch (memErr) {
    console.error('Failed to connect to MongoDB:', memErr.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
