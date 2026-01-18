const express = require('express');
const router = express.Router();
const UAParser = require('ua-parser-js');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../utils/jsonDb');
const { sendNotification } = require('../utils/notifier');

// Track visitor
router.post('/track', async (req, res) => {
    try {
        const { sessionId, page, referrer, screenWidth } = req.body;
        const ua = new UAParser(req.headers['user-agent']);
        const browser = ua.getBrowser();
        const os = ua.getOS();
        const device = ua.getDevice();

        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            'Unknown';

        let deviceType = 'Desktop';
        if (device.type === 'mobile') deviceType = 'Mobile';
        else if (device.type === 'tablet') deviceType = 'Tablet';
        else if (screenWidth && screenWidth < 768) deviceType = 'Mobile';
        else if (screenWidth && screenWidth < 1024) deviceType = 'Tablet';

        const db = readDb();
        let visitor = db.visitors.find(v => v.sessionId === sessionId);
        let isNew = false;

        if (visitor) {
            visitor.lastVisit = new Date().toISOString();
            visitor.visitCount += 1;
            visitor.pagesVisited.push({ page, timestamp: new Date().toISOString() });
        } else {
            isNew = true;
            visitor = {
                _id: uuidv4(),
                sessionId: sessionId || uuidv4(),
                ip: ip,
                browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
                os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
                device: deviceType,
                referrer: referrer || 'Direct',
                pagesVisited: [{ page: page || 'Home', timestamp: new Date().toISOString() }],
                visitCount: 1,
                firstVisit: new Date().toISOString(),
                lastVisit: new Date().toISOString(),
                totalTimeSpent: 0
            };
            db.visitors.unshift(visitor);

            // Limit stored visitors to avoid file getting too large (last 1000)
            if (db.visitors.length > 1000) {
                db.visitors = db.visitors.slice(0, 1000);
            }
        }

        writeDb(db);

        if (isNew) {
            await sendNotification('new_visitor', {
                ip: ip,
                browser: visitor.browser,
                os: visitor.os,
                device: deviceType,
                referrer: referrer,
                page: page
            });
        }

        res.json({
            success: true,
            sessionId: visitor.sessionId,
            message: 'Visitor tracked successfully'
        });
    } catch (error) {
        console.error('Visitor tracking error:', error);
        res.status(500).json({ success: false, error: 'Failed to track visitor' });
    }
});

// Update page visit
router.post('/page', async (req, res) => {
    try {
        const { sessionId, page } = req.body;
        if (!sessionId) return res.status(400).json({ success: false });

        const db = readDb();
        const visitor = db.visitors.find(v => v.sessionId === sessionId);

        if (visitor) {
            visitor.pagesVisited.push({ page, timestamp: new Date().toISOString() });
            visitor.lastVisit = new Date().toISOString();
            writeDb(db);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Update time spent
router.post('/time', async (req, res) => {
    try {
        const { sessionId, timeSpent } = req.body;
        if (!sessionId) return res.status(400).json({ success: false });

        const db = readDb();
        const visitor = db.visitors.find(v => v.sessionId === sessionId);

        if (visitor) {
            visitor.totalTimeSpent = (visitor.totalTimeSpent || 0) + timeSpent;
            writeDb(db);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Get visitor count (public)
router.get('/count', async (req, res) => {
    try {
        const db = readDb();
        const totalVisitors = db.visitors.length;

        // Count today's visitors
        const today = new Date().setHours(0, 0, 0, 0);
        const todayVisitors = db.visitors.filter(v =>
            new Date(v.firstVisit).getTime() >= today
        ).length;

        res.json({
            success: true,
            total: totalVisitors,
            today: todayVisitors
        });
    } catch (error) {
        res.json({ success: true, total: 0, today: 0 });
    }
});

module.exports = router;
