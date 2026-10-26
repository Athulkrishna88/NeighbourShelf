import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Calendar, 
  MapPin, 
  Trash2, 
  UserX, 
  UserCheck, 
  Plus, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'localities' | 'items'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Locality Modal State
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);
  const [editingLocalityId, setEditingLocalityId] = useState(null);
  const [localityName, setLocalityName] = useState('');
  const [localityDesc, setLocalityDesc] = useState('');
  const [savingLocality, setSavingLocality] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, localitiesRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getAllUsers(),
        api.localities.getAll()
      ]);

      if (statsRes.success) setStats(statsRes);
      if (usersRes.success) setUsers(usersRes.users);
      if (localitiesRes.success) setLocalities(localitiesRes.localities);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userObj) => {
    const newStatus = userObj.status === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'reinstate'} user "${userObj.name}"?`)) {
      return;
    }
    setError('');
    setSuccessMsg('');

    try {
      // FR-6.3: Administrators SHALL be able to suspend and reinstate users
      const res = await api.admin.updateUserStatus(userObj._id, newStatus);
      if (res.success) {
        setSuccessMsg(res.message);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleRemoveItem = async (itemId, title) => {
    if (!window.confirm(`Admin removal: Delete item "${title}" and cancel all pending requests?`)) {
      return;
    }
    setError('');
    setSuccessMsg('');

    try {
      // FR-6.2: Administrators SHALL be able to remove any listing; its pending requests are then cancelled.
      const res = await api.admin.removeItem(itemId);
      if (res.success) {
        setSuccessMsg(res.message);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to remove listing');
    }
  };

  const openCreateLocalityModal = () => {
    setEditingLocalityId(null);
    setLocalityName('');
    setLocalityDesc('');
    setIsLocalityModalOpen(true);
  };

  const openEditLocalityModal = (loc) => {
    setEditingLocalityId(loc._id);
    setLocalityName(loc.name);
    setLocalityDesc(loc.description || '');
    setIsLocalityModalOpen(true);
  };

  const handleSaveLocality = async (e) => {
    e.preventDefault();
    if (!localityName.trim()) return;
    setSavingLocality(true);
    setError('');
    setSuccessMsg('');

    try {
      // FR-6.1: Administrators SHALL be able to create and rename localities
      if (editingLocalityId) {
        await api.admin.updateLocality(editingLocalityId, {
          name: localityName.trim(),
          description: localityDesc.trim()
        });
        setSuccessMsg('Locality renamed successfully.');
      } else {
        await api.admin.createLocality({
          name: localityName.trim(),
          description: localityDesc.trim()
        });
        setSuccessMsg('New locality added to platform.');
      }
      setIsLocalityModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save locality');
    } finally {
      setSavingLocality(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1140px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Moderation & Admin Portal
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Full platform oversight per SRS Section 4.6 (FR-6.1 to FR-6.4)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('localities')}
            className={`btn btn-sm ${activeTab === 'localities' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Localities ({localities.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`btn btn-sm ${activeTab === 'items' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Listings
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          border: '1px solid #a7f3d0'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          border: '1px solid #fecaca'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>TOTAL MEMBERS</span>
                <Users size={20} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                {stats.stats.usersCount}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>TOTAL ITEMS LISTED</span>
                <Package size={20} color="#0284c7" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                {stats.stats.itemsCount}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>ACTIVE / PENDING LOANS</span>
                <Activity size={20} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                {stats.stats.activeLoansCount}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>ACTIVE LOCALITIES</span>
                <MapPin size={20} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                {stats.stats.localitiesCount}
              </div>
            </div>
          </div>

          {/* Recent Listings Preview */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>
              Recent Platform Listings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentItems?.map((item) => (
                <div key={item._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Listed by {item.owner?.name} • Locality: {item.locality?.name}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id, item.title)}
                    className="btn btn-danger btn-sm"
                    title="Remove listing (FR-6.2)"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab (FR-6.3: Suspend and reinstate users) */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>
            User Account Management (FR-6.3)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>User</th>
                  <th style={{ padding: '0.75rem' }}>Locality</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Trust Score</th>
                  <th style={{ padding: '0.75rem' }}>Account Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Moderation Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSuspended = u.status === 'suspended';
                  return (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: '700' }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{u.locality?.name || '—'}</td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{u.role}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <StarRating score={u.trustScore || 0} size={13} />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: isSuspended ? '#fee2e2' : '#d1fae5',
                          color: isSuspended ? '#991b1b' : '#065f46'
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`btn btn-sm ${isSuspended ? 'btn-primary' : 'btn-danger'}`}
                          >
                            {isSuspended ? (
                              <>
                                <UserCheck size={14} /> Reinstate
                              </>
                            ) : (
                              <>
                                <UserX size={14} /> Suspend
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Localities Tab (FR-6.1: Create and rename localities) */}
      {activeTab === 'localities' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              Locality Management (FR-6.1)
            </h3>
            <button onClick={openCreateLocalityModal} className="btn btn-primary btn-sm">
              <Plus size={15} /> Add Locality
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {localities.map((loc) => (
              <div
                key={loc._id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                    <MapPin size={18} /> {loc.name}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {loc.description || 'No description added.'}
                  </p>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openEditLocalityModal(loc)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit3 size={14} /> Rename / Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'items' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>
            Listing Moderation (FR-6.2)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentItems?.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Owner: {item.owner?.name} ({item.owner?.email}) • Locality: {item.locality?.name}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id, item.title)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={15} /> Remove Inappropriate Listing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locality Modal (Create / Rename) */}
      <Modal
        isOpen={isLocalityModalOpen}
        onClose={() => setIsLocalityModalOpen(false)}
        title={editingLocalityId ? 'Rename Locality' : 'Create New Locality'}
      >
        <form onSubmit={handleSaveLocality}>
          <div className="form-group">
            <label className="form-label" htmlFor="loc-name">Locality Name *</label>
            <input
              id="loc-name"
              type="text"
              className="form-input"
              placeholder="e.g. Sahrdaya Campus & Staff Quarters"
              value={localityName}
              onChange={(e) => setLocalityName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loc-desc">Description (Optional)</label>
            <textarea
              id="loc-desc"
              className="form-textarea"
              rows="3"
              placeholder="Area description, residential landmarks..."
              value={localityDesc}
              onChange={(e) => setLocalityDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsLocalityModalOpen(false)}
              disabled={savingLocality}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingLocality}
            >
              {savingLocality ? 'Saving...' : 'Save Locality'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
