import React from 'react';

function BasicInfo({ userData, updateUserData, onNext, onBack }) {
  const handleChange = (field, value) => {
    updateUserData({ [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.name && userData.age && userData.budget && userData.location) {
      onNext();
    }
  };

  const isFormValid = userData.name && userData.age && userData.budget && userData.location;

  return (
    <div className="screen-container">
      <div className="screen-hero">
        <div className="hero-icon">👤</div>
        <div className="hero-content">
          <h1>About You</h1>
          <p>Help us understand your basic requirements and preferences</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">📝</span>
              <span>Quick & Easy</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">⚡</span>
              <span>Instant Matching</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header">
          <h1>Basic Information</h1>
          <p>Tell us a bit about yourself</p>
        </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={userData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            placeholder="Enter your age"
            value={userData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            min="18"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Monthly Budget ($)</label>
          <input
            type="number"
            id="budget"
            placeholder="Enter your monthly budget"
            value={userData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Preferred Location</label>
          <input
            type="text"
            id="location"
            placeholder="e.g., Downtown, Suburbs"
            value={userData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
            Next
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default BasicInfo;
