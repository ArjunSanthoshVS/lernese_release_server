const mongoose = require('mongoose');

const studyGroupMessageSchema = new mongoose.Schema({
    studyGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'audio'],
        default: 'text'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudyGroupMessage', studyGroupMessageSchema); 