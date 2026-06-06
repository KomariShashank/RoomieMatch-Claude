import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

function LifestylePreferences({ onNext, onBack }) {
  const { access_token, user_id, logout } = useAuth();
  const [formData, setFormData] = useState({
    cleanliness: 5,
    sleepSchedule: 'moderate',
    smoking: 'no',
    drinking: 'socially',
    socialLevel: 5
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mapping functions to convert frontend values to backend format
  const mapSleepSchedule = (schedule) => {
    const mapping = {
      'early': 'Early bird',
      'moderate': 'Flexible',
      'night': 'Night owl'
    };
    return mapping[schedule] || schedule;
  };

  const mapSmoking = (smoking) => {
    // 'no' -> false, 'occasionally' -> true, 'yes' -> true
    return smoking !== 'no';
  };

  const mapDrinking = (drinking) => {
    // 'no' -> false, 'socially' -> true, 'regularly' -> true
    return drinking !== 'no';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔑 Token being used:', access_token ? 'Token exists' : 'NO TOKEN!');
    console.log('👤 User ID:', user_id);
    console.log('📝 Form data (frontend):', formData);

    // Map frontend values to backend format
    const mappedData = {
      cleanliness_level: formData.cleanliness,
      sleep_schedule: mapSleepSchedule(formData.sleepSchedule),
      smoking: mapSmoking(formData.smoking),
      drinking: mapDrinking(formData.drinking),
      social_level: formData.socialLevel
    };

    console.log('🔄 Mapped data (backend format):', mappedData);

    try {
      // Step 1: Save habits to backend
      console.log('📤 Calling POST /profile/habits...');
      const habitsResponse = await fetch(`${API_URL}/profile/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(mappedData),
      });

      console.log('📥 Habits response status:', habitsResponse.status);

      if (!habitsResponse.ok) {
        const errorData = await habitsResponse.json();
        console.error('❌ Habits error:', errorData);
        if (habitsResponse.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(errorData.detail || 'Failed to save preferences');
      }

      const habitsData = await habitsResponse.json();
      console.log('✅ Habits saved:', habitsData);

      // Step 2: Fetch matches from backend
      console.log('📤 Calling GET /matches...');
      const matchesResponse = await fetch(`${API_URL}/matches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      console.log('📥 Matches response status:', matchesResponse.status);

      if (!matchesResponse.ok) {
        const errorData = await matchesResponse.json();
        console.error('❌ Matches error:', errorData);
        if (matchesResponse.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(errorData.detail || 'Failed to fetch matches');
      }

      const matchesData = await matchesResponse.json();
      console.log('✅ Matches fetched:', matchesData);

      // Navigate to matches screen with the fetched matches
      onNext(matchesData);
    } catch (err) {
      console.error('💥 Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-hero">
        <div className="hero-icon">🎯</div>
        <div className="hero-content">
          <h1>Your Lifestyle</h1>
          <p>Share your daily habits and preferences for better matches</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">✨</span>
              <span>Cleanliness Habits</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🌙</span>
              <span>Sleep Schedule</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">👥</span>
              <span>Social Preferences</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header">
          <h1>Lifestyle Preferences</h1>
          <p>Help us find your perfect match</p>
        </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cleanliness Level: {formData.cleanliness}/10</label>
          <div className="slider-container">
            <input
              type="range"
              className="slider"
              min="1"
              max="10"
              value={formData.cleanliness}
              onChange={(e) => handleChange('cleanliness', parseInt(e.target.value))}
            />
            <div className="slider-labels">
              <span>Messy</span>
              <span>Very Clean</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Sleep Schedule</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="early"
                name="sleepSchedule"
                value="early"
                checked={formData.sleepSchedule === 'early'}
                onChange={(e) => handleChange('sleepSchedule', e.target.value)}
              />
              <label htmlFor="early">Early Bird</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="moderate"
                name="sleepSchedule"
                value="moderate"
                checked={formData.sleepSchedule === 'moderate'}
                onChange={(e) => handleChange('sleepSchedule', e.target.value)}
              />
              <label htmlFor="moderate">Moderate</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="night"
                name="sleepSchedule"
                value="night"
                checked={formData.sleepSchedule === 'night'}
                onChange={(e) => handleChange('sleepSchedule', e.target.value)}
              />
              <label htmlFor="night">Night Owl</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Smoking</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="smoking-no"
                name="smoking"
                value="no"
                checked={formData.smoking === 'no'}
                onChange={(e) => handleChange('smoking', e.target.value)}
              />
              <label htmlFor="smoking-no">No</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="smoking-occasionally"
                name="smoking"
                value="occasionally"
                checked={formData.smoking === 'occasionally'}
                onChange={(e) => handleChange('smoking', e.target.value)}
              />
              <label htmlFor="smoking-occasionally">Occasionally</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="smoking-yes"
                name="smoking"
                value="yes"
                checked={formData.smoking === 'yes'}
                onChange={(e) => handleChange('smoking', e.target.value)}
              />
              <label htmlFor="smoking-yes">Yes</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Drinking</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="drinking-no"
                name="drinking"
                value="no"
                checked={formData.drinking === 'no'}
                onChange={(e) => handleChange('drinking', e.target.value)}
              />
              <label htmlFor="drinking-no">No</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="drinking-socially"
                name="drinking"
                value="socially"
                checked={formData.drinking === 'socially'}
                onChange={(e) => handleChange('drinking', e.target.value)}
              />
              <label htmlFor="drinking-socially">Socially</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="drinking-regularly"
                name="drinking"
                value="regularly"
                checked={formData.drinking === 'regularly'}
                onChange={(e) => handleChange('drinking', e.target.value)}
              />
              <label htmlFor="drinking-regularly">Regularly</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Social Level: {formData.socialLevel}/10</label>
          <div className="slider-container">
            <input
              type="range"
              className="slider"
              min="1"
              max="10"
              value={formData.socialLevel}
              onChange={(e) => handleChange('socialLevel', parseInt(e.target.value))}
            />
            <div className="slider-labels">
              <span>Introvert</span>
              <span>Extrovert</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={onBack} disabled={loading}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Find Matches'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default LifestylePreferences;
