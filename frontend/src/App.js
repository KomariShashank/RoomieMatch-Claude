import React, { useState, useEffect } from 'react';
import './App.css';
import './App_desktop.css';
import './App_modern.css';
import './App_pages.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import LifestylePreferences from './components/LifestylePreferences';
import Matches from './components/Matches';
import ConnectRoommate from './components/ConnectRoommate';
import ChatScreen from './components/ChatScreen';

/**
 * AppContent - Main application component with routing logic
 * Handles screen navigation and route protection
 */
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchesData, setMatchesData] = useState([]);
  const { isAuthenticated } = useAuth();

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'login') {
      setCurrentScreen('login');
    }
  }, [isAuthenticated, currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onNext={() => setCurrentScreen('lifestyle')} />;
      case 'lifestyle':
        return (
          <LifestylePreferences
            onNext={(matches) => {
              console.log('📦 App.js received matches:', matches);
              setMatchesData(matches);
              setCurrentScreen('matches');
            }}
            onBack={() => setCurrentScreen('login')}
          />
        );
      case 'matches':
        return (
          <Matches
            matches={matchesData}
            onBack={() => setCurrentScreen('lifestyle')}
            onLogout={() => setCurrentScreen('login')}
            onConnect={(match) => {
              setSelectedMatch(match);
              setCurrentScreen('connect');
            }}
          />
        );
      case 'connect':
        return (
          <ConnectRoommate
            match={selectedMatch}
            onBack={() => setCurrentScreen('matches')}
            onChat={() => setCurrentScreen('chat')}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            match={selectedMatch}
            onBack={() => setCurrentScreen('connect')}
          />
        );
      default:
        return <Login onNext={() => setCurrentScreen('lifestyle')} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

/**
 * App - Root component wrapped with AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
