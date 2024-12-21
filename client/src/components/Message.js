import React from 'react';
import PropTypes from 'prop-types';
import './Message.css'; // Import a separate CSS file for styling

const Message = ({ sender, content, isUserMessage, timestamp }) => {
  return (
    <div className={`message ${isUserMessage ? 'user-message' : 'bot-message'}`}>
      <div className="message-header">
        <strong>{sender || 'Unknown'}</strong>
        {timestamp && <span className="message-timestamp">{new Date(timestamp).toLocaleString()}</span>}
      </div>
      <p>{content || 'No content'}</p>
    </div>
  );
};

Message.propTypes = {
  sender: PropTypes.string,
  content: PropTypes.string.isRequired,
  isUserMessage: PropTypes.bool.isRequired,
  timestamp: PropTypes.string,
};

export default Message;