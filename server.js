// Express server setup
const express = require('express');
const app = express();

require('dotenv').config();
const analyzeRoute = require('./routes/analyze');
const testRoute = require('./routes/test'); // ← ADD THIS

app.use(express.json());
app.use('/api', analyzeRoute);
app.use('/test', testRoute); // ← ADD THIS

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('API is running. Use /api or /test endpoints.');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
