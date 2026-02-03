const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB Atlas
connectDB().catch(err => {
  console.error("Database connection failed", err);
  process.exit(1);
});

// 3. Initialize Express
const app = express();

// 4. Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://portfolio-cgpo.vercel.app",
    "https://portfolio-seven-black-as1rtezo05.vercel.app", // 👈 THIS IS THE FIX (From your error)
    "https://portfolio-git-main-tushar-sainis-projects-71462a97.vercel.app"
  ],
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/upload', require('./routes/upload'));

// --- CRITICAL FIX: Support both frontend path styles ---
// For Home Page (calls /api/data/...)
app.use('/api/data', require('./routes/api'));
// For Projects/Certs Pages (calls /api/projects)
app.use('/api', require('./routes/api')); 

// 6. Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 7. Start Server (Conditional for Vercel)
const PORT = process.env.PORT || 5000;
// Only listen if NOT in production (Vercel handles this automatically)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;