const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    facultyIds: [{
        type: String // Mapping to User.userId
    }],
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
