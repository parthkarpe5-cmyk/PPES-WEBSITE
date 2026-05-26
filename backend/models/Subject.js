const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subject_name: { type: String, required: true },
    subject_id: { type: String, required: true, unique: true },
    
    // Compatibility fields
    name: { type: String },
    code: { type: String },
    description: { type: String },
    
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    facultyIds: [{ type: String }],
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
