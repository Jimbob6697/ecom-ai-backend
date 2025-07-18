// routes/test.js
const express = require('express');
const router = express.Router();
const { Configuration, OpenAI } = require('openai');

router.get('/', async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say hello from the test route!' }],
    });

    res.json({ success: true, response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI test failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
