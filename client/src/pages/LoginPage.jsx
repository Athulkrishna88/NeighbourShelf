import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      onNavigate('browse');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container" style={{
      maxWidth: '460px',
      margin: '4rem auto',
      padding: '0 1rem'
    }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your neighbourhood's shelf
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            One-Click Quick Evaluation Logins
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('athul@example.com', 'password123')}
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={13} color="var(--primary)" /> Athul (Member)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('admin@neighbourshelf.org', 'admin1234')}
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={13} color="#0284c7" /> Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('meera@example.com', 'password123')}
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={13} color="#7c3aed" /> Meera (Lender)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('suspended@example.com', 'password123')}
              style={{ fontSize: '0.78rem' }}
            >
              <ShieldAlert size={13} color="var(--danger)" /> Suspended Demo
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          New to NeighbourShelf?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ color: 'var(--primary)', fontWeight: '700' }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
