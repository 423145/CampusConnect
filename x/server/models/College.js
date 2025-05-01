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
    website: {
        type: String
    },
    logo: {
        type: String
    },
    programs: [{
        type: String
    }],
    admissionInfo: {
        type: String
    },
    contactInfo: {
        email: String,
        phone: String,
        address: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('College', collegeSchema); 