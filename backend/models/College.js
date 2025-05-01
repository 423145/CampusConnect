const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '../assets/default-college.jpg'
    },
    students: {
        type: Number,
        default: 0
    },
    questions: {
        type: Number,
        default: 0
    },
    courses: [{
        type: String
    }],
    facilities: [{
        type: String
    }],
    ranking: {
        type: Number
    },
    type: {
        type: String,
        enum: ['iit', 'nit', 'government', 'private', 'deemed'],
        required: true
    },
    region: {
        type: String,
        enum: ['north', 'south', 'east', 'west', 'central'],
        required: true
    },
    contact: {
        website: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
});

// Add text index for search functionality
collegeSchema.index({
    name: 'text',
    location: 'text',
    description: 'text'
});

module.exports = mongoose.model('College', collegeSchema); 