const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/jsonDb');

// Get all experiences
router.get('/', (req, res) => {
    try {
        const db = readDb();
        const experiences = db.experiences || [];

        // Sort by start date (newest first)
        experiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        res.json({ success: true, count: experiences.length, experiences });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Get single experience
router.get('/:id', (req, res) => {
    try {
        const db = readDb();
        const experience = db.experiences.find(e => e._id === req.params.id);

        if (!experience) {
            return res.status(404).json({ success: false, error: 'Experience not found' });
        }

        res.json({ success: true, experience });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Create experience
router.post('/', (req, res) => {
    try {
        const db = readDb();
        const newExperience = {
            _id: uuidv4(),
            ...req.body,
            createdAt: new Date()
        };

        db.experiences.push(newExperience);
        writeDb(db);

        res.status(201).json({ success: true, data: newExperience });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update experience
router.put('/:id', (req, res) => {
    try {
        const db = readDb();
        const index = db.experiences.findIndex(e => e._id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Experience not found' });
        }

        db.experiences[index] = { ...db.experiences[index], ...req.body };
        writeDb(db);

        res.json({ success: true, data: db.experiences[index] });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete experience
router.delete('/:id', (req, res) => {
    try {
        const db = readDb();
        const initialLength = db.experiences.length;
        db.experiences = db.experiences.filter(e => e._id !== req.params.id);

        if (db.experiences.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Experience not found' });
        }

        writeDb(db);
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
