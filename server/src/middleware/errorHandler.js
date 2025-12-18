import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'express-validator';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error structure
  let error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong!',
    errors: err.errors || [],
  };

  // Handle validation errors
  if (err.name === 'ValidationError') {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = 'Validation Error';
    error.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = 'Duplicate field value entered';
    error.errors = [
      {
        field: Object.keys(err.keyValue)[0],
        message: `This ${Object.keys(err.keyValue)[0]} is already in use`,
      },
    ];
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = 'Token expired';
  }

  // Handle express-validator errors
  if (Array.isArray(err) && err[0]?.param) {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = 'Validation failed';
    error.errors = err.map(e => ({
      field: e.param,
      message: e.msg,
    }));
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors.length ? error.errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};
