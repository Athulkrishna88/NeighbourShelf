import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';
import ItemCard from '../components/ItemCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  PlusCircle, 
  PackageSearch, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tools',
  'Outdoor',
  'Kitchen',
  'Cleaning',
  'Electronics',
  'Gardening',
  'Leisure',
  'Other'
];

export default function BrowseItemsPage({ onNavigate, onSelectItem }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state (FR-3.2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  
  // Pagination state (FR-3.3: 12 items per block)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.items.getItems({
        q: searchQuery,
        category: selectedCategory,
        available: availableOnly,
        page,
        limit: 12
      });

      if (res.success) {
        setItems(res.items);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, availableOnly, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Locality Banner (FR-3.1) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>
              Locality-Partitioned Catalogue (FR-3.1)
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {user?.locality?.name || 'Your Community Shelf'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Only items listed by residents of your verified locality are visible here.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('addItem')}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.25rem' }}
        >
          <PlusCircle size={18} />
          <span>List an Item on Shelf</span>
        </button>
      </div>

      {/* Filter & Search Bar Controls (FR-3.2) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Box */}
          <form 
            onSubmit={handleSearchSubmit} 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.75rem',
              border: '1px solid var(--border)',
              flexGrow: 1,
              maxWidth: '480px'
            }}
          >
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search items by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-main)'
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          {/* Available Now Toggle Switch */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: availableOnly ? 'var(--primary)' : 'var(--text-main)'
          }}>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => {
                setAvailableOnly(e.target.checked);
                setPage(1);
              }}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            <CheckCircle2 size={16} color={availableOnly ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>Show Available Now Only</span>
          </label>
        </div>

        {/* Categories Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item Results Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <span>Found <strong>{totalItems}</strong> items matching your criteria</span>
        {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="grid-cards">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card" style={{ height: '320px' }}>
              <div className="skeleton" style={{ width: '100%', height: '180px' }} />
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="skeleton" style={{ width: '80%', height: '18px' }} />
                <div className="skeleton" style={{ width: '60%', height: '14px' }} />
                <div className="skeleton" style={{ width: '40%', height: '14px', marginTop: '1rem' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger)' }}>
          <p>{error}</p>
          <button onClick={fetchItems} className="btn btn-secondary mt-4">
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={54} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No items found in your locality
          </h3>
          <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            {searchQuery || selectedCategory !== 'All' || availableOnly
              ? 'Try adjusting your search filters or clear the search criteria.'
              : 'Be the first neighbour to put something on the shelf!'}
          </p>
          <button 
            onClick={() => onNavigate('addItem')} 
            className="btn btn-primary"
          >
            <PlusCircle size={16} /> List Your Item Now
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onClick={() => onSelectItem(item._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls (FR-3.3) */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '3rem'
        }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
