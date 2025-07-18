// Express server setup
const express = require('express');
const app = express();

require('dotenv').config();
const analyzeRoute = require('./routes/analyze');
app.use(express.json());
app.use('/api', analyzeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));