const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/UserModel'); // 👈 FIXED IMPORT

// Import Controllers
const { createProject, deleteProject } = require('../controllers/projectController');
const { createCertificate, deleteCertificate } = require('../controllers/certificateController');
const { getMessages, deleteMessage } = require('../controllers/contactController');

// Projects
router.post('/project', protect, createProject);
router.delete('/project/:id', protect, deleteProject);

// Certificates
router.post('/certificate', protect, createCertificate);
router.delete('/certificate/:id', protect, deleteCertificate);

// Messages
router.get('/messages', protect, getMessages);
router.delete('/messages/:id', protect, deleteMessage);

// Profile Update
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;