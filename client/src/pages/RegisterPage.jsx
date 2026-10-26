import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';
import { UserPlus, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const [localities, setLocalities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    locality: '',
    phone: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const res = await api.localities.getAll();
        if (res.success && res.localities.length > 0) {
          setLocalities(res.localities);
          setFormData(prev => ({ ...prev, locality: res.localities[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load localities:', err);
      }
    };
    fetchLocalities();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    else if (formData.name.length > 80) errs.name = 'Name cannot exceed 80 characters.';

    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) errs.email = 'Please enter a valid email address.';

    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters long (FR-1.1).';

    if (!formData.locality) errs.locality = 'Please select your residential locality.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      onNavigate('browse');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      maxWidth: '540px',
      margin: '3.5rem auto',
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
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Join Your Neighbourhood Shelf
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Lend and borrow household essentials within your community
          </p>
        </div>

        {apiError && (
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
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name *</label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="e.g. Athulkrishna KS"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password (Minimum 8 Characters) *</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-locality">Your Neighbourhood / Locality *</label>
            <select
              id="reg-locality"
              className="form-select"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            >
              {localities.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.locality && <span className="form-error">{errors.locality}</span>}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Items are securely partitioned by locality (FR-3.1).
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Phone Number (Optional)</label>
            <input
              id="reg-phone"
              type="tel"
              className="form-input"
              placeholder="+91 98470 12345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              🔒 Protected by FR-5.3: Only revealed to approved loan partners.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-bio">Short Bio / Interests (Optional)</label>
            <textarea
              id="reg-bio"
              className="form-textarea"
              rows="2"
              placeholder="e.g. Passionate about woodworking and gardening tools..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          Already a member?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ color: 'var(--primary)', fontWeight: '700' }}
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}
