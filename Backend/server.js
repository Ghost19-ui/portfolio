const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Make sure to npm install cors if needed
const connectDB = require('./config/db');

dotenv.config();

// Initialize App
const app = express();

// Simple, Standard CORS
// We allow credentials just in case, but the Proxy handles the heavy lifting now.
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Connect to Database
connectDB().then(() => console.log("MongoDB Connected"))
           .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/upload', require('./routes/upload'));
// Support standard /api route
app.use('/api', require('./routes/api')); 

app.get('/', (req, res) => res.send('Backend is running...'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;