import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Copy, Check, Loader } from 'lucide-react';
import axios from 'axios';
import './App.css';

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const containerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');
  const messagesEndRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const adjustTextareaHeight = (e) => {
    const element = e.target;
    setTextareaHeight('auto');
    const scrollHeight = element.scrollHeight;
    setTextareaHeight(`${scrollHeight}px`);
  };

  const handleCopy = (messageId, messageText) => {
    navigator.clipboard.writeText(messageText);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const userMessage = {
        id: Date.now(),
        text: newMessage.trim(),
        isUser: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setTextareaHeight('auto');

      const response = await axios.post('http://localhost:5001/api/message', {
        message: userMessage.text,
        sender: 'user'
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.botReply,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response 
        ? `Server Error: ${error.response.status}` 
        : 'Failed to connect to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="app-container"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <motion.div 
        className="greeting-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="greeting">
          {greeting}, <span className="user-name">Karthik</span> 👋
        </h2>
      </motion.div>

      <div className="chat-container">
        <motion.div 
          className="chat-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1>AI Chat Assistant</h1>
        </motion.div>

        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message-wrapper ${message.isUser ? 'user' : 'bot'}`}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <div className={`avatar ${message.isUser ? 'user' : 'bot'}`}>
                  {message.isUser ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`message ${message.isUser ? 'user' : 'bot'}`}>
                  <div className="message-content">
                    {message.text}
                    {!message.isUser && (
                      <button 
                        className="copy-button"
                        onClick={() => handleCopy(message.id, message.text)}
                      >
                        {copiedMessageId === message.id ? (
                          <Check size={16} className="copied-icon" />
                        ) : (
                          <Copy size={16} className="copy-icon" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
              className="message-wrapper bot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="avatar bot">
                <Bot size={20} />
              </div>
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="error-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {error}
              <button 
                className="error-close"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="input-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="input-form">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                adjustTextareaHeight(e);
              }}
              style={{ height: textareaHeight }}
              placeholder="Type your message here..."
              disabled={loading}
              className="message-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <motion.button 
              type="submit" 
              disabled={loading || !newMessage.trim()}
              className="send-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <Loader className="spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
