const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    doubt_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doubt',
      required: true
    },
    sender_id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    image_url: {
      type: String,
      default: null
    },
    is_read: {
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

module.exports = mongoose.model('Message', messageSchema);
