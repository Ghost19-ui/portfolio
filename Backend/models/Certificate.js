const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String },
  certUrl: { type: String } // Can be Image or PDF URL
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);