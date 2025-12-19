const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ');

    if (!token) {
      const err = new Error('Not authorized, no token');
      err.status = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      const err = new Error('User not found');
      err.status = 401;
      return next(err);
    }

    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const err = new Error('Not authorized for this action');
    err.status = 403;
    return next(err);
  }
  next();
};
