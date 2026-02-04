const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // 👈 Import Mongoose directly here

dotenv.config();

// Initialize App
const app = express();

// --- 1. PROXY/CORS SETUP ---
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 2. DATABASE CONNECTION (Moved Inside) ---
const connectDB = async () => {
  try {
    // We use the variable from Vercel Settings
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in Vercel, just log it
  }
};

// Connect immediately
connectDB();

// --- 3. ROUTES ---
// (Ensure these require paths are correct. If these fail, we check folders next)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/upload', require('./routes/upload'));
app.use('/api', require('./routes/api')); 

app.get('/', (req, res) => res.send('Backend is running...'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;