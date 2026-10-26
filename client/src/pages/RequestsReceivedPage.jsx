import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { 
  Inbox, 
  Check, 
  X, 
  CheckCheck, 
  Phone, 
  Calendar, 
  User, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  Lock
} from 'lucide-react';

export default function RequestsReceivedPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Rating Modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getLoans('lender');
      if (res.success) {
        setLoans(res.loans);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lender inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleApprove = async (loanId) => {
    setError('');
    setActionSuccess('');
    try {
      // FR-4.3: Approval sets item to "on_loan" and declines overlapping pending requests
      const res = await api.loans.approveLoan(loanId);
      if (res.success) {
        setActionSuccess('Loan approved! Item marked "on loan" and conflicting requests were declined.');
        fetchInbox();
      }
    } catch (err) {
      setError(err.message || 'Failed to approve request');
    }
  };

  const handleDecline = async (loanId) => {
    if (!window.confirm('Decline this borrow request?')) return;
    setError('');
    setActionSuccess('');
    try {
      const res = await api.loans.declineLoan(loanId);
      if (res.success) {
        setActionSuccess('Request declined.');
        fetchInbox();
      }
    } catch (err) {
      setError(err.message || 'Failed to decline request');
    }
  };

  const handleMarkReturned = async (loanId) => {
    if (!window.confirm('Confirm that the borrower has safely returned this item?')) return;
    setError('');
    setActionSuccess('');
    try {
      // FR-4.5: Lender marks item as returned, making it available again
      const res = await api.loans.markReturned(loanId);
      if (res.success) {
        setActionSuccess('Item return confirmed! Your item is now available for new borrow requests.');
        fetchInbox();
      }
    } catch (err) {
      setError(err.message || 'Failed to confirm return');
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
        setActionSuccess('Borrower rated successfully! Trust score updated.');
        setIsRatingModalOpen(false);
        fetchInbox();
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
          Lender Inbox & Loan Approvals
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Approve incoming requests on your items, view borrower contacts, and mark returns
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
            <div key={n} className="card skeleton" style={{ height: '130px' }} />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <div className="empty-state">
          <Inbox size={50} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No requests received yet
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            When neighbours in your locality request to borrow your items, you will review and approve them here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loans.map((loan) => {
            const item = loan.item || {};
            const photo = (item.photos && item.photos.length > 0)
              ? item.photos[0]
              : 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80';

            const startStr = new Date(loan.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
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
                  borderLeft: loan.status === 'pending' ? '4px solid #0284c7' : loan.status === 'overdue' ? '4px solid var(--danger)' : loan.status === 'approved' ? '4px solid var(--primary)' : '1px solid var(--border)'
                }}
              >
                {/* Item Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px' }}>
                  <img
                    src={photo}
                    alt={item.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <div>
                    <div style={{ marginBottom: '0.35rem' }}>
                      <StatusBadge status={loan.status} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      <span>{startStr} to {dueStr}</span>
                    </div>
                  </div>
                </div>

                {/* Borrower Information */}
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  minWidth: '240px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Borrower: {loan.borrower?.name}
                  </div>
                  {loan.borrower && loan.borrower.trustScore > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <StarRating score={loan.borrower.trustScore} size={12} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Score</span>
                    </div>
                  )}

                  {loan.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                      "{loan.notes}"
                    </p>
                  )}

                  <div style={{ marginTop: '0.4rem' }}>
                    {isApproved && loan.borrower?.phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem' }}>
                        <Phone size={14} /> {loan.borrower.phone}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <Lock size={13} /> Phone concealed until approved
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {loan.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(loan._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Check size={15} /> Approve Request
                      </button>
                      <button
                        onClick={() => handleDecline(loan._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
                      >
                        <X size={15} /> Decline
                      </button>
                    </>
                  )}

                  {['approved', 'overdue'].includes(loan.status) && (
                    <button
                      onClick={() => handleMarkReturned(loan._id)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#0284c7' }}
                    >
                      <CheckCheck size={15} /> Mark as Returned
                    </button>
                  )}

                  {loan.status === 'returned' && (
                    <button
                      onClick={() => openRatingModal(loan)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#d97706', borderColor: '#fde68a' }}
                    >
                      <Star size={15} fill="#f59e0b" color="#f59e0b" /> Rate Borrower
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
        title={`Rate Borrower ${selectedLoan?.borrower?.name || ''}`}
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
              How was your lending experience with {selectedLoan?.borrower?.name}?
            </div>
            <StarRating
              score={ratingScore}
              interactive={true}
              onRate={(newScore) => setRatingScore(newScore)}
              size={32}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lender-comment">Feedback / Notes (Optional)</label>
            <textarea
              id="lender-comment"
              className="form-textarea"
              rows="3"
              placeholder="e.g. Returned clean and on time, very respectful of equipment."
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
              {submittingRating ? 'Submitting...' : 'Submit Borrower Rating'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
