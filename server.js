const express = require('express');
const app = express();

require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

app.use(express.json());
app.use('/api', analyzeRoute);

// Debug route to check if OPENAI_API_KEY is loaded
app.get('/debug-env', (req, res) => {
  res.json({ OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'FOUND' : 'NOT FOUND' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
