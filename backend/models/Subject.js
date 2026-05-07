const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    facultyIds: [{
        type: String // Mapping to User.userId
    }]
});

module.exports = mongoose.model('Subject', subjectSchema);
