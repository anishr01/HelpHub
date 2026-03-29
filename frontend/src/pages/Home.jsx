import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero animate-fade-in-up" style={{ textAlign: 'left', padding: '40px 0' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', gap: '40px' }}>
        
        {/* Left Column: Text */}
        <div style={{ flex: '1 1 500px', animationDelay: '0.1s' }} className="animate-slide-in">
          <div style={{ display: 'inline-block', marginBottom: '24px', padding: '8px 20px', borderRadius: '40px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: '600', border: '1px solid rgba(99, 102, 241, 0.3)', letterSpacing: '0.05em' }}>
            <span style={{ marginRight: '8px' }}>🌍</span> Globally Connected Emergency Network
          </div>
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '24px', fontWeight: '700' }}>
            Local Help,<br />
            <span style={{ background: 'linear-gradient(120deg, #10B981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Global Impact.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '540px', marginBottom: '40px', lineHeight: '1.7' }}>
            HelpHub connects people needing urgent services, animal rescue, or general help right in your neighborhood. Be the hero someone needs today.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/request-help">
              <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: '40px' }}>
                Require Assistance
              </button>
            </Link>
            <Link to="/requests">
              <button className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: '40px' }}>
                View Active Requests
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: AI generated glowing image */}
        <div style={{ flex: '1 1 400px', textAlign: 'center', animationDelay: '0.3s' }} className="animate-fade-in-up">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Glow behind image */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', background: 'linear-gradient(45deg, #6366f1, #10B981)', filter: 'blur(70px)', opacity: '0.4', zIndex: -1, animation: 'float 10s infinite alternate' }}></div>
            
            <img 
              src="/hero_image.png" 
              alt="Network Hub" 
              style={{ width: '100%', maxWidth: '550px', height: 'auto', borderRadius: '24px', animation: 'float 15s infinite alternate ease-in-out', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
            />
          </div>
        </div>

      </div>

      {/* Feature Cards */}
      <div className="features-grid animate-fade-in-up" style={{ animationDelay: '0.5s', marginTop: '40px' }}>
        <div className="glass-panel" style={{ borderTop: '2px solid rgba(59, 130, 246, 0.5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>🤝</div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Community Connect</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Post help requests for food, clothes, or medicine. Volunteers near you can easily step up and track the request.</p>
        </div>

        <div className="glass-panel" style={{ borderTop: '2px solid rgba(239, 68, 68, 0.5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>🩸</div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Blood & Medicine</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>During emergencies, finding blood donors quickly saves lives. Filter precisely by blood group and urgency.</p>
        </div>

        <div className="glass-panel" style={{ borderTop: '2px solid rgba(245, 158, 11, 0.5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>🐾</div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Animal Rescue</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Be a voice for the voiceless. Upload photos and geolocation to notify nearby volunteers and animal NGOs instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
