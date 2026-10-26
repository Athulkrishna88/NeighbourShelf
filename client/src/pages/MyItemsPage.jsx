import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Package, 
  Clock, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function MyItemsPage({ onNavigate, onEditItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await api.items.getMyListings();
      if (res.success) {
        setItems(res.items);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your listed items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleToggleStatus = async (item) => {
    setError('');
    setActionSuccess('');
    const newStatus = item.status === 'hidden' ? 'available' : 'hidden';

    try {
      const res = await api.items.updateItem(item._id, { status: newStatus });
      if (res.success) {
        setActionSuccess(`Item is now ${newStatus === 'hidden' ? 'temporarily hidden' : 'available for borrowing'}.`);
        fetchMyItems();
      }
    } catch (err) {
      setError(err.message || 'Failed to update item status');
    }
  };

  const handleDeleteItem = async (itemId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from your shelf?`)) {
      return;
    }
    setError('');
    setActionSuccess('');

    try {
      const res = await api.items.deleteItem(itemId);
      if (res.success) {
        setActionSuccess('Item removed from shelf.');
        fetchMyItems();
      }
    } catch (err) {
      // FR-2.4: System SHALL NOT allow deletion of a listing that has an active loan
      setError(err.message || 'Cannot delete item with active or pending loans.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1060px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
            My Listed Shelf
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage the household equipment and tools you are sharing with your neighbours
          </p>
        </div>

        <button 
          onClick={() => onNavigate('addItem')}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Add New Item
        </button>
      </div>

      {actionSuccess && (
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
          <span>{actionSuccess}</span>
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

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '100px' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <Package size={50} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            You haven't listed any items yet
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Every household has drills, ladders, pressure cookers or tents used only a few times a year. List one today!
          </p>
          <button onClick={() => onNavigate('addItem')} className="btn btn-primary">
            <PlusCircle size={16} /> List Your First Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => {
            const photo = (item.photos && item.photos.length > 0)
              ? item.photos[0]
              : 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={item._id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img
                    src={photo}
                    alt={item.title}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {item.category}
                      </span>
                      <span>•</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Condition: <strong>{item.condition}</strong></span>
                      <span>Max Loan: <strong>{item.maxLoanDays} days</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.status !== 'on_loan' && (
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className="btn btn-secondary btn-sm"
                      title={item.status === 'hidden' ? 'Make Available' : 'Hide from search'}
                    >
                      {item.status === 'hidden' ? (
                        <>
                          <Eye size={15} color="var(--primary)" />
                          <span>Make Available</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={15} color="var(--text-muted)" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onEditItem(item._id)}
                    className="btn btn-secondary btn-sm"
                    title="Edit listing details"
                  >
                    <Edit3 size={15} /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item._id, item.title)}
                    className="btn btn-danger btn-sm"
                    title="Delete item"
                    disabled={item.status === 'on_loan'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
