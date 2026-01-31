const Message = require('../models/Message');

// Save a new message from the contact form
exports.saveMessage = async (req, res) => {
    try {
        const { name, email, content } = req.body;
        const newMessage = new Message({ name, email, content });
        await newMessage.save();
        res.status(201).json({ success: true, message: "Transmission stored in database." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch all messages for the Admin panel
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transmissions." });
    }
};
