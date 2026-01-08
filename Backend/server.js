const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allowed origins: Localhost and your Vercel deployment
    if (!origin || origin.includes('localhost') || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => res.send('API running'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/projects', require('./routes/projects'));
app.use('/api/v1/contact', require('./routes/contact'));
app.use('/api/v1/content', require('./routes/content'));

// --- NEW PROFILE ROUTE ---
app.use('/api/v1/profile', require('./routes/profile'));

app.use(errorHandler);
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✓ Local Server running on port ${PORT}`));
}

module.exports = app;