import React from 'react';
import { 
  Wrench, 
  Tent, 
  Utensils, 
  Sparkles, 
  Tv, 
  Trees, 
  Gamepad2, 
  ShieldCheck, 
  Users, 
  MapPin, 
  ArrowRight, 
  CalendarCheck,
  PhoneCall
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const categories = [
    { name: 'Tools', icon: Wrench, count: 'Drills, Ladders, Saws' },
    { name: 'Outdoor', icon: Tent, count: 'Tents, Camping Chairs' },
    { name: 'Kitchen', icon: Utensils, count: 'Party Cookers, Air Fryers' },
    { name: 'Cleaning', icon: Sparkles, count: 'Pressure Washers, Vacuums' },
    { name: 'Electronics', icon: Tv, count: 'Projectors, Speakers' },
    { name: 'Gardening', icon: Trees, count: 'Branch Cutters, Lawn Gear' },
    { name: 'Leisure', icon: Gamepad2, count: 'Board Games, Badminton' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(120% 120% at 50% 0%, #ecfdf5 0%, #ffffff 80%)',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            <MapPin size={15} /> Hyper-Local Community Sharing
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            color: 'var(--text-main)',
            marginBottom: '1.25rem'
          }}>
            Why buy when your neighbour <br />
            <span style={{ color: 'var(--primary)' }}>already has one?</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            Borrow drills, ladders, party pressure cookers, camping tents and projectors right in your neighbourhood. Transparent dates, mutual ratings, and protected privacy.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => onNavigate('register')}
              className="btn btn-primary btn-lg"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="btn btn-secondary btn-lg"
            >
              Sign In to Your Locality
            </button>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div style={{
            marginTop: '2rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(241, 245, 249, 0.8)',
            border: '1px solid var(--border)',
            display: 'inline-block',
            fontSize: '0.825rem',
            color: 'var(--text-muted)'
          }}>
            <strong>Demo Member:</strong> athul@example.com / password123 &nbsp; | &nbsp; <strong>Admin:</strong> admin@neighbourshelf.org / admin1234
          </div>
        </div>
      </section>

      {/* Trust & Community Metrics */}
      <section style={{ padding: '3rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                100%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Locality-Fenced Search
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0284c7', marginBottom: '0.25rem' }}>
                4.9 ★
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Average Trust Score
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.25rem' }}>
                24h
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Stateless JWT Security
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#d97706', marginBottom: '0.25rem' }}>
                Zero Waste
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Circular Economy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              How NeighbourShelf Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
              Say goodbye to messy WhatsApp groups. Everything is tracked with accountable loan states.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Browse Your Neighbourhood
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Items are strictly limited to your residential area. Filter by category or find what's available today.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Request & Date Validation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Select start and return dates within the owner's allowed duration. Lenders review and approve with one tap.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Private Phone Exchange
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Phone numbers remain concealed until the lender approves the loan, guaranteeing privacy for everyone.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Return & Mutual Ratings
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Lenders confirm item returns, and both members rate each other to grow their public community Trust Score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Explore Lending Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              From power drills and camping gear to party appliances and board games.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={i}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                  onClick={() => onNavigate('login')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {cat.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
