const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const { submitContact } = require('../controllers/contactController');

// @route   GET /api/data/all-public-data
// @desc    Get Profile, Projects, and Certs for Home Page
router.get('/all-public-data', async (req, res) => {
  try {
    // 1. Get the Admin User (Profile)
    // We assume the first user found is the admin/owner
    const profile = await User.findOne().select('-password');

    // 2. Get Projects & Certs
    const projects = await Project.find().sort({ createdAt: -1 });
    const certificates = await Certificate.find().sort({ createdAt: -1 });

    res.json({
      profile: profile || {}, // Return empty obj if no user yet
      projects,
      certificates
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/data/contact
// @desc    Public Contact Form Submission
router.post('/contact', submitContact);

module.exports = router;