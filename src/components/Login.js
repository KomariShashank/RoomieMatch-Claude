import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

function Login({ onNext }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup flow
        if (!fullName || !age) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            age: parseInt(age)
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Signup failed');
        }

        const data = await response.json();
        
        // Save auth data to context
        login(data.access_token, data.user_id, data.full_name);
        
        // Navigate to lifestyle preferences
        onNext();
      } else {
        // Login flow
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        
        // Save auth data to context
        login(data.access_token, data.user_id, data.full_name);
        
        // Navigate to lifestyle preferences
        onNext();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignup ? 'Sign up to start your roommate search' : 'Sign in to continue your roommate search'}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  placeholder="25"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </>
          )}

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
              minLength="6"
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !email || !password || (isSignup && (!fullName || !age))}
            >
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up →' : 'Sign In →')}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
