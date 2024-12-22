const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  credentials: true
}));
app.use(express.json());

// Gemini AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Serverless-style handler function
const messageHandler = async (req, res) => {
  const { message, sender } = req.body;

  if (!message || !sender) {
    return res.status(400).json({ error: 'Message and sender are required' });
  }

  try {
    // Log user message
    console.log(`User: ${message}`);

    // Get Gemini response
    const result = await model.generateContent(message);
    const botReply = result.response.text();

    // Log bot response
    console.log(`Bot: ${botReply}`);

    // Send bot reply as response
    return res.json({ botReply });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error.message
    });
  }
};

// Use the handler in Express route
app.post('/api/message', messageHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));