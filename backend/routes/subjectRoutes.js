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
        const { subject_name, subject_id, teacherId, courseId } = req.body;
        
        let facultyIds = [];
        if (teacherId) {
            const User = require('../models/User');
            const teacher = await User.findById(teacherId);
            if (teacher && teacher.userId) {
                facultyIds.push(teacher.userId);
            }
        }
        
        const subject = await Subject.create({
            subject_name,
            subject_id,
            name: subject_name, // compatibility
            code: subject_id, // compatibility
            teacherId: teacherId || null,
            facultyIds,
            courseId
        });

        // Add reference to Course
        await Course.findByIdAndUpdate(courseId, { $push: { subjects: subject._id } });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a subject (including teacher mapping)
router.put('/:id', async (req, res) => {
    try {
        const { subject_name, subject_id, teacherId } = req.body;
        
        let facultyIds = [];
        if (teacherId) {
            const User = require('../models/User');
            const teacher = await User.findById(teacherId);
            if (teacher && teacher.userId) {
                facultyIds.push(teacher.userId);
            }
        }
        
        const updateData = {
            subject_name,
            subject_id,
            name: subject_name,
            code: subject_id,
            teacherId: teacherId || null,
            facultyIds
        };

        const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        
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

        // Pull reference from Course
        await Course.findByIdAndUpdate(subject.courseId, { $pull: { subjects: subject._id } });

        res.json({ message: 'Subject deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
