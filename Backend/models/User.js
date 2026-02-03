const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // --- AUTH CREDENTIALS ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hidden by default
  role: { type: String, default: 'admin' },

  // --- PORTFOLIO DATA (Merged from Profile.js) ---
  bio: { type: String, default: 'Cybersecurity Enthusiast & Developer' },
  phone: { type: String },
  
  // Social Links
  github: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  
  // Resume (PDF URL from Cloudinary)
  resumeUrl: { type: String },

  // Skills (Simple array of strings)
  skills: [{ type: String }] 
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password Method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);