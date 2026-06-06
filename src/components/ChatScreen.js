import React, { useState } from 'react';

function ChatScreen({ match, onBack }) {
  const [messageInput, setMessageInput] = useState('');
  
  // Predefined chat messages
  const messages = [
    {
      id: 1,
      sender: 'roommate',
      text: 'Hey! Nice to match with you 😊',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Hi! Looking forward to chatting',
      time: '10:32 AM'
    },
    {
      id: 3,
      sender: 'roommate',
      text: 'Tell me a bit about your lifestyle?',
      time: '10:33 AM'
    }
  ];

  const handleSend = () => {
    // UI only - no actual functionality
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="screen-container chat-screen">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="chat-header-info">
          <div className="chat-avatar">{match.full_name.charAt(0)}</div>
          <div className="chat-header-text">
            <h2>{match.full_name}</h2>
            <span className="online-status">● Online</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-roommate'}`}
          >
            <div className="message-bubble">
              <p>{message.text}</p>
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatScreen;
