const express = require('express');
const router = express.Router();
const User = require('../models/UserModel'); // 👈 NEW NAME
const Project = require('../models/Project'); // 👈 NOW EXISTS
const Certificate = require('../models/Certificate');
const { submitContact } = require('../controllers/contactController');

router.get('/all-public-data', async (req, res) => {
  try {
    const profile = await User.findOne({ role: 'admin' }).select('-password');
    const projects = await Project.find().sort({ createdAt: -1 });
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json({ profile: profile || {}, projects, certificates });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/contact', submitContact);
module.exports = router;