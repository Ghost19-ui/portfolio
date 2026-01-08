const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Tushar Saini' },
  role: { type: String, default: 'Red Team Operator' },
  bio: { type: String, default: 'B.Tech CSE Student specializing in Offensive Security.' },
  skills: { type: [String], default: ['Python', 'Kali Linux', 'Burp Suite'] },
  socials: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    other: { type: String, default: '' }, // <--- ADDED THIS NEW FIELD
    resume: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);