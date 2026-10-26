import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';
import StarRating from '../components/StarRating';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Edit3 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      // FR-1.4: View and edit name, optional phone, and bio
      const res = await api.auth.updateMe({ name, phone, bio });
      if (res.success && res.user) {
        updateUser(res.user);
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Member Profile & Trust Score
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Manage your personal details and view your neighbourhood reputation
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left: Trust & Community Stats Card */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '800',
            margin: '0 auto 1.25rem',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {user?.name}
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <MapPin size={14} />
            <span>{typeof user?.locality === 'object' ? user?.locality?.name : 'Verified Locality'}</span>
          </div>

          {/* Trust Score Panel (FR-1.5) */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Community Trust Score (FR-1.5)
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#d97706', lineHeight: 1 }}>
              {user?.trustScore ? Number(user.trustScore).toFixed(1) : '5.0'}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <StarRating score={user?.trustScore || 5.0} size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Based on {user?.ratingsCount || 0} neighbour ratings
            </div>
          </div>

          {/* Completed Loans counter (FR-1.5) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--text-main)'
          }}>
            <Award size={18} color="var(--primary)" />
            <span><strong>{user?.completedLoans || 0}</strong> Completed Loans</span>
          </div>
        </div>

        {/* Right: Edit Profile Form (FR-1.4) */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} color="var(--primary)" /> Edit Profile Details
          </h3>

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid #a7f3d0'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Full Name *</label>
              <input
                id="prof-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">Email Address</label>
              <input
                id="prof-email"
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-surface)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email identity cannot be changed.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-phone">Contact Phone Number (Optional)</label>
              <input
                id="prof-phone"
                type="tel"
                className="form-input"
                placeholder="+91 98470 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Protected by FR-5.3: Only revealed to approved loan partners.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-bio">Short Bio & Interests</label>
              <textarea
                id="prof-bio"
                className="form-textarea"
                rows="3"
                placeholder="Share a bit about yourself, hobbies, or tools you have..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
