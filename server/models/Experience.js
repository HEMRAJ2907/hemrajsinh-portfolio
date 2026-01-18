const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
        default: 'full-time'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    responsibilities: [{
        type: String
    }],
    achievements: [{
        type: String
    }],
    technologies: [{
        type: String
    }],
    companyLogo: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
