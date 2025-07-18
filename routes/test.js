const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const sendGridKey = process.env.SENDGRID_API_KEY;

  if (!openAiKey || !sendGridKey) {
    return res.status(500).json({
      success: false,
      message: 'Missing one or more required environment variables.',
      keys: {
        OPENAI_API_KEY: !!openAiKey,
        SENDGRID_API_KEY: !!sendGridKey
      }
    });
  }

  res.json({
    success: true,
    message: 'All environment variables are loaded correctly.',
    keys: {
      OPENAI_API_KEY: true,
      SENDGRID_API_KEY: true
    }
  });
});

module.exports = router;
