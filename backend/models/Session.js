const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    facultyId: { type: String, required: true }, // For now using string, later can be ObjectId
    meetingId: { type: String, required: true, unique: true },
    startTime: { type: Date, default: Date.now },
    status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
