import React, { useState } from 'react';

function ConnectRoommate({ match, onBack, onChat }) {
  const [showCallPopup, setShowCallPopup] = useState(false);
  const phoneNumber = '(555) 123-4567';
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

  return (
    <div className="screen-container connect-container">
      <div className="screen-header">
        <h1>Connect with Your Roommate</h1>
        <p>Start building your connection</p>
      </div>

      <div className="connect-profile">
        <div className="profile-photo">
          <div className="profile-placeholder">
            {match.full_name.charAt(0)}
          </div>
        </div>

        <div className="profile-details">
          <h2>{match.full_name}</h2>
          <div className="profile-basic-info">
            <span className="info-badge">👤 {match.age} years old</span>
            <span className="info-badge">🎯 {match.score}% Compatible</span>
          </div>
        </div>

        <div className="lifestyle-summary">
          <h3>Lifestyle Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-icon">✨</span>
              <div className="summary-content">
                <strong>Cleanliness</strong>
                <p>{match.cleanliness_level}/10</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🌙</span>
              <div className="summary-content">
                <strong>Sleep Schedule</strong>
                <p>{getSleepScheduleLabel(match.sleep_schedule)}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🚭</span>
              <div className="summary-content">
                <strong>Smoking</strong>
                <p>{getSmokingLabel(match.smoking)}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🍷</span>
              <div className="summary-content">
                <strong>Drinking</strong>
                <p>{getDrinkingLabel(match.drinking)}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">👥</span>
              <div className="summary-content">
                <strong>Social Level</strong>
                <p>{match.social_level}/10</p>
              </div>
            </div>
          </div>
        </div>

        <div className="connect-actions">
          <button className="btn btn-connect btn-chat" onClick={onChat}>
            💬 Chat
          </button>
          <button className="btn btn-connect btn-call" onClick={() => setShowCallPopup(true)}>
            📞 Call
          </button>
        </div>

        {showCallPopup && (
          <div className="call-popup-overlay" onClick={() => setShowCallPopup(false)}>
            <div className="call-popup" onClick={(e) => e.stopPropagation()}>
              <div className="call-icon">📞</div>
              <h3>Calling...</h3>
              <p className="call-number">{phoneNumber}</p>
              <p className="call-name">{match.full_name}</p>
              <button className="btn btn-end-call" onClick={() => setShowCallPopup(false)}>
                End Call
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Matches
        </button>
      </div>
    </div>
  );
}

export default ConnectRoommate;
