import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Lock, 
  Clock, 
  Send, 
  AlertCircle,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function ItemDetailPage({ itemId, onBack, onNavigate }) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await api.items.getItemById(itemId);
        if (res.success) {
          setItem(res.item);
          // Set default start and return dates
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const startStr = tomorrow.toISOString().split('T')[0];
          setStartDate(startStr);

          const defaultDue = new Date(tomorrow);
          const maxDays = res.item.maxLoanDays || 3;
          defaultDue.setDate(defaultDue.getDate() + Math.min(maxDays, 3));
          setDueDate(defaultDue.toISOString().split('T')[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleBorrowRequest = async (e) => {
    e.preventDefault();
    setRequestError('');

    if (!startDate || !dueDate) {
      setRequestError('Please select both start date and return date.');
      return;
    }

    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (due <= start) {
      setRequestError('Return date must be strictly after the start date.');
      return;
    }

    const diffDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
    if (diffDays > item.maxLoanDays) {
      setRequestError(`Selected duration of ${diffDays} days exceeds owner's maximum limit of ${item.maxLoanDays} days.`);
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await api.loans.requestLoan({
        itemId: item._id,
        startDate,
        dueDate,
        notes
      });

      if (res.success) {
        setRequestSuccess(true);
        setTimeout(() => {
          setIsRequestModalOpen(false);
          onNavigate('myRequests');
        }, 1500);
      }
    } catch (err) {
      setRequestError(err.message || 'Failed to submit borrow request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
        <div className="skeleton" style={{ width: '120px', height: '36px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          <div className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '30px', width: '80%' }} />
            <div className="skeleton" style={{ height: '20px', width: '40%' }} />
            <div className="skeleton" style={{ height: '100px', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          {error || 'Item not found.'}
        </p>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Browse
        </button>
      </div>
    );
  }

  const isOwner = user && String(item.owner?._id) === String(user._id);
  const canBorrow = !isOwner && item.status === 'available';

  const photos = (item.photos && item.photos.length > 0) 
    ? item.photos 
    : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1060px' }}>
      <button 
        onClick={onBack} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Left: Photos & Gallery */}
        <div>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '75%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)'
          }}>
            <img
              src={photos[selectedPhotoIndex] || photos[0]}
              alt={item.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Thumbnail strip if multiple photos */}
          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: selectedPhotoIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: selectedPhotoIndex === idx ? 1 : 0.7,
                    cursor: 'pointer'
                  }}
                >
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Metadata & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {item.category}
            </span>
            <span style={{
              backgroundColor: '#f0fdf4',
              color: '#15803d',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'capitalize',
              border: '1px solid #bbf7d0'
            }}>
              Condition: {item.condition}
            </span>
            <StatusBadge status={item.status} />
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            lineHeight: 1.25,
            marginBottom: '1rem'
          }}>
            {item.title}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            whiteSpace: 'pre-line'
          }}>
            {item.description || 'The owner has not provided a detailed description for this item.'}
          </p>

          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.925rem' }}>
              <Clock size={18} color="var(--primary)" />
              <span>Max Permitted Duration: <strong>{item.maxLoanDays} days</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <MapPin size={16} />
              <span>Locality: <strong>{item.locality?.name}</strong></span>
            </div>
          </div>

          {/* Lender Info Card */}
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem'
            }}>
              Item Owner (Lender)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}>
                  {item.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem' }}>
                    {item.owner?.name} {isOwner && '(You)'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                    <StarRating score={item.owner?.trustScore || 0} size={13} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ({item.owner?.completedLoans || 0} completed loans)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Status (FR-5.3) */}
              <div>
                {item.owner?.phone ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <Phone size={15} /> {item.owner.phone}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }} title="Phone is revealed once loan is approved (FR-5.3)">
                    <Lock size={14} /> Phone protected
                  </div>
                )}
              </div>
            </div>

            {item.owner?.bio && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                "{item.owner.bio}"
              </p>
            )}
          </div>

          {/* Action Button */}
          {isOwner ? (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              You own this listing. Manage or edit it in <button onClick={() => onNavigate('myItems')} style={{ color: 'var(--primary)', fontWeight: '700' }}>My Shelf</button>.
            </div>
          ) : item.status === 'on_loan' ? (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#92400e',
              fontWeight: '600'
            }}>
              This item is currently on loan to another neighbour.
            </div>
          ) : (
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={18} /> Request to Borrow This Item
            </button>
          )}
        </div>
      </div>

      {/* Borrow Request Modal (FR-4.1) */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Request to Borrow "${item.title}"`}
      >
        {requestSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Borrow Request Sent!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              The lender has received your request. Redirecting to your loans tracker...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBorrowRequest}>
            {requestError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{requestError}</span>
              </div>
            )}

            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem'
            }}>
              Maximum permitted loan: <strong>{item.maxLoanDays} days</strong>. Return date must be after start date.
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loan-start">Start Date *</label>
              <input
                id="loan-start"
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loan-due">Return Date *</label>
              <input
                id="loan-due"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loan-notes">Note for the Lender (Optional)</label>
              <textarea
                id="loan-notes"
                className="form-textarea"
                rows="3"
                placeholder="e.g. Planning to clean my rooftop on Saturday. Will return on Sunday morning!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem'
            }}>
              <Lock size={14} />
              <span>Phone number will be shared with the owner upon approval (FR-5.3).</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRequestModalOpen(false)}
                disabled={submittingRequest}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingRequest}
              >
                {submittingRequest ? 'Submitting...' : 'Send Borrow Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
