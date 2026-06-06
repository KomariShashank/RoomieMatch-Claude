import React, { useState } from 'react';

function Matches({ userData, onBack, onConnect }) {
  // All available matches
  const allMatches = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 26,
      budget: 1200,
      location: 'Downtown',
      cleanliness: 8,
      sleepSchedule: 'moderate',
      smoking: 'no',
      drinking: 'socially',
      socialLevel: 7,
      matchScore: 92
    },
    {
      id: 2,
      name: 'Mike Chen',
      age: 24,
      budget: 1000,
      location: 'Suburbs',
      cleanliness: 6,
      sleepSchedule: 'night',
      smoking: 'no',
      drinking: 'socially',
      socialLevel: 8,
      matchScore: 85
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      age: 28,
      budget: 1500,
      location: 'Downtown',
      cleanliness: 9,
      sleepSchedule: 'early',
      smoking: 'no',
      drinking: 'no',
      socialLevel: 5,
      matchScore: 78
    },
    {
      id: 4,
      name: 'Alex Thompson',
      age: 25,
      budget: 1100,
      location: 'Midtown',
      cleanliness: 7,
      sleepSchedule: 'moderate',
      smoking: 'no',
      drinking: 'socially',
      socialLevel: 6,
      matchScore: 88
    },
    {
      id: 5,
      name: 'Jessica Lee',
      age: 27,
      budget: 1300,
      location: 'Downtown',
      cleanliness: 9,
      sleepSchedule: 'early',
      smoking: 'no',
      drinking: 'no',
      socialLevel: 4,
      matchScore: 81
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState(null);

  const currentMatch = allMatches[currentIndex];
  const hasMoreMatches = currentIndex < allMatches.length;

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
            <div className="match-avatar">{currentMatch.name.charAt(0)}</div>
            <div className="match-header-content">
              <div className="match-name">{currentMatch.name}</div>
              <div className="match-score">{currentMatch.matchScore}% Match</div>
            </div>
          </div>

          <div className="match-counter">
            Profile {currentIndex + 1} of {allMatches.length}
          </div>

          <div className="match-info">
            <p><strong>Age:</strong> {currentMatch.age}</p>
            <p><strong>Budget:</strong> ${currentMatch.budget}/month</p>
            <p><strong>Location:</strong> {currentMatch.location}</p>
            <p><strong>Cleanliness:</strong> {currentMatch.cleanliness}/10</p>
            <p><strong>Sleep Schedule:</strong> {getSleepScheduleLabel(currentMatch.sleepSchedule)}</p>
            <p><strong>Smoking:</strong> {getSmokingLabel(currentMatch.smoking)}</p>
            <p><strong>Drinking:</strong> {getDrinkingLabel(currentMatch.drinking)}</p>
            <p><strong>Social Level:</strong> {currentMatch.socialLevel}/10</p>
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
                ? `✓ You liked ${currentMatch.name}! Connecting...`
                : `✗ You passed on ${currentMatch.name}.`
              }
            </div>
          )}
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Preferences
        </button>
      </div>
    </div>
  );
}

export default Matches;
