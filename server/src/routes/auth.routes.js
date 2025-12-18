import express from 'express';
import { login, register, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validation/auth.validator.js';
import { loginValidation, registerValidation } from '../middleware/validation/auth.validator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);

export default router;
