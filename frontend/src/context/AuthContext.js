/**
 * Authentication Context for RoomieMatch
 * Manages user authentication state and provides login/logout functionality
 */

import React, { createContext, useContext, useState } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * Custom hook to use the Auth Context
 * Throws error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state to all children
 */
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [authState, setAuthState] = useState({
    access_token: null,
    user_id: null,
    full_name: null
  });

  /**
   * Login function - saves authentication data to state
   * @param {string} access_token - JWT token from backend
   * @param {string} user_id - User's unique ID
   * @param {string} full_name - User's full name
   */
  const login = (access_token, user_id, full_name) => {
    setAuthState({
      access_token,
      user_id,
      full_name
    });
  };

  /**
   * Logout function - clears all authentication data
   */
  const logout = () => {
    setAuthState({
      access_token: null,
      user_id: null,
      full_name: null
    });
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} true if user has a valid token
   */
  const isAuthenticated = !!authState.access_token;

  // Context value provided to children
  const value = {
    ...authState,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
