const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'alumni', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'student'
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

// Add index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ college: 1 });

module.exports = mongoose.model('User', userSchema); 