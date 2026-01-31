// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../controllers/logController');
const { getMessages, saveMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for Contact page
router.post('/messages', saveMessage);
router.post('/logs', createLog);

// Protected routes for Admin Dashboard
router.get('/messages', protect, getMessages);
router.get('/logs', protect, getLogs);

module.exports = router;