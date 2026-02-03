const Contact = require('../models/Contact');

// @desc    Submit new contact message
// @route   POST /api/contact
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      const err = new Error('Please provide name, email, and message');
      err.status = 400;
      return next(err);
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject: subject || 'No Subject',
      message,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json(contact); // Return raw object
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (Admin)
// @route   GET /api/admin/messages
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    // --- FIX: Return RAW ARRAY ---
    res.status(200).json(messages); 
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};