require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');

// Import routes
const visitorRoutes = require('./routes/visitors');
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');
const experienceRoutes = require('./routes/experience');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - Use process.cwd() for Vercel compatibility
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// API Routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// MongoDB Connection
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return; // Already connected

        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hemrajsinh_portfolio';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('⚠️ Running without database - some features may not work');
    }
};

// Start server (Local Development)
if (require.main === module) {
    const startServer = async () => {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Hemrajsinh Portfolio Server Started!                  ║
║                                                            ║
║   📍 Local:    http://localhost:${PORT}                      ║
║   📍 API:      http://localhost:${PORT}/api                  ║
║   📍 Admin:    http://localhost:${PORT}/admin.html           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
            `);
        });
    };

    startServer();
}

// For Vercel
module.exports = app;
