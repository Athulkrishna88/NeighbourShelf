import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';

const CATEGORIES = [
  'Tools',
  'Outdoor',
  'Kitchen',
  'Cleaning',
  'Electronics',
  'Gardening',
  'Leisure',
  'Other'
];

export default function AddEditItemPage({ editItemId, onBack, onNavigate }) {
  const isEditing = Boolean(editItemId);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tools',
    condition: 'good',
    maxLoanDays: 7,
    status: 'available',
    photos: []
  });
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchItem = async () => {
        try {
          const res = await api.items.getItemById(editItemId);
          if (res.success && res.item) {
            setFormData({
              title: res.item.title || '',
              description: res.item.description || '',
              category: res.item.category || 'Tools',
              condition: res.item.condition || 'good',
              maxLoanDays: res.item.maxLoanDays || 7,
              status: res.item.status || 'available',
              photos: res.item.photos || []
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to load item for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [editItemId, isEditing]);

  const handleAddPhotoUrl = () => {
    if (!photoInputUrl.trim()) return;
    if (formData.photos.length >= 3) {
      setError('A maximum of 3 photos is allowed per item (C-1).');
      return;
    }
    setFormData({
      ...formData,
      photos: [...formData.photos, photoInputUrl.trim()]
    });
    setPhotoInputUrl('');
    setError('');
  };

  const handleRemovePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!formData.category) {
      setError('Category is required.');
      return;
    }
    if (!formData.condition) {
      setError('Condition is required.');
      return;
    }
    if (Number(formData.maxLoanDays) < 1) {
      setError('Max loan duration must be at least 1 day.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.items.updateItem(editItemId, formData);
        setSuccessMsg('Item listing updated successfully!');
      } else {
        await api.items.createItem(formData);
        setSuccessMsg('Item listed on your neighbourhood shelf!');
      }
      setTimeout(() => {
        onNavigate('myItems');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save item listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '640px', padding: '3rem 1.5rem' }}>
      <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {isEditing ? 'Edit Item Listing' : 'List an Item on NeighbourShelf'}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Share your rarely used household tools and equipment with trusted neighbours
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="item-title">Item Title *</label>
            <input
              id="item-title"
              type="text"
              className="form-input"
              placeholder="e.g. Bosch Impact Drill with Bits"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="item-category">Category *</label>
              <select
                id="item-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="item-condition">Condition *</label>
              <select
                id="item-condition"
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="new">Like New / Mint</option>
                <option value="good">Good (Normal wear)</option>
                <option value="fair">Fair (Fully functional)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-desc">Description & Instructions</label>
            <textarea
              id="item-desc"
              className="form-textarea"
              rows="3"
              placeholder="Provide key details, safety cautions, or included accessories..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={1000}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="item-days">Max Loan Duration (Days) *</label>
              <input
                id="item-days"
                type="number"
                min="1"
                max="30"
                className="form-input"
                value={formData.maxLoanDays}
                onChange={(e) => setFormData({ ...formData, maxLoanDays: e.target.value })}
                required
              />
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="form-label" htmlFor="item-status">Availability Status (FR-2.3)</label>
                <select
                  id="item-status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={formData.status === 'on_loan'}
                >
                  <option value="available">Available for Borrowing</option>
                  <option value="hidden">Temporarily Hidden</option>
                  {formData.status === 'on_loan' && <option value="on_loan">Currently On Loan</option>}
                </select>
              </div>
            )}
          </div>

          {/* Photos Management (C-1: max 3 photos) */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">
              Photos (Max 3 Entries - C-1)
            </label>
            
            {/* Added Photos Previews */}
            {formData.photos.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {formData.photos.map((photo, i) => (
                  <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.photos.length < 3 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Paste photo image URL (HTTPS / Unsplash)..."
                  value={photoInputUrl}
                  onChange={(e) => setPhotoInputUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddPhotoUrl}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} /> Add Photo
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
              disabled={saving}
              style={{ flexGrow: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ flexGrow: 2 }}
            >
              {saving ? 'Saving Item...' : isEditing ? 'Save Changes' : 'Publish Item to Locality'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
