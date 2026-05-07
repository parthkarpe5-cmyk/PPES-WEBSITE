const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }, // URL to the file or just a string for prototype
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['PDF', 'IMAGE'], default: 'PDF' }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
