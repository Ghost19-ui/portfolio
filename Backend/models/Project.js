const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  techStack: {
    type: [String], // Array of strings
    required: true
  },
  imageUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  liveLink: {
    type: String
  },
  repoLink: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);