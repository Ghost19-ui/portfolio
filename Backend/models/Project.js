const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }], // Array of strings like ['React', 'Node']
  liveLink: { type: String },
  imageUrl: { type: String } // Cloudinary Image URL
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);