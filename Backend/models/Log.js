const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  event: { type: String, required: true }, // e.g., "USER_LOGIN", "CONTACT_FORM_SUBMISSION"
  level: { type: String, default: 'info' }, // info, warning, error
  message: { type: String },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);