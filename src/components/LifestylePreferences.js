import React from 'react';

function LifestylePreferences({ userData, updateUserData, onNext, onBack }) {
  const handleChange = (field, value) => {
    updateUserData({ [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
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
          <label>Cleanliness Level: {userData.cleanliness}/10</label>
          <div className="slider-container">
            <input
              type="range"
              className="slider"
              min="1"
              max="10"
              value={userData.cleanliness}
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
                checked={userData.sleepSchedule === 'early'}
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
                checked={userData.sleepSchedule === 'moderate'}
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
                checked={userData.sleepSchedule === 'night'}
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
                checked={userData.smoking === 'no'}
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
                checked={userData.smoking === 'occasionally'}
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
                checked={userData.smoking === 'yes'}
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
                checked={userData.drinking === 'no'}
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
                checked={userData.drinking === 'socially'}
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
                checked={userData.drinking === 'regularly'}
                onChange={(e) => handleChange('drinking', e.target.value)}
              />
              <label htmlFor="drinking-regularly">Regularly</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Social Level: {userData.socialLevel}/10</label>
          <div className="slider-container">
            <input
              type="range"
              className="slider"
              min="1"
              max="10"
              value={userData.socialLevel}
              onChange={(e) => handleChange('socialLevel', parseInt(e.target.value))}
            />
            <div className="slider-labels">
              <span>Introvert</span>
              <span>Extrovert</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Find Matches
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default LifestylePreferences;
