const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'desktop', 'api', 'ai', 'other']
    },
    technologies: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: '/assets/images/project-placeholder.jpg'
    },
    images: [{
        type: String
    }],
    liveUrl: {
        type: String
    },
    githubUrl: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'planned'],
        default: 'completed'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
