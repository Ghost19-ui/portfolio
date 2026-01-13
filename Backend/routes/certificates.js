const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/v1/certificates (Public)
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/v1/certificates (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    const newCert = await cert.save();
    res.status(201).json(newCert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route DELETE /api/v1/certificates/:id (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;