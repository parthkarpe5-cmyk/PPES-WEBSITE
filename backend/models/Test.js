const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['MCQ', 'MULTIPLE_SELECT', 'DESCRIPTIVE', 'CODING'],
    required: true 
  },
  text: { type: String, required: true },
  points: { type: Number, required: true, default: 5 },
  options: [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed } // Can be String or Array
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number, required: true },
  passingScore: { type: Number, default: 60 },
  postTestMessage: { type: String },
  isManualRelease: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
