const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express
const app = express();

// 3. MANUAL CORS MIDDLEWARE (The Fix)
// We handle this manually to ensure Vercel never blocks the Preflight check
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://portfolio-seven-black-as1rtezo05.vercel.app",
    "https://portfolio-git-main-tushar-sainis-projects-71462a97.vercel.app",
    "https://portfolio-cgpo.vercel.app"
  ];

  const origin = req.headers.origin;

  // If the origin is allowed, echo it back
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Always allow these methods and headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle Preflight (OPTIONS) requests immediately with 200 OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 4. Connect to MongoDB (After middleware is ready)
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