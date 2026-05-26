const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Get all courses (populated with subjects and materials)
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
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a course
router.post('/', async (req, res) => {
    try {
        const { course_name, course_id, course_start_date, course_description, price, isPublished } = req.body;
        const course = await Course.create({
            course_name,
            course_id,
            course_start_date,
            course_description,
            title: course_name, // compatibility
            description: course_description, // compatibility
            price,
            isPublished
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    try {
        const { course_name, course_id, course_start_date, course_description, price, isPublished } = req.body;
        const updateData = {
            course_name,
            course_id,
            course_start_date,
            course_description,
            title: course_name,
            description: course_description,
            price,
            isPublished
        };
        const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!course) return res.status(404).json({ error: 'Course not found' });
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
        
        // Delete all linked subjects inside MongoDB for a clean sweep
        await Subject.deleteMany({ courseId: req.params.id });
        
        res.json({ message: 'Course and its subjects deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Purchase / Unlock course for a student (simulated purchase hook)
router.post('/purchase', async (req, res) => {
    try {
        const { courseId, userId } = req.body;
        
        // Use active headers if present, fallback to body
        const studentId = req.headers['x-user-id'] || userId;
        
        if (!studentId || !courseId) {
            return res.status(400).json({ error: 'Student ID and Course ID are required' });
        }

        const user = await User.findOneAndUpdate(
            { userId: studentId },
            { $addToSet: { unlockedCourses: courseId } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'Student not found' });
        res.json({ success: true, unlockedCourses: user.unlockedCourses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
