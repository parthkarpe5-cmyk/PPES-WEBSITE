const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subject_id: {
      type: String,
      required: true
    },
    student_id: {
      type: String,
      required: true
    },
    assigned_teacher_id: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['open', 'resolved', 'closed'],
      default: 'open'
    },
    is_teacher_validated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = mongoose.model('Doubt', doubtSchema);
