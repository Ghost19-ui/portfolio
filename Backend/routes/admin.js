const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');

// --- PROFILE ROUTES ---

// Get Profile Data
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Update Profile (FIXED: Sanitized Inputs)
router.put('/profile', protect, async (req, res) => {
    try {
        // 1. Manually extract allowed fields. 
        // We DO NOT extract 'role', so it cannot be overwritten by mistake.
        const { 
            name, 
            title, // 👈 This is for "Red Team Operator"
            bio, 
            email, 
            phone, 
            github, 
            linkedin, 
            instagram, 
            resumeUrl 
        } = req.body;

        // 2. Create the update object
        const updates = { 
            name, 
            title, 
            bio, 
            email, 
            phone, 
            github, 
            linkedin, 
            instagram, 
            resumeUrl 
        };

        // 3. Update the user with only the allowed fields
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updates, 
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- PROJECT ROUTES ---

router.post('/project', protect, async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CERTIFICATE ROUTES ---

router.post('/certificate', protect, async (req, res) => {
    try {
        const newCert = await Certificate.create(req.body);
        res.json(newCert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;