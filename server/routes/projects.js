const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/jsonDb');

// Get all projects
router.get('/', (req, res) => {
    try {
        const db = readDb();
        let projects = db.projects || [];
        const { category, featured } = req.query;

        // Filter by category
        if (category) {
            projects = projects.filter(project => project.category === category);
        }

        // Filter by featured
        if (featured) {
            projects = projects.filter(project => project.featured === 'true' || project.featured === true);
        }

        res.json({ success: true, count: projects.length, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Get single project
router.get('/:id', (req, res) => {
    try {
        const db = readDb();
        const project = db.projects.find(p => p._id === req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Increment view count (In-Memory only on Vercel)
        project.views = (project.views || 0) + 1;
        writeDb(db);

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Create project
router.post('/', (req, res) => {
    try {
        const db = readDb();
        const newProject = {
            _id: uuidv4(),
            ...req.body,
            createdAt: new Date(),
            views: 0
        };

        db.projects.push(newProject);
        writeDb(db);

        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update project
router.put('/:id', (req, res) => {
    try {
        const db = readDb();
        const index = db.projects.findIndex(p => p._id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        db.projects[index] = { ...db.projects[index], ...req.body };
        writeDb(db);

        res.json({ success: true, data: db.projects[index] });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete project
router.delete('/:id', (req, res) => {
    try {
        const db = readDb();
        const initialLength = db.projects.length;
        db.projects = db.projects.filter(p => p._id !== req.params.id);

        if (db.projects.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        writeDb(db);
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
