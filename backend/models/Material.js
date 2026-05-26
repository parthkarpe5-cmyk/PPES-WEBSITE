const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }, 
    type: { type: String, enum: ['PDF', 'IMAGE'], default: 'PDF' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
