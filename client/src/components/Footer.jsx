import React from 'react';
import { Library, Heart, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      padding: '2.5rem 0 1.5rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Library size={18} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                NeighbourShelf
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              A neighbourhood lending library platform designed to empower hyper-local communities to share tools, equipment, and appliances with trust and accountability.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
              Academic & Standards
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={14} color="var(--primary)" /> ICT Academy of Kerala (ICTAK)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="var(--primary)" /> IEEE Std 830-1998 Compliant SRS
              </li>
              <li>Sahrdaya College of Engineering & Technology</li>
              <li>Full Stack MERN Architecture</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
              Project Developer
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Developed by <strong>Athulkrishna KS</strong><br />
              Submission Version 1.0<br />
              Protected REST API & Stateless JWT Sessions.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} NeighbourShelf. Built with React, Express, and MongoDB.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Neighbourly sharing made secure and simple <Heart size={14} color="var(--danger)" fill="var(--danger)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
