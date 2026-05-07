const express = require('express');
const router = express.Router();
const { getSubjectsList, getTeachersForSubject, getAllTeachers } = require('../controllers/subjectController');

router.get('/subjects', getSubjectsList);
router.get('/subjects/:subjectId/teachers', getTeachersForSubject);
router.get('/teachers', getAllTeachers);

module.exports = router;
