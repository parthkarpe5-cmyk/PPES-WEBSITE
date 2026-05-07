const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
