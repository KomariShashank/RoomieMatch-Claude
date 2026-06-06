import React, { useState } from 'react';

function ConnectRoommate({ match, onBack, onChat }) {
  const [showCallPopup, setShowCallPopup] = useState(false);
  const phoneNumber = '(555) 123-4567';
  const getSleepScheduleLabel = (schedule) => {
    const labels = {
      early: 'Early Bird',
      moderate: 'Moderate',
      night: 'Night Owl'
    };
    return labels[schedule] || schedule;
  };

  const getSmokingLabel = (smoking) => {
    const labels = {
      no: 'Non-smoker',
      occasionally: 'Occasional smoker',
      yes: 'Smoker'
    };
    return labels[smoking] || smoking;
  };

  const getDrinkingLabel = (drinking) => {
    const labels = {
      no: 'Non-drinker',
      socially: 'Social drinker',
      regularly: 'Regular drinker'
    };
    return labels[drinking] || drinking;
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
            {match.name.charAt(0)}
          </div>
        </div>

        <div className="profile-details">
          <h2>{match.name}</h2>
          <div className="profile-basic-info">
            <span className="info-badge">👤 {match.age} years old</span>
            <span className="info-badge">💰 ${match.budget}/month</span>
            <span className="info-badge">📍 {match.location}</span>
          </div>
        </div>

        <div className="lifestyle-summary">
          <h3>Lifestyle Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-icon">✨</span>
              <div className="summary-content">
                <strong>Cleanliness</strong>
                <p>{match.cleanliness}/10</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🌙</span>
              <div className="summary-content">
                <strong>Sleep Schedule</strong>
                <p>{getSleepScheduleLabel(match.sleepSchedule)}</p>
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
                <p>{match.socialLevel}/10</p>
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
              <p className="call-name">{match.name}</p>
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
