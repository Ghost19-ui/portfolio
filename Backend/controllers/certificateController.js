const Certificate = require('../models/Certificate');

exports.getAllCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json(certs); // Raw Array
  } catch (error) {
    next(error);
  }
};

exports.createCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.create({ ...req.body, user: req.user.id });
    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Certificate deleted' });
  } catch (error) {
    next(error);
  }
};