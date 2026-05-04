const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    classId: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    exitTime: {
        type: Date
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
