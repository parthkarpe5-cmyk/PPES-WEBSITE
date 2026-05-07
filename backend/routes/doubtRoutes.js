const express = require('express');
const router = express.Router();
const {
  createDoubt,
  getDoubtsList,
  getDoubtDetails,
  updateDoubtStatus
} = require('../controllers/doubtController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/', createDoubt);
router.get('/', getDoubtsList);
router.get('/:id', getDoubtDetails);
router.patch('/:id/status', updateDoubtStatus);

module.exports = router;
