const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Course = require('../models/Course');

// Create a subject
router.post('/', async (req, res) => {
  try {
    const { name, courseId, teacherId } = req.body;
    const subject = await Subject.create({ name, courseId, teacherId });
    
    // Add to course
    await Course.findByIdAndUpdate(courseId, { $push: { subjects: subject._id } });
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    
    // Remove from course
    await Course.findByIdAndUpdate(subject.courseId, { $pull: { subjects: subject._id } });
    
    // In a real app, you would also delete all materials linked to this subject.
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
