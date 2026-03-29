import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
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
      const data = await resp.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
          Active <span style={{ color: 'var(--primary)' }}>Requests</span>
        </h2>
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
