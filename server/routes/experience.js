const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');

// Get all experiences
router.get('/', async (req, res) => {
    try {
        const db = readDb();
        let experiences = db.experiences || [];

        // If no experiences in DB, use sample data and populate DB
        if (experiences.length === 0) {
            experiences = getSampleExperiences();
            db.experiences = experiences;
            writeDb(db);
        }

        // Sort by startDate descending
        experiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        res.json({ success: true, experiences });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch experiences' });
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
        res.status(500).json({ success: false, error: 'Failed to fetch experience' });
    }
});

// Create experience (admin)
router.post('/', (req, res) => {
    try {
        const db = readDb();
        const newExperience = {
            _id: uuidv4(),
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: req.body.endDate ? new Date(req.body.endDate) : null,
            createdAt: new Date()
        };

        if (!db.experiences) db.experiences = [];
        db.experiences.push(newExperience);
        writeDb(db);

        res.json({ success: true, experience: newExperience });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create experience' });
    }
});

// Update experience (admin)
router.put('/:id', (req, res) => {
    try {
        const db = readDb();
        const index = db.experiences.findIndex(e => e._id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Experience not found' });
        }

        db.experiences[index] = { ...db.experiences[index], ...req.body };
        writeDb(db);

        res.json({ success: true, experience: db.experiences[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update experience' });
    }
});

// Delete experience (admin)
router.delete('/:id', (req, res) => {
    try {
        const db = readDb();
        const initialLength = db.experiences.length;
        db.experiences = db.experiences.filter(e => e._id !== req.params.id);

        if (db.experiences.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Experience not found' });
        }

        writeDb(db);
        res.json({ success: true, message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete experience' });
    }
});

// Sample experiences
function getSampleExperiences() {
    return [
        {
            _id: '1',
            company: 'Rishabh Software',
            position: 'Full Stack Intern → Software Engineer Trainee',
            location: 'Vadodara, Gujarat, India',
            type: 'full-time',
            startDate: new Date('2025-01-01'),
            current: true,
            description: '<strong>1 Year 1 Month</strong> | Started as Full Stack Intern (Jan 2025 - Jun 2025), promoted to Software Engineer Trainee (Jul 2025 - Present). Working on enterprise-grade applications using .NET Core, Angular, and SQL Server.',
            responsibilities: [
                '<strong>🚀 As Software Engineer Trainee (Jul 2025 - Present):</strong>',
                'Designed and implemented Modular Monolith Architecture based on Clean Architecture principles',
                'Enabled plug-and-play feature modules, reducing project setup time by 40%',
                'Migrated authentication from Intra ID to Microsoft Azure AD (MSAL) for unified SSO',
                'Optimized internal invoice API performance from 30-40s → 1-2s using Stored Procedures and Dapper',
                'Enhanced performance across 24+ microservices in Admin 360 project',
                'Developed core modules for Rtalent talent management platform (800-1,200 employees)',
                'Built auto-resume generation feature, reducing manual effort by 60-70%',
                'Developed Reflection, EMS, and worked on DOOHIT client project',
                '<strong>🎓 As Full Stack Intern (Jan 2025 - Jun 2025):</strong>',
                'Developed Guest House Management System with real-time room booking',
                'Implemented double-booking prevention and conflict validation',
                'Built responsive UI components using Angular and Bootstrap',
                'Created RESTful APIs using ASP.NET Core Web API',
                'Participated in Agile/Scrum development methodology'
            ],
            achievements: [
                'Promoted from Intern to Software Engineer Trainee',
                'Reduced project setup time by 40% with modular architecture',
                'Improved API performance by 95% (30-40s to 1-2s)',
                'Contributed to 9+ enterprise projects'
            ],
            technologies: ['Angular', 'ASP.NET', '.NET Core', 'C#', 'SQL Server', 'Azure AD', 'MSAL', 'Dapper', 'Entity Framework', 'Clean Architecture', 'Microservices', 'REST API']
        },
        {
            _id: '2',
            company: 'GTU IBM SkillBuild',
            position: 'AI Intern',
            location: 'Online (Remote)',
            type: 'internship',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-07-31'),
            current: false,
            description: 'Completed a one-month online AI internship program focused on conversational AI and chatbot development.',
            responsibilities: [
                'Developed "Banking Bot" implementing basic conversational AI logic',
                'Learned fundamentals of Artificial Intelligence and Machine Learning',
                'Implemented chatbot workflows using AI-based conversation patterns',
                'Gained hands-on experience with AI development tools and frameworks',
                'Completed IBM SkillBuild AI training modules and assessments'
            ],
            achievements: [
                'Successfully developed Banking Bot chatbot',
                'Completed IBM SkillBuild AI certification'
            ],
            technologies: ['AI', 'Chatbot Development', 'Conversational AI', 'IBM Watson', 'Python', 'NLP']
        },
        {
            _id: '3',
            company: 'Arth Consultancy',
            position: 'Web Developer Intern',
            location: 'On-site',
            type: 'internship',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-31'),
            current: false,
            description: 'Completed a one-month in-person internship focused on frontend web development, building responsive and user-friendly web interfaces.',
            responsibilities: [
                'Built responsive UI webpages using HTML5 & CSS3',
                'Developed mobile-first responsive layouts for various screen sizes',
                'Implemented modern CSS techniques including Flexbox and Grid',
                'Ensured cross-browser compatibility across major browsers',
                'Collaborated with senior developers on real client projects',
                'Followed web accessibility best practices and standards',
                'Participated in code reviews and received mentorship'
            ],
            achievements: [
                'Successfully completed frontend development internship',
                'Built responsive web pages for client projects'
            ],
            technologies: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'CSS Grid', 'Bootstrap', 'JavaScript']
        }
    ];
}

module.exports = router;
