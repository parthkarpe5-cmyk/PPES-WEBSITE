const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
        required: true
    },
    subject_id: {
        type: String,
        required: true,
        unique: true
    },
    // Existing fields for compatibility
    name: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    facultyIds: [{
        type: String // Mapping to User.userId
    }],
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    course_id: { type: String }, // Custom string link
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
