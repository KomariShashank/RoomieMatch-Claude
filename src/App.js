import React, { useState } from 'react';
import './App.css';
import './App_desktop.css';
import './App_modern.css';
import './App_pages.css';
import Login from './components/Login';
import BasicInfo from './components/BasicInfo';
import LifestylePreferences from './components/LifestylePreferences';
import Matches from './components/Matches';
import ConnectRoommate from './components/ConnectRoommate';
import ChatScreen from './components/ChatScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    budget: '',
    location: '',
    cleanliness: 5,
    sleepSchedule: 'moderate',
    smoking: 'no',
    drinking: 'socially',
    socialLevel: 5
  });

  const updateUserData = (data) => {
    setUserData({ ...userData, ...data });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onNext={() => setCurrentScreen('basicInfo')} />;
      case 'basicInfo':
        return (
          <BasicInfo
            userData={userData}
            updateUserData={updateUserData}
            onNext={() => setCurrentScreen('lifestyle')}
            onBack={() => setCurrentScreen('login')}
          />
        );
      case 'lifestyle':
        return (
          <LifestylePreferences
            userData={userData}
            updateUserData={updateUserData}
            onNext={() => setCurrentScreen('matches')}
            onBack={() => setCurrentScreen('basicInfo')}
          />
        );
      case 'matches':
        return (
          <Matches
            userData={userData}
            onBack={() => setCurrentScreen('lifestyle')}
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
        return <Login onNext={() => setCurrentScreen('basicInfo')} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;
