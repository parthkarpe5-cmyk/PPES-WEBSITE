const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Material = require('../models/Material');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'subjects',
      populate: { path: 'materials' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'subjects',
      populate: { path: 'materials' }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a course
router.post('/', async (req, res) => {
  try {
    const { title, description, price, isPublished } = req.body;
    const course = await Course.create({ title, description, price, isPublished });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
