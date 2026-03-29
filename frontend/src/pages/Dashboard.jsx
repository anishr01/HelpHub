import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchRequests(filter);
  }, [filter]);

  const fetchRequests = async (typeFilter) => {
    setLoading(true);
    try {
      const url = typeFilter === 'ALL' 
        ? 'http://localhost:8081/api/requests' 
        : `http://localhost:8081/api/requests?type=${typeFilter}`;
      
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          setRequests([]);
        }
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Failed to fetch requests', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (reqId) => {
    if (!currentUser) return;
    try {
      const resp = await fetch(`http://localhost:8081/api/requests/${reqId}/accept?volunteerId=${currentUser.id}`, {
        method: 'PUT'
      });
      if (resp.ok) {
        // Optimistic UI update
        setRequests(requests.map(r => r.id === reqId ? {...r, status: 'ACCEPTED', acceptedBy: currentUser} : r));
      } else {
        alert('Failed to accept request');
      }
    } catch (err) {
      alert('Error accepting request');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
          Active <span style={{ color: 'var(--primary)' }}>Requests</span>
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ background: viewMode === 'list' ? 'var(--primary)' : 'transparent', borderRadius: 0, padding: '8px 16px', border: 'none' }}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ background: viewMode === 'map' ? 'var(--primary)' : 'transparent', borderRadius: 0, padding: '8px 16px', border: 'none' }}
            >
              Map View
            </button>
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '220px', background: 'var(--surface)', border: '1px solid var(--primary)', cursor: 'pointer' }}
          >
            <option value="ALL">All Categories</option>
            <option value="FOOD_CLOTHES">🥘 Food & Clothes</option>
            <option value="BLOOD_MEDICINE">💉 Blood / Medicine</option>
            <option value="ANIMAL_RESCUE">🐾 Animal Rescue</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold', padding: '60px', fontSize: '1.2rem' }}>
            <span style={{ animation: 'pulse 1s infinite' }}>Loading live requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '1.1rem' }}>No active requests found in this category.</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '600px', border: '1px solid rgba(99,102,241,0.5)', zIndex: 0 }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              {requests.map(req => {
                if (req.latitude && req.longitude) {
                  return (
                    <Marker key={req.id} position={[req.latitude, req.longitude]}>
                      <Popup>
                        <strong style={{ color: '#000' }}>{req.title}</strong><br/>
                        <span style={{ color: '#444' }}>{req.type}</span><br/>
                        <span style={{ color: req.status === 'PENDING' ? '#f59e0b' : '#10b981' }}>{req.status}</span>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
        ) : (
          requests.map((req, index) => (
            <div 
              key={req.id} 
              className="glass-panel animate-slide-in" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge ${req.type === 'BLOOD_MEDICINE' ? 'badge-danger' : req.type === 'ANIMAL_RESCUE' ? 'badge-warning' : 'badge-success'}`}>
                    {req.type.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 style={{ marginBottom: '8px', fontSize: '1.3rem', color: '#fff' }}>{req.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--primary)' }}>📍</span> {req.location}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.6' }}>
                  {req.description}
                </p>
                {req.imageUrl && (
                  <div style={{ marginTop: '12px', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={req.imageUrl} alt="Request visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              
              <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <div style={{ marginBottom: '16px', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.1em', color: req.status === 'PENDING' ? '#FCD34D' : '#6EE7B7' }}>
                  {req.status === 'PENDING' ? '⏳ PENDING' : '✅ ASSIGNED'}
                </div>
                {req.status === 'PENDING' && (
                  currentUser ? (
                    <button className="btn-primary" onClick={() => handleAccept(req.id)} style={{ width: '100%' }}>
                      Accept Request
                    </button>
                  ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>Login to Accept</button>
                    </Link>
                  )
                )}
                {req.status === 'ACCEPTED' && req.acceptedBy && (
                   <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0 }}>Helper Assigned:</p>
                     <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6ee7b7', margin: 0 }}>{req.acceptedBy.name}</p>
                   </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
