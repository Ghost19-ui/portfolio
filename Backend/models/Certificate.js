const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String }, // e.g., "Aug 2025"
  image: { type: String, required: true }, // URL to the uploaded file
  link: { type: String }, // URL to verify credential (optional)
  type: { type: String, default: 'image' } // 'image' or 'pdf'
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);