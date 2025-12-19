const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Programming Languages', 'Web Development', 'Cybersecurity', 'Tools', 'Other'],
    },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
