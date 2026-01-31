const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: { type: String },
  role: { type: String, default: 'RED TEAM OPERATOR' },
  email: { type: String },
  phone: { type: String },
  github: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  resumeUrl: { type: String } // Stores the Cloudinary PDF URL
});

// We only need one profile document ever.
module.exports = mongoose.model('Profile', ProfileSchema);