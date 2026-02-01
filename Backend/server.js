const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Initialize Express
const app = express();

// 4. Middlewares
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 5. Routes
// Auth Route (Login/Register)
app.use('/api/auth', require('./routes/auth'));

// Upload Route (PDFs & Images via Cloudinary)
app.use('/api/upload', require('./routes/upload'));

// Data Route (Profile, Projects, Certificates)
app.use('/api/data', require('./routes/api'));

// 6. Test Route (To check if server is alive)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;