import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [myRescues, setMyRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        const [reqRes, volRes] = await Promise.all([
          fetch(`http://localhost:8081/api/requests/user/${currentUser.id}`),
          fetch(`http://localhost:8081/api/requests/volunteer/${currentUser.id}`)
        ]);
        
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setMyRequests(Array.isArray(reqData) ? reqData : []);
        }
        if (volRes.ok) {
          const volData = await volRes.json();
          setMyRescues(Array.isArray(volData) ? volData : []);
        }
      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Profile Header */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>{currentUser.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{currentUser.email} • {currentUser.phone}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <span className="badge badge-danger">Blood Group: {currentUser.bloodGroup}</span>
            <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>Role: {currentUser.role}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--primary)' }}>Loading profile data...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Volunteer History */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>🦸 Lives Impacted</span>
              <span style={{ color: 'var(--secondary)' }}>{myRescues.length}</span>
            </h3>
            {myRescues.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't responded to any emergencies yet. Check the dashboard to help someone nearby!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myRescues.map(req => (
                  <div key={req.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{req.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleDateString()} • {req.type.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Own Requests */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>📣 My Requests</span>
              <span style={{ color: 'var(--primary)' }}>{myRequests.length}</span>
            </h3>
            {myRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't posted any help requests.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myRequests.map(req => (
                  <div key={req.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', borderLeft: req.status === 'PENDING' ? '3px solid #fcd34d' : '3px solid #10b981' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
                      {req.title}
                      <span style={{ fontSize: '0.7rem', color: req.status === 'PENDING' ? '#fcd34d' : '#10b981' }}>{req.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button className="btn-secondary" onClick={() => { logout(); navigate('/'); }} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
          Sign Out of HelpHub
        </button>
      </div>

    </div>
  );
};

export default Profile;
