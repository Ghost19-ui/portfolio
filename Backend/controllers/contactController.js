const Contact = require('../models/Contact');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      const err = new Error('Please provide all required fields');
      err.status = 400;
      return next(err);
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Message received successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessageById = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }
    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }
    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!message) {
      const err = new Error('Message not found');
      err.status = 404;
      return next(err);
    }

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
