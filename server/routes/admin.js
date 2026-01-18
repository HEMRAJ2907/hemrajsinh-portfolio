const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Simple admin authentication (for demo purposes)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hemraj2026';

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // In production, use JWT tokens
            res.json({
                success: true,
                message: 'Login successful',
                token: Buffer.from(`${username}:${Date.now()}`).toString('base64')
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// Verify admin session
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = Buffer.from(token, 'base64').toString();
            const [username] = decoded.split(':');

            if (username === ADMIN_USERNAME) {
                return res.json({ success: true, valid: true });
            }
        } catch (e) {
            // Invalid token
        }
    }

    res.json({ success: false, valid: false });
});

// Get portfolio settings
router.get('/settings', (req, res) => {
    res.json({
        success: true,
        settings: {
            name: 'Hemrajsinh',
            title: 'Full Stack Developer',
            email: 'contact@hemrajsinh.com',
            phone: '+91 XXXXXXXXXX',
            location: 'Gujarat, India',
            social: {
                github: 'https://github.com/hemrajsinh',
                linkedin: 'https://linkedin.com/in/hemrajsinh',
                twitter: 'https://twitter.com/hemrajsinh'
            }
        }
    });
});

module.exports = router;
