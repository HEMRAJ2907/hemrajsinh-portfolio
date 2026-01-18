const express = require('express');
const router = express.Router();
const { readDb } = require('../utils/jsonDb');

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
    try {
        const db = readDb();
        const visitors = db.visitors || [];
        const contacts = db.contacts || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekTime = weekAgo.getTime();

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const monthTime = monthAgo.getTime();

        // Visitor stats
        const totalVisitors = visitors.length;
        const todayVisitors = visitors.filter(v => new Date(v.firstVisit).getTime() >= todayTime).length;
        const weekVisitors = visitors.filter(v => new Date(v.firstVisit).getTime() >= weekTime).length;
        const monthVisitors = visitors.filter(v => new Date(v.firstVisit).getTime() >= monthTime).length;

        // Contact stats
        const totalContacts = contacts.length;
        const newContacts = contacts.filter(c => c.status === 'new').length;

        // Device breakdown
        const deviceCount = {};
        visitors.forEach(v => {
            const device = v.device || 'Desktop';
            deviceCount[device] = (deviceCount[device] || 0) + 1;
        });
        const deviceStats = Object.keys(deviceCount).map(key => ({ _id: key, count: deviceCount[key] }));

        // Browser breakdown
        const browserCount = {};
        visitors.forEach(v => {
            const browser = (v.browser || 'Unknown').split(' ')[0]; // Simplified browser name
            browserCount[browser] = (browserCount[browser] || 0) + 1;
        });
        const browserStats = Object.keys(browserCount)
            .map(key => ({ _id: key, count: browserCount[key] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Daily visitors (last 7 days)
        const dailyCount = {};
        visitors.forEach(v => {
            const date = v.firstVisit ? v.firstVisit.split('T')[0] : '';
            if (date && new Date(date).getTime() >= weekTime) {
                dailyCount[date] = (dailyCount[date] || 0) + 1;
            }
        });
        const dailyVisitors = Object.keys(dailyCount)
            .sort()
            .map(date => ({ _id: date, count: dailyCount[date] }));

        // Recent visitors
        const recentVisitors = visitors.slice(0, 10).map(v => ({
            ip: v.ip,
            browser: v.browser,
            device: v.device,
            os: v.os,
            createdAt: v.firstVisit,
            page: v.pagesVisited?.[0]?.page || 'Home'
        }));

        res.json({
            success: true,
            stats: {
                visitors: {
                    total: totalVisitors,
                    today: todayVisitors,
                    week: weekVisitors,
                    month: monthVisitors
                },
                contacts: {
                    total: totalContacts,
                    new: newContacts
                },
                devices: deviceStats,
                browsers: browserStats,
                dailyVisitors,
                recentVisitors
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
});

// Get all visitors
router.get('/visitors', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const db = readDb();
        const visitors = db.visitors || [];

        const total = visitors.length;
        const start = (page - 1) * limit;
        const paginatedVisitors = visitors.slice(start, start + parseInt(limit));

        res.json({
            success: true,
            visitors: paginatedVisitors,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch visitors' });
    }
});

function getSampleAnalytics() {
    return {
        visitors: {
            total: 1247,
            today: 23,
            week: 156,
            month: 589
        },
        contacts: {
            total: 45,
            new: 3
        },
        devices: [
            { _id: 'Desktop', count: 756 },
            { _id: 'Mobile', count: 412 },
            { _id: 'Tablet', count: 79 }
        ],
        browsers: [
            { _id: 'Chrome', count: 623 },
            { _id: 'Safari', count: 287 },
            { _id: 'Firefox', count: 198 },
            { _id: 'Edge', count: 89 },
            { _id: 'Other', count: 50 }
        ],
        dailyVisitors: [
            { _id: '2026-01-11', count: 18 },
            { _id: '2026-01-12', count: 24 },
            { _id: '2026-01-13', count: 31 },
            { _id: '2026-01-14', count: 22 },
            { _id: '2026-01-15', count: 28 },
            { _id: '2026-01-16', count: 19 },
            { _id: '2026-01-17', count: 14 }
        ],
        recentVisitors: [
            { ip: '192.168.1.101', browser: 'Chrome 120.0', device: 'Desktop', os: 'Windows 10', referrer: 'Google', page: 'Home', createdAt: new Date() },
            { ip: '172.16.0.23', browser: 'Safari 17.2', device: 'Mobile', os: 'iOS 17', referrer: 'Direct', page: 'Projects', createdAt: new Date(Date.now() - 3600000) },
            { ip: '203.0.113.45', browser: 'Firefox 121.0', device: 'Desktop', os: 'MacOS', referrer: 'LinkedIn', page: 'Experience', createdAt: new Date(Date.now() - 7200000) },
            { ip: '198.51.100.12', browser: 'Edge 119.0', device: 'Tablet', os: 'Android', referrer: 'Twitter', page: 'Contact', createdAt: new Date(Date.now() - 10800000) },
            { ip: '192.168.1.105', browser: 'Chrome 120.0', device: 'Desktop', os: 'Linux', referrer: 'GitHub', page: 'Home', createdAt: new Date(Date.now() - 14400000) }
        ]
    };
}

module.exports = router;
