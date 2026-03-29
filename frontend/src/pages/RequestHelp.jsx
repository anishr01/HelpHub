import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequestHelp = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    type: 'FOOD_CLOTHES',
    title: '',
    location: '',
    latitude: null,
    longitude: null,
    imageUrl: null,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setFormData(prev => ({ ...prev, latitude, longitude }));
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        if (data && data.display_name) {
          setFormData(prev => ({ ...prev, location: data.display_name }));
        } else {
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        }
      } catch (err) {
        setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
      } finally {
        setLocationLoading(false);
      }
    }, () => {
      // Fallback to India for hackathon testing if browser blocks GPS
      const lat = 28.6139;
      const lng = 77.2090;
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, location: "New Delhi, Delhi, India" }));
      setLocationLoading(false);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:8081/api/requests?requesterId=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'PENDING' })
      });
      if (resp.ok) {
        alert('Emergency request submitted successfully!');
        navigate('/requests');
      } else {
        const errMsg = await resp.text();
        alert('Action Failed: ' + errMsg);
      }
    } catch (err) {
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Authentication Required</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You must be logged in to request help.</p>
        <Link to="/login"><button className="btn-primary">Login Now</button></Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
        Request <span style={{ color: 'var(--primary)' }}>Assistance</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>Our volunteers are here. Let us know what you need.</p>
      
      <div className="glass-panel" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Help Category</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="FOOD_CLOTHES">🥘 Food & Clothes Connect</option>
              <option value="BLOOD_MEDICINE">💉 Blood / Medicine Urgency</option>
              <option value="ANIMAL_RESCUE">🐕 Animal Rescue Reporter</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Title / Urgency</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Need O+ Blood immediately" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Location / Address</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                required
                type="text" 
                placeholder="e.g., City Hospital, Ward 3" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={handleGetLocation} 
                disabled={locationLoading}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap', padding: '14px 18px' }}
              >
                {locationLoading ? 'Fetching...' : '📍 Use Live Location'}
              </button>
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>We'll automatically fetch your current street address.</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Details & Contact Info</label>
            <textarea 
              required
              rows="4" 
              placeholder="Provide context, medical details, or contact number..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Emergency Photo (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ padding: '10px' }}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', height: '160px' }}>
                <img src={formData.imageUrl} alt="Uploaded preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '16px', padding: '16px' }}>
            {loading ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHelp;
