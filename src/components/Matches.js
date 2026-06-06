import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Matches({ matches: initialMatches, onBack, onLogout, onConnect }) {
  const { access_token, logout } = useAuth();
  const [matches] = useState(initialMatches || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState(null);
  const [loading] = useState(false);
  const [error] = useState('');

  console.log('🎯 Matches component loaded');
  console.log('🔑 Token:', access_token ? 'Token exists' : 'NO TOKEN!');
  console.log('📊 Matches received:', matches);

  const currentMatch = matches[currentIndex];
  const hasMoreMatches = currentIndex < matches.length;

  const handleAction = (actionType, match) => {
    setAction(actionType);
    
    if (actionType === 'liked' && onConnect) {
      // Navigate to connect screen after a short delay
      setTimeout(() => {
        onConnect(match);
      }, 1000);
    } else if (actionType === 'passed') {
      // Move to next profile after a short delay
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAction(null);
      }, 800);
    }
  };

  const getSleepScheduleLabel = (schedule) => {
    // Backend returns: "Early bird", "Flexible", "Night owl"
    return schedule || 'Not specified';
  };

  const getSmokingLabel = (smoking) => {
    // Backend returns boolean: true or false
    if (typeof smoking === 'boolean') {
      return smoking ? 'Smoker' : 'Non-smoker';
    }
    return 'Not specified';
  };

  const getDrinkingLabel = (drinking) => {
    // Backend returns boolean: true or false
    if (typeof drinking === 'boolean') {
      return drinking ? 'Drinks' : 'Non-drinker';
    }
    return 'Not specified';
  };

  if (loading) {
    return (
      <div className="screen-container matches-container">
        <div className="screen-header">
          <h1>Your Matches</h1>
          <p>Loading your matches...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container matches-container">
        <div className="screen-header">
          <h1>Your Matches</h1>
          <p>Error loading matches</p>
        </div>
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          {error}
        </div>
        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>
            Back to Preferences
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container matches-container">
      <div className="screen-header">
        <h1>Your Matches</h1>
        <p>Based on your lifestyle preferences</p>
      </div>

      {!hasMoreMatches ? (
        <div className="no-matches">
          <div className="no-matches-icon">😔</div>
          <h2>No More Matches Available</h2>
          <p>You've reviewed all available roommate profiles. Check back later for new matches!</p>
        </div>
      ) : (
        <div className="match-card">
          <div className="match-header">
            <div className="match-avatar">{currentMatch.full_name.charAt(0)}</div>
            <div className="match-header-content">
              <div className="match-name">{currentMatch.full_name}</div>
              <div className="match-score">{currentMatch.score}% Match</div>
            </div>
          </div>

          <div className="match-counter">
            Profile {currentIndex + 1} of {matches.length}
          </div>

          <div className="match-info">
            <p><strong>Age:</strong> {currentMatch.age}</p>
            <p><strong>Cleanliness:</strong> {currentMatch.cleanliness_level}/10</p>
            <p><strong>Sleep Schedule:</strong> {getSleepScheduleLabel(currentMatch.sleep_schedule)}</p>
            <p><strong>Smoking:</strong> {getSmokingLabel(currentMatch.smoking)}</p>
            <p><strong>Drinking:</strong> {getDrinkingLabel(currentMatch.drinking)}</p>
            <p><strong>Social Level:</strong> {currentMatch.social_level}/10</p>
          </div>

          {!action ? (
            <div className="match-actions">
              <button
                className="btn btn-like"
                onClick={() => handleAction('liked', currentMatch)}
              >
                👍 Like
              </button>
              <button
                className="btn btn-pass"
                onClick={() => handleAction('passed', currentMatch)}
              >
                👎 Pass
              </button>
            </div>
          ) : (
            <div className={`action-message ${action}`}>
              {action === 'liked' 
                ? `✓ You liked ${currentMatch.full_name}! Connecting...`
                : `✗ You passed on ${currentMatch.full_name}.`
              }
            </div>
          )}
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Preferences
        </button>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Matches;
