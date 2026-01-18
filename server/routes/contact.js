const express = require('express');
const router = express.Router();
const { sendNotification } = require('../utils/notifier');
const { readDb, writeDb } = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please fill in all required fields'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email address'
            });
        }

        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            'Unknown';

        // Save to JSON DB
        const db = readDb();
        const newContact = {
            _id: uuidv4(),
            name,
            email,
            phone,
            subject,
            message,
            ipAddress: ip,
            status: 'new',
            createdAt: new Date().toISOString()
        };

        db.contacts.unshift(newContact); // Add to beginning of array
        writeDb(db);

        // Send notification (Email + WhatsApp)
        await sendNotification('new_contact', {
            name,
            email,
            phone,
            subject,
            message
        });

        console.log('\n📬 NEW CONTACT RECEIVED & SAVED:');
        console.log('------------------------');
        console.log(`👤 Name: ${name}`);
        console.log(`📝 Subject: ${subject}`);
        console.log('------------------------\n');

        res.json({
            success: true,
            message: 'Thank you! Your message has been sent successfully.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again.'
        });
    }
});

// Get all contacts (admin)
router.get('/', async (req, res) => {
    try {
        const db = readDb();
        res.json({ success: true, contacts: db.contacts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
    }
});

// Update contact status (admin)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const db = readDb();
        const contactIndex = db.contacts.findIndex(c => c._id === req.params.id);

        if (contactIndex > -1) {
            db.contacts[contactIndex].status = status;
            writeDb(db);
            res.json({ success: true, contact: db.contacts[contactIndex] });
        } else {
            res.status(404).json({ success: false, error: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update contact' });
    }
});

// Delete contact (admin)
router.delete('/:id', async (req, res) => {
    try {
        const db = readDb();
        const newContacts = db.contacts.filter(c => c._id !== req.params.id);

        if (db.contacts.length !== newContacts.length) {
            db.contacts = newContacts;
            writeDb(db);
            res.json({ success: true, message: 'Contact deleted' });
        } else {
            res.status(404).json({ success: false, error: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete contact' });
    }
});

module.exports = router;
