const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    manualMark: { type: Number, default: null } // set by faculty for DESCRIPTIVE/CODING
  }],
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['completed', 'pending_review'], 
    default: 'completed' 
  },
  gradedBy: { type: String, default: null },   // faculty userId
  gradedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
