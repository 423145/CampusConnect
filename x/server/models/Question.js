const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 10,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 30,
        trim: true
    },
    tags: [{
        type: String,
        required: true,
        trim: true
    }],
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userRole: {
        type: String,
        required: true,
        enum: ['student', 'alumni', 'faculty', 'admin']
    },
    views: {
        type: Number,
        default: 0
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    isResolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add text index for search functionality
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionSchema); 