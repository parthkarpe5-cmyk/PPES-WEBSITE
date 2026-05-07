const express = require('express');
const router = express.Router();
const { createDoubt, getDoubtsList, getDoubtDetails, updateDoubtStatus } = require('../controllers/doubtController');

router.post('/', createDoubt);
router.get('/', getDoubtsList);
router.get('/:id', getDoubtDetails);
router.patch('/:id/status', updateDoubtStatus);

module.exports = router;
