import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">HelpHub</Link>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" className="nav-link-text">Home</Link>
        <Link to="/requests" className="nav-link-text">Dashboard</Link>
        
        {currentUser ? (
          <>
            <span style={{ color: 'var(--text-muted)' }}>Hey, {currentUser.name}</span>
            <button className="btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
            <Link to="/request-help">
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Help</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link-text" style={{ color: 'var(--text-muted)' }}>Login</Link>
            <Link to="/signup">
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
