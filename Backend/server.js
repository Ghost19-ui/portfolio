const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express FIRST (Before DB)
const app = express();

// 3. CORS Middleware (The Gatekeeper) - MUST BE FIRST
// This ensures headers are sent even if DB fails
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://portfolio-seven-black-as1rtezo05.vercel.app",
    "https://portfolio-git-main-tushar-sainis-projects-71462a97.vercel.app",
    "https://portfolio-cgpo.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));

// Handle Preflight requests explicitly
app.options('*', cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 4. Connect to MongoDB Atlas (After middleware is set)
// We remove the 'process.exit' so the server doesn't crash silently
connectDB().then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.error("Database connection error:", err);
});

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/upload', require('./routes/upload'));

// Support both frontend path styles
app.use('/api/data', require('./routes/api'));
app.use('/api', require('./routes/api')); 

// 6. Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;