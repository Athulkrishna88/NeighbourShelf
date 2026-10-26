import React from 'react';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import { Calendar, User, ShieldCheck } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  const photo = (item.photos && item.photos.length > 0)
    ? item.photos[0]
    : 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      className="card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Item Image with Category & Status Overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '65%',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        <img
          src={photo}
          alt={item.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <span style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: '600'
          }}>
            {item.category}
          </span>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            color: 'var(--text-main)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {item.condition}
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem'
        }}>
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {item.title}
          </h3>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {item.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            {/* Owner & Trust Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} color="var(--primary)" />
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                {item.owner ? item.owner.name.split(' ')[0] : 'Neighbour'}
              </span>
              {item.owner && item.owner.trustScore > 0 && (
                <StarRating score={item.owner.trustScore} size={12} />
              )}
            </div>

            {/* Max Loan Duration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} />
              <span>Up to {item.maxLoanDays}d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
