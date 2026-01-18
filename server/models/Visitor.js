const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
        default: 'Unknown'
    },
    country: {
        type: String,
        default: 'Unknown'
    },
    city: {
        type: String,
        default: 'Unknown'
    },
    browser: {
        type: String,
        default: 'Unknown'
    },
    os: {
        type: String,
        default: 'Unknown'
    },
    device: {
        type: String,
        default: 'Desktop'
    },
    referrer: {
        type: String,
        default: 'Direct'
    },
    pagesVisited: [{
        page: String,
        timestamp: { type: Date, default: Date.now }
    }],
    totalTimeSpent: {
        type: Number,
        default: 0
    },
    firstVisit: {
        type: Date,
        default: Date.now
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    visitCount: {
        type: Number,
        default: 1
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
