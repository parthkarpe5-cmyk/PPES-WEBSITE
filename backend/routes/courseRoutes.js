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
    const { 
      course_name, 
      course_id, 
      course_start_date, 
      course_description, 
      price, 
      isPublished 
    } = req.body;

    // Mapping new fields to old ones for compatibility
    const course = await Course.create({ 
      course_name, 
      course_id, 
      course_start_date, 
      course_description, 
      title: course_name, // fallback
      description: course_description, // fallback
      price, 
      isPublished 
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const { 
      course_name, 
      course_id, 
      course_start_date, 
      course_description, 
      price, 
      isPublished 
    } = req.body;

    const updateData = {
      course_name, 
      course_id, 
      course_start_date, 
      course_description, 
      price, 
      isPublished 
    };

    if (course_name) updateData.title = course_name;
    if (course_description) updateData.description = course_description;

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
