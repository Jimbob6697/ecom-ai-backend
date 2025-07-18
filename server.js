const express = require('express');
const cors = require('cors'); // import cors middleware
const app = express();

require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

// Allow requests only from your Shopify store domain (replace below)
const allowedOrigins = [
  'https://juh40d-j1.myshopify.com', // your Shopify store domain here
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use('/api', analyzeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
