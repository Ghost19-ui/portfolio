const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/messages', protect, authorize('admin'), getMessages);
router.get('/:id', protect, authorize('admin'), getMessageById);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;
