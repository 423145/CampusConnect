const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        minlength: [10, 'Content must be at least 10 characters long']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    college: {
        type: String,
        required: false,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    upvotes: {
        type: Number,
        default: 0,
        min: [0, 'Upvotes cannot be negative']
    },
    downvotes: {
        type: Number,
        default: 0,
        min: [0, 'Downvotes cannot be negative']
    },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    answers: [{
        content: {
            type: String,
            required: [true, 'Answer content is required'],
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Answer author is required']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        upvotes: {
            type: Number,
            default: 0,
            min: [0, 'Upvotes cannot be negative']
        },
        downvotes: {
            type: Number,
            default: 0,
            min: [0, 'Downvotes cannot be negative']
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
questionSchema.index({ views: -1, upvotes: -1, createdAt: -1 });
questionSchema.index({ author: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema); 