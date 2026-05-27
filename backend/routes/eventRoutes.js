const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        let events = await Event.find().sort({ createdAt: -1 });
        if (events.length === 0) {
            // Seed premium dummy events immediately so the database has them
            const dummyEvents = [
                {
                    type: "Workshop",
                    title: "Crash Course on Algebra & Functions",
                    topic: "Mathematics",
                    speaker: "Prof. Rahul Sharma",
                    mode: "Online",
                    platformOrLocation: "Zoom Classroom",
                    date: "2026-10-15",
                    time: "18:00",
                    duration: "2 Hours",
                    price: "Free",
                    category: "Academic Support",
                    description: "An intensive algebra mastery session focusing on high-weightage linear equations, functions, and quadratic formulas."
                },
                {
                    type: "Special Class",
                    title: "Mission 90+ Board Strategy Roadshow",
                    category: "Strategy",
                    mentor: "Dr. Anita Desai",
                    mode: "Offline",
                    platformOrLocation: "Prarambha High School Campus",
                    date: "2026-11-05",
                    time: "10:00",
                    duration: "3 Hours",
                    limitSeats: "50",
                    description: "Get a comprehensive study blueprint, secret answer-writing guidelines, and personalized tips directly from a senior board examiner."
                },
                {
                    type: "Workshop",
                    title: "Public Speaking & Career Guidance",
                    topic: "Soft Skills",
                    speaker: "Siddharth Sen (TEDx)",
                    mode: "Online",
                    platformOrLocation: "Google Meet",
                    date: "2026-12-01",
                    time: "17:00",
                    duration: "1.5 Hours",
                    price: "Free",
                    category: "Career Guidance",
                    description: "Overcome stage fright and learn persuasive speaking strategies tailored specifically for college applications and interview prep."
                }
            ];
            events = await Event.insertMany(dummyEvents);
            // Sort seeded events to be newest first (by default insertMany preserves array order, but sorting ensures consistency)
            events.reverse();
        }
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create an event
router.post('/', async (req, res) => {
    try {
        const {
            type, title, topic, speaker, mentor, mode,
            platformOrLocation, date, time, duration,
            price, limitSeats, category, description
        } = req.body;
        
        const event = await Event.create({
            type, title, topic, speaker, mentor, mode,
            platformOrLocation, date, time, duration,
            price, limitSeats, category, description
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an event
router.put('/:id', async (req, res) => {
    try {
        const {
            type, title, topic, speaker, mentor, mode,
            platformOrLocation, date, time, duration,
            price, limitSeats, category, description
        } = req.body;
        
        const updateData = {
            type, title, topic, speaker, mentor, mode,
            platformOrLocation, date, time, duration,
            price, limitSeats, category, description
        };
        
        const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
