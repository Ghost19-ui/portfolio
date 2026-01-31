const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get Profile Data (Public)
// @route   GET /api/profile
router.get('/', async (req, res) => {
  try {
    // We only need one profile, so we always fetch the first one
    let profile = await Profile.findOne();
    
    // If no profile exists yet, create a default one
    if (!profile) {
      profile = await Profile.create({});
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update Profile Data (Admin Only)
// @route   PUT /api/profile
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      // Update fields
      profile.name = req.body.name || profile.name;
      profile.role = req.body.role || profile.role;
      profile.bio = req.body.bio || profile.bio;
      profile.skills = req.body.skills || profile.skills;
      profile.socials = req.body.socials || profile.socials;
    }

    const updatedProfile = await profile.save();
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Update Failed' });
  }
});

module.exports = router;