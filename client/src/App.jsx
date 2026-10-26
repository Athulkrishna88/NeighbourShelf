import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AddEditItemPage from './pages/AddEditItemPage';
import MyItemsPage from './pages/MyItemsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import RequestsReceivedPage from './pages/RequestsReceivedPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);

  // Auto route to browse when user logs in, or landing if visitor
  useEffect(() => {
    if (!loading) {
      if (user && currentView === 'landing') {
        setCurrentView('browse');
      } else if (!user && ['browse', 'addItem', 'editItem', 'myItems', 'myRequests', 'requestsReceived', 'profile', 'admin'].includes(currentView)) {
        setCurrentView('login');
      }
    }
  }, [user, loading]);

  const handleSelectItem = (id) => {
    setSelectedItemId(id);
    setCurrentView('itemDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditItem = (id) => {
    setEditItemId(id);
    setCurrentView('editItem');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view) => {
    if (view === 'addItem') {
      setEditItemId(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-main)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          Loading NeighbourShelf...
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentView={currentView} setCurrentView={handleNavigate} />

      <main style={{ flexGrow: 1 }}>
        {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentView === 'register' && <RegisterPage onNavigate={handleNavigate} />}

        {currentView === 'browse' && (
          <BrowseItemsPage 
            onNavigate={handleNavigate} 
            onSelectItem={handleSelectItem} 
          />
        )}

        {currentView === 'itemDetail' && (
          <ItemDetailPage
            itemId={selectedItemId}
            onBack={() => handleNavigate('browse')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'addItem' && (
          <AddEditItemPage
            editItemId={null}
            onBack={() => handleNavigate('myItems')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'editItem' && (
          <AddEditItemPage
            editItemId={editItemId}
            onBack={() => handleNavigate('myItems')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'myItems' && (
          <MyItemsPage
            onNavigate={handleNavigate}
            onEditItem={handleEditItem}
          />
        )}

        {currentView === 'myRequests' && (
          <MyRequestsPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'requestsReceived' && (
          <RequestsReceivedPage />
        )}

        {currentView === 'profile' && (
          <ProfilePage />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer />
    </div>
  );
}
