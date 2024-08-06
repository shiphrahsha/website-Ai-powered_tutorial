// src/components/Help.js
import React, { useState } from 'react';
import './Help.css'; // Import the CSS file for Help

const Help = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { user: true, text: message }]);
      setMessage('');
      // Here you can also handle sending the message to a chatbot API
    }
  };

  return (
    <div className="help-container">
      <button className="help-button" onClick={toggleChatbot}>
        Help
      </button>
      {isChatbotOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <h4>Chatbot</h4>
            <button className="close-button" onClick={toggleChatbot}>×</button>
          </div>
          <div className="chatbot-content">
            <div className="chat-history">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.user ? 'user-message' : 'bot-message'}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
