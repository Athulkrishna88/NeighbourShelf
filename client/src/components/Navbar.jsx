import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Library, 
  MapPin, 
  PlusCircle, 
  Package, 
  Inbox, 
  Send, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Star
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navigateTo(user ? 'browse' : 'landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px var(--primary-glow)'
          }}>
            <Library size={24} />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              color: 'var(--text-main)',
              lineHeight: 1.1
            }}>
              Neighbour<span style={{ color: 'var(--primary)' }}>Shelf</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontWeight: '600',
              letterSpacing: '0.2px'
            }}>
              Lending Library
            </div>
          </div>
        </div>

        {/* Member Locality Indicator Badge */}
        {user && user.locality && (
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-hover)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.825rem',
            fontWeight: '600',
            border: '1px solid #a7f3d0'
          }} className="locality-pill-desktop">
            <MapPin size={14} />
            <span>{typeof user.locality === 'object' ? user.locality.name : 'My Locality'}</span>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.75rem'
        }} className="nav-desktop">
          {user ? (
            <>
              <button 
                onClick={() => navigateTo('browse')}
                className={`btn btn-sm ${currentView === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Browse Items
              </button>

              <button 
                onClick={() => navigateTo('addItem')}
                className={`btn btn-sm ${currentView === 'addItem' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderColor: 'var(--primary)', color: currentView === 'addItem' ? '#fff' : 'var(--primary)' }}
              >
                <PlusCircle size={15} />
                List Item
              </button>

              <button 
                onClick={() => navigateTo('myItems')}
                className={`btn btn-sm ${currentView === 'myItems' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Package size={15} />
                My Shelf
              </button>

              <button 
                onClick={() => navigateTo('myRequests')}
                className={`btn btn-sm ${currentView === 'myRequests' ? 'btn-primary' : 'btn-secondary'}`}
                title="Items I requested to borrow"
              >
                <Send size={15} />
                My Borrows
              </button>

              <button 
                onClick={() => navigateTo('requestsReceived')}
                className={`btn btn-sm ${currentView === 'requestsReceived' ? 'btn-primary' : 'btn-secondary'}`}
                title="Borrow requests received on my items"
              >
                <Inbox size={15} />
                Lender Inbox
              </button>

              {user.role === 'admin' && (
                <button 
                  onClick={() => navigateTo('admin')}
                  className={`btn btn-sm ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ color: '#0369a1', borderColor: '#bae6fd' }}
                >
                  <ShieldCheck size={15} />
                  Admin
                </button>
              )}

              {/* Profile & Trust Score Pill */}
              <div 
                onClick={() => navigateTo('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  marginLeft: '0.5rem'
                }}
                title="View Profile & Trust Score"
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: '700', lineHeight: 1.1 }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#d97706', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '2px',
                    fontWeight: '600' 
                  }}>
                    <Star size={10} fill="#f59e0b" color="#f59e0b" />
                    {user.trustScore ? Number(user.trustScore).toFixed(1) : 'New'}
                  </span>
                </div>
              </div>

              <button 
                onClick={logout}
                className="btn btn-sm btn-secondary"
                title="Sign out"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigateTo('login')}
                className="btn btn-sm btn-secondary"
              >
                Log In
              </button>
              <button 
                onClick={() => navigateTo('register')}
                className="btn btn-sm btn-primary"
              >
                Join Community
              </button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)'
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {user && user.locality && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <MapPin size={16} />
              <span>{typeof user.locality === 'object' ? user.locality.name : 'My Locality'}</span>
            </div>
          )}

          {user ? (
            <>
              <button onClick={() => navigateTo('browse')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Browse Items
              </button>
              <button onClick={() => navigateTo('addItem')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', color: 'var(--primary)' }}>
                <PlusCircle size={16} /> List Item
              </button>
              <button onClick={() => navigateTo('myItems')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Package size={16} /> My Shelf
              </button>
              <button onClick={() => navigateTo('myRequests')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Send size={16} /> My Borrows
              </button>
              <button onClick={() => navigateTo('requestsReceived')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Inbox size={16} /> Lender Inbox
              </button>
              {user.role === 'admin' && (
                <button onClick={() => navigateTo('admin')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', color: '#0369a1' }}>
                  <ShieldCheck size={16} /> Admin Dashboard
                </button>
              )}
              <button onClick={() => navigateTo('profile')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <User size={16} /> My Profile ({user.name})
              </button>
              <button onClick={logout} className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigateTo('login')} className="btn btn-secondary">
                Log In
              </button>
              <button onClick={() => navigateTo('register')} className="btn btn-primary">
                Join Community
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .nav-desktop { display: flex !important; }
          .locality-pill-desktop { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
