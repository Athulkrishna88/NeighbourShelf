import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { 
  Calendar, 
  User, 
  Phone, 
  Lock, 
  XCircle, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Clock 
} from 'lucide-react';

export default function MyRequestsPage({ onNavigate }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Rating Modal State (FR-5.1)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const fetchMyLoans = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getLoans('borrower');
      if (res.success) {
        setLoans(res.loans);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your borrow requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const handleCancelRequest = async (loanId) => {
    if (!window.confirm('Cancel this pending borrow request?')) return;
    setError('');
    setActionSuccess('');

    try {
      const res = await api.loans.cancelLoan(loanId);
      if (res.success) {
        setActionSuccess('Borrow request cancelled.');
        fetchMyLoans();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel request');
    }
  };

  const openRatingModal = (loan) => {
    setSelectedLoan(loan);
    setRatingScore(5);
    setRatingComment('');
    setRatingError('');
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingError('');
    setSubmittingRating(true);

    try {
      const res = await api.loans.addRating(selectedLoan._id, {
        score: ratingScore,
        comment: ratingComment
      });

      if (res.success) {
        setActionSuccess('Thank you! Your rating has updated the lender trust score.');
        setIsRatingModalOpen(false);
        fetchMyLoans();
      }
    } catch (err) {
      setRatingError(err.message || 'Failed to submit rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1060px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          My Borrow Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Track the status of household items you've requested from neighbours
        </p>
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
            <div key={n} className="card skeleton" style={{ height: '120px' }} />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <div className="empty-state">
          <Send size={50} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No borrow requests yet
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Browse through your neighbourhood shelf and request drills, ladders, camping gear or appliances.
          </p>
          <button onClick={() => onNavigate('browse')} className="btn btn-primary">
            Browse Locality Items
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loans.map((loan) => {
            const item = loan.item || {};
            const photo = (item.photos && item.photos.length > 0)
              ? item.photos[0]
              : 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80';

            const startStr = new Date(loan.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const dueStr = new Date(loan.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            const isApproved = ['approved', 'overdue', 'returned'].includes(loan.status);

            return (
              <div
                key={loan._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  borderLeft: loan.status === 'overdue' ? '4px solid var(--danger)' : loan.status === 'approved' ? '4px solid var(--primary)' : '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px' }}>
                  <img
                    src={photo}
                    alt={item.title}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <div>
                    <div style={{ marginBottom: '0.35rem' }}>
                      <StatusBadge status={loan.status} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      <span>{startStr} <strong>to</strong> {dueStr}</span>
                    </div>
                  </div>
                </div>

                {/* Lender Info & Contact Phone (FR-5.3) */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  minWidth: '220px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Lender: {loan.lender?.name}
                  </div>
                  {loan.lender && loan.lender.trustScore > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <StarRating score={loan.lender.trustScore} size={12} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Score</span>
                    </div>
                  )}

                  <div style={{ marginTop: '0.25rem' }}>
                    {isApproved && loan.lender?.phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem' }}>
                        <Phone size={14} /> {loan.lender.phone}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <Lock size={13} /> Phone concealed until approved
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {loan.status === 'pending' && (
                    <button
                      onClick={() => handleCancelRequest(loan._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={15} /> Cancel Request
                    </button>
                  )}

                  {loan.status === 'returned' && (
                    <button
                      onClick={() => openRatingModal(loan)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#d97706', borderColor: '#fde68a' }}
                    >
                      <Star size={15} fill="#f59e0b" color="#f59e0b" /> Rate Lender
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal (FR-5.1) */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title={`Rate ${selectedLoan?.lender?.name || 'Lender'}`}
      >
        <form onSubmit={handleRatingSubmit}>
          {ratingError && (
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
              <span>{ratingError}</span>
            </div>
          )}

          <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              How was your borrowing experience with {selectedLoan?.lender?.name}?
            </div>
            <StarRating
              score={ratingScore}
              interactive={true}
              onRate={(newScore) => setRatingScore(newScore)}
              size={32}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rating-comment">Feedback / Comment (Optional)</label>
            <textarea
              id="rating-comment"
              className="form-textarea"
              rows="3"
              placeholder="e.g. Great tool, punctual handover, very polite neighbour!"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              maxLength={500}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsRatingModalOpen(false)}
              disabled={submittingRating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingRating}
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
