import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ score = 0, interactive = false, onRate = () => {}, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {stars.map((star) => {
        const isFilled = star <= Math.round(score);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              padding: interactive ? '2px' : 0,
              display: 'flex',
              alignItems: 'center',
              color: isFilled ? '#f59e0b' : '#cbd5e1',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (interactive) e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (interactive) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              strokeWidth={isFilled ? 0 : 2}
            />
          </button>
        );
      })}
      {!interactive && score > 0 && (
        <span style={{
          fontSize: `${size * 0.85}px`,
          fontWeight: '700',
          color: '#d97706',
          marginLeft: '4px'
        }}>
          {Number(score).toFixed(1)}
        </span>
      )}
    </div>
  );
}
