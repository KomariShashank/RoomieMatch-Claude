import React, { useState } from 'react';

function Login({ onNext }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onNext();
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-hero">
        <div className="hero-icon">🏠</div>
        <div className="hero-content">
          <h1>RoomieMatch</h1>
          <p>Find your perfect roommate based on lifestyle compatibility</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">✨</span>
              <span>Smart Matching Algorithm</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🎯</span>
              <span>Lifestyle Compatibility</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">💬</span>
              <span>Instant Connections</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your roommate search</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={!email || !password}>
              Get Started →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
