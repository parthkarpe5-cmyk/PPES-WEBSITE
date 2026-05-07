const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
        default: function() { return this.usn || this.email; } // Fallback to USN or Email
    },
    usn: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'faculty', 'student'],
        default: 'student'
    },
    password: {
        type: String,
        default: 'password123' // Default for seeded users
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isEmailSent: {
        type: Boolean,
        default: false
    },
    grade: {
        type: String,
        default: '' // e.g., 'Class 9', 'Class 10'
    }
});

module.exports = mongoose.model('User', userSchema);
