const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`);

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
