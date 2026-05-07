const express = require('express');
const router = express.Router();
const { addMessage } = require('../controllers/messageController');

router.post('/', addMessage);

module.exports = router;
