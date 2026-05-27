const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
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
