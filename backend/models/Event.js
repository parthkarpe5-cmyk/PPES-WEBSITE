const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ["Workshop", "Special Class"] },
    title: { type: String, required: true },
    topic: { type: String },
    speaker: { type: String },
    mentor: { type: String },
    mode: { type: String, required: true, enum: ["Online", "Offline"] },
    platformOrLocation: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String },
    price: { type: String },
    limitSeats: { type: String },
    category: { type: String },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
