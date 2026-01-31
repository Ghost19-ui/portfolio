const Log = require('../models/Log');

// Create a new system log entry
exports.createLog = async (req, res) => {
    try {
        const { event, details, level } = req.body;
        const newLog = new Log({
            event,
            details,
            level,
            ip: req.ip // Automatically capture requester IP
        });
        await newLog.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch recent logs for the Live Terminal
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to stream logs." });
    }
};