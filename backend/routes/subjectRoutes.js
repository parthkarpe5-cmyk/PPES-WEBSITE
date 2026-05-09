const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Course = require('../models/Course');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacherId courseId');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a subject
router.post('/', async (req, res) => {
  try {
    const { subject_name, subject_id, teacher_id, course_id, courseId } = req.body;
    
    // Create the subject
    const subject = await Subject.create({ 
      subject_name, 
      subject_id, 
      name: subject_name, // fallback
      teacherId: teacher_id, 
      course_id, // Custom string
      courseId // MongoDB ID
    });
    
    // Add to course's subjects array if courseId is provided
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $push: { subjects: subject._id } });
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  try {
    const { subject_name, subject_id, teacher_id, course_id, courseId } = req.body;
    
    const updateData = {
      subject_name,
      subject_id,
      name: subject_name,
      teacherId: teacher_id,
      course_id,
      courseId
    };

    const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
