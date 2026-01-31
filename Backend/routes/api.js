const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');

// ================= PUBLIC ROUTES (For Home Page) ================= //

// GET /api/data/all-public-data
// Fetches Profile, Projects, and Certs in one call for the homepage
router.get('/all-public-data', async (req, res) => {
  try {
    // Get the single profile document, or return an empty object if none exists
    let profile = await Profile.findOne();
    if (!profile) profile = {}; 
    
    const projects = await Project.find().sort({ createdAt: -1 });
    const certificates = await Certificate.find().sort({ createdAt: -1 });

    res.json({ profile, projects, certificates });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// ================= PROTECTED ROUTES (For Admin Panel) ================= //

// --- PROFILE ---
// PUT /api/data/profile (Update profile details and resume URL)
router.put('/profile', protect, async (req, res) => {
  try {
    // upsert: true means "create if it doesn't exist, update if it does"
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- PROJECTS ---
// POST /api/data/project (Create new project)
router.post('/project', protect, async (req, res) => {
    try {
      const newProject = new Project(req.body);
      const saved = await newProject.save();
      res.json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

// --- CERTIFICATES ---
// POST /api/data/certificate (Create new certificate)
router.post('/certificate', protect, async (req, res) => {
    try {
      const newCert = new Certificate(req.body);
      const saved = await newCert.save();
      res.json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

module.exports = router;