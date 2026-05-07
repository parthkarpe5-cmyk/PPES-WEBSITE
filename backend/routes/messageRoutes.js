const express = require('express');
const router = express.Router();
const { addMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/', addMessage);

module.exports = router;
