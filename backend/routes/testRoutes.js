const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// For now, we omit auth middleware to make integration easier,
// but in a production app, routes would be protected.

router.post('/', testController.createTest);
router.get('/', testController.getTests);
router.get('/attempts/me', testController.getMyAttempts);
router.get('/:id', testController.getTestById);
router.put('/:id', testController.updateTest);
router.post('/:id/attempt', testController.submitAttempt);

module.exports = router;
