// Analyze route
const express = require('express');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  res.json({ sales_estimate: '10k/mo', traffic_rank: 'Top 5%', social_media: 'Strong IG presence', improvements: 'Add reviews, improve speed', heatmap_image_url: 'https://via.placeholder.com/800x400', heatmap_insights: ['High drop-off on cart page'] });
});

router.get('/test-keys', (req, res) => {
  const openai = process.env.OPENAI_API_KEY;
  const sendgrid = process.env.SENDGRID_API_KEY;
  if (openai && sendgrid) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: 'Missing keys' });
  }
});

module.exports = router;