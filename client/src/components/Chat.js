import React from 'react';
import PropTypes from 'prop-types';
import './Chat.css'; // Assuming you have a CSS file for styling

const Chat = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((message) => (
        <div
          key={message.id || message.timestamp || Date.now()} // Use unique id, timestamp, or Date.now() as fallback
          className={`message ${message.isUserMessage ? 'user-message' : 'bot-message'}`} // Dynamically assign classes
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      timestamp: PropTypes.string,
      isUserMessage: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Chat;