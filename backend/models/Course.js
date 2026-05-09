const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    // New requested fields
    course_name: { type: String, required: true },
    course_id: { type: String, required: true, unique: true },
    course_start_date: { type: Date },
    course_description: { type: String },

    // Existing fields for compatibility
    title: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
