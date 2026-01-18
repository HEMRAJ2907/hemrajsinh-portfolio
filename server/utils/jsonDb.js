const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// --- HARDCODED INITIAL DATA (IN-MEMORY FALLBACK) ---
// This ensures the site works perfectly on Vercel/Netlify without an external DB.
const INITIAL_DATA = {
    visitors: [],
    contacts: [],
    projects: [
        {
            "_id": "1",
            "title": "Clean Architecture Framework",
            "shortDescription": "Modular Monolith Architecture with plug-and-play modules, reducing project setup time by 40%",
            "description": "\n                <p><strong>R&D Internal Project</strong> - An enterprise-grade framework built to standardize and accelerate development across teams.</p>\n                \n                <h5>🎯 Key Achievements</h5>\n                <ul>\n                    <li>Designed and implemented <strong>Modular Monolith Architecture</strong> based on Clean Architecture principles</li>\n                    <li>Enabled <strong>plug-and-play feature modules</strong>, reducing project setup time by <strong>40%</strong></li>\n                    <li>Contributed to <strong>14 out of 47</strong> planned feature modules within R&D timelines</li>\n                </ul>\n                \n                <h5>🛠️ Technical Implementation</h5>\n                <ul>\n                    <li>Built a <strong>generic CRUD framework</strong> for any entity or data model, minimizing repetitive code</li>\n                    <li>Implemented <strong>JWT-based authentication</strong> and role-based authorization</li>\n                    <li>Integrated <strong>.NET Core Identity</strong> and <strong>MSAL</strong> for secure, scalable access control</li>\n                    <li>Designed RESTful APIs following industry best practices</li>\n                </ul>\n                \n                <h5>📈 Impact</h5>\n                <ul>\n                    <li>Accelerated development speed across multiple teams</li>\n                    <li>Reduced boilerplate code by implementing reusable patterns</li>\n                    <li>Improved security with enterprise-grade authentication</li>\n                </ul>\n            ",
            "category": "backend",
            "technologies": [".NET Core", "Clean Architecture", "JWT", "MSAL", "Entity Framework", "SQL Server", "REST API", "C#"],
            "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Clean Architecture", "Modular Monolith", "CRUD Framework", "JWT Authentication", "Role-Based Authorization", ".NET Core Identity", "Enterprise Architecture", "R&D Project"]
        },
        {
            "_id": "2",
            "title": "Admin 360",
            "shortDescription": "Enterprise admin platform with Azure AD SSO + API optimization achieving 95% performance improvement",
            "description": "\n                <p><strong>Internal Project</strong> - A comprehensive enterprise administration platform managing 24+ microservices with centralized identity management and optimized performance.</p>\n                \n                <h5>🔐 Authentication & Security</h5>\n                <ul>\n                    <li>Migrated authentication from <strong>Intra ID to Microsoft Azure AD (MSAL)</strong></li>\n                    <li>Implemented <strong>unified SSO</strong> and centralized identity management</li>\n                    <li>Enhanced security across all microservices with enterprise-grade authentication</li>\n                </ul>\n                \n                <h5>⚡ Performance Optimization</h5>\n                <ul>\n                    <li>Optimized internal invoice API performance from <strong>30-40s → 1-2s</strong> (95%+ improvement)</li>\n                    <li>Refactored data access from <strong>EF Core to Stored Procedures and Dapper</strong></li>\n                    <li>Participated in <strong>database tuning</strong> and code optimization sessions</li>\n                    <li>Identified query bottlenecks and improved overall throughput</li>\n                </ul>\n                \n                <h5>🔧 System Enhancements</h5>\n                <ul>\n                    <li>Implemented <strong>automated scheduler jobs</strong> in Facility Management System (FMS)</li>\n                    <li>Built daily automated deallocation for inactive employees</li>\n                    <li>Enhanced performance across <strong>24+ microservices</strong></li>\n                    <li>Improved scalability and response times across the platform</li>\n                </ul>\n            ",
            "category": "fullstack",
            "technologies": ["Azure AD", "MSAL", ".NET Core", "Dapper", "SQL Server", "Stored Procedures", "Microservices", "Scheduler Jobs"],
            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Azure AD", "SSO", "API Optimization", "Microservices", "Dapper", "Performance Tuning", "Enterprise Admin", "FMS"]
        },
        {
            "_id": "3",
            "title": "Rtalent",
            "shortDescription": "Internal talent management platform serving 800-1,200 employees with auto-resume generation",
            "description": "\n                <p><strong>Internal Project</strong> - A comprehensive talent management platform enabling employees to manage skills, certifications, education, and project history efficiently.</p>\n                \n                <h5>📄 Auto-Resume Generation</h5>\n                <ul>\n                    <li>Implemented <strong>auto-resume generation</strong> feature from employee profiles</li>\n                    <li>Reduced manual resume creation effort by <strong>60-70%</strong></li>\n                    <li>Improved <strong>data accuracy</strong> across employee profiles</li>\n                </ul>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Entity Framework", "REST API", "PDF Generation", "Bootstrap"],
            "image": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Talent Management", "HR Tech", "Auto-Resume", "Employee Portal", "Skills Management", "Certification Tracking"]
        },
        {
            "_id": "4",
            "title": "Reflection",
            "shortDescription": "Performance feedback and review system with structured employee-manager evaluations",
            "description": "\n                <p><strong>Internal Project</strong> - A comprehensive performance feedback and review system enabling structured employee-to-manager evaluations across multiple departments and teams.</p>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Entity Framework", "REST API", "Bootstrap", "C#"],
            "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Performance Management", "Feedback System", "Employee Evaluation", "HR Tech", "Review System"]
        },
        {
            "_id": "5",
            "title": "EMS - Employee Management System",
            "shortDescription": "Comprehensive employee lifecycle management from onboarding to resignation with cross-app integration",
            "description": "\n                <p><strong>Internal Project</strong> - A modern, full-featured Employee Management System handling the complete employee lifecycle from onboarding to exit, with seamless integration to other internal applications.</p>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Entity Framework", "REST API", "Bootstrap", "SignalR", "Background Jobs"],
            "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Employee Management", "HRMS", "Onboarding", "Exit Management", "Master Data", "HR Automation"]
        },
        {
            "_id": "6",
            "title": "DOOHIT - Digital Out-of-Home Platform",
            "shortDescription": "Advertisement platform connecting media buyers and owners for virtual billboard visualization",
            "description": "\n                <p><strong>Client Project</strong> - An innovative Digital Out-of-Home (DOOH) advertising platform that bridges the gap between media buyers and media owners, enabling virtual visualization of advertisements on billboards and hoardings.</p>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Azure", "REST API", "Image Processing", "Google Maps API", "Payment Gateway"],
            "image": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["DOOH", "Digital Advertising", "Billboard", "Media Buying", "Out-of-Home", "Ad Tech"]
        },
        {
            "_id": "7",
            "title": "Guest House Management System",
            "shortDescription": "Real-time room booking system for employees with conflict validation and optimized availability checking",
            "description": "\n                <p><strong>Internal Project</strong> - A comprehensive Guest House Management System enabling employees to book accommodations with real-time availability checking and intelligent conflict prevention.</p>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Entity Framework", "SignalR", "REST API", "Bootstrap", "Caching"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["Guest House", "Room Booking", "Real-Time", "Conflict Validation", "Employee Portal"]
        },
        {
            "_id": "8",
            "title": "Inventory Management System",
            "shortDescription": "Full-featured IMS with CRUD operations, real-time activity logs, and low stock alerts",
            "description": "\n                <p><strong>Personal Project</strong> - A comprehensive Inventory Management System built from scratch with full CRUD functionality, real-time activity logging, and intelligent stock monitoring with alerts.</p>\n            ",
            "category": "fullstack",
            "technologies": [".NET Core", "Angular", "SQL Server", "Entity Framework", "REST API", "Bootstrap", "TypeScript", "C#"],
            "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
            "liveUrl": "#",
            "githubUrl": "https://github.com/HEMRAJ2907/IMS_BE",
            "githubUrlFrontend": "https://github.com/HEMRAJ2907/IMS_FE",
            "featured": true,
            "status": "completed",
            "keywords": ["Inventory Management", "CRUD", "Activity Logs", "Stock Alerts", "Personal Project", "Full Stack"]
        },
        {
            "_id": "9",
            "title": "Gopal Herbals - Natural Wellness Website",
            "shortDescription": "Modern React.js website for herbal products with AI-assisted development, deployed on Netlify",
            "description": "\n                <p><strong>Personal Project (AI-Assisted)</strong> - A beautiful, modern website for Gopal Herbals showcasing natural herbal products and wellness solutions, built using React.js with AI assistance.</p>\n            ",
            "category": "frontend",
            "technologies": ["React.js", "Vite", "JavaScript", "CSS3", "HTML5", "Netlify", "AI Development"],
            "image": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
            "liveUrl": "https://ephemeral-sable-888455.netlify.app/",
            "githubUrl": "https://github.com/HEMRAJ2907",
            "featured": true,
            "status": "completed",
            "keywords": ["React.js", "Herbal Products", "E-commerce", "Netlify", "AI Development", "Frontend"]
        }
    ],
    experiences: [
        {
            "_id": "1",
            "company": "Rishabh Software",
            "position": "Full Stack Intern → Software Engineer Trainee",
            "location": "Vadodara, Gujarat, India",
            "type": "full-time",
            "startDate": "2025-01-01T00:00:00.000Z",
            "current": true,
            "description": "<strong>1 Year 1 Month</strong> | Started as Full Stack Intern (Jan 2025 - Jun 2025), promoted to Software Engineer Trainee (Jul 2025 - Present). Working on enterprise-grade applications using .NET Core, Angular, and SQL Server.",
            "responsibilities": [
                "<strong>🚀 As Software Engineer Trainee (Jul 2025 - Present):</strong>",
                "Designed and implemented Modular Monolith Architecture based on Clean Architecture principles",
                "Enabled plug-and-play feature modules, reducing project setup time by 40%",
                "Migrated authentication from Intra ID to Microsoft Azure AD (MSAL) for unified SSO",
                "Optimized internal invoice API performance from 30-40s → 1-2s using Stored Procedures and Dapper",
                "Enhanced performance across 24+ microservices in Admin 360 project",
                "Developed core modules for Rtalent talent management platform (800-1,200 employees)",
                "Built auto-resume generation feature, reducing manual effort by 60-70%"
            ],
            "achievements": ["Promoted from Intern to Software Engineer Trainee", "Reduced project setup time by 40%", "Improved API performance by 95%"],
            "technologies": ["Angular", "ASP.NET", ".NET Core", "C#", "SQL Server", "Azure AD", "MSAL", "Dapper", "Entity Framework", "Clean Architecture"]
        },
        {
            "_id": "2",
            "company": "GTU IBM SkillBuild",
            "position": "AI Intern",
            "location": "Online (Remote)",
            "type": "internship",
            "startDate": "2025-07-01T00:00:00.000Z",
            "endDate": "2025-07-31T00:00:00.000Z",
            "current": false,
            "description": "Completed a one-month online AI internship program focused on conversational AI and chatbot development.",
            "responsibilities": ["Developed \"Banking Bot\" implementing conversational AI logic", "Implemented chatbot workflows", "Gained experience with AI development tools"],
            "achievements": ["Successfully developed Banking Bot", "Completed IBM SkillBuild AI certification"],
            "technologies": ["AI", "Chatbot Development", "IBM Watson", "Python", "NLP"]
        },
        {
            "_id": "3",
            "company": "Arth Consultancy",
            "position": "Web Developer Intern",
            "location": "On-site",
            "type": "internship",
            "startDate": "2024-07-01T00:00:00.000Z",
            "endDate": "2024-07-31T00:00:00.000Z",
            "current": false,
            "description": "Completed a one-month in-person internship focused on frontend web development.",
            "responsibilities": ["Built responsive UI using HTML5 & CSS3", "Developed mobile-first responsive layouts", "Collaborated with senior developers"],
            "achievements": ["Successfully completed frontend development internship", "Built responsive web pages for client projects"],
            "technologies": ["HTML5", "CSS3", "Responsive Design", "Flexbox", "Bootstrap", "JavaScript"]
        }
    ]
};

// Start with In-Memory data (populated by default)
let inMemoryDb = { ...INITIAL_DATA };

// Try to load from file on startup (if exists and readable)
try {
    // Ensure directory exists for eventual writes (local dev)
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* Ignore read-only FS errors */ }
    }

    if (fs.existsSync(DB_PATH)) {
        const fileData = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(fileData);
        // Merge file data with initial structure to ensure all keys exist
        inMemoryDb = { ...INITIAL_DATA, ...parsed };
        console.log('✅ Loaded database from file');
    } else {
        console.log('ℹ️ Database file not found, using In-Memory Initial Data');
        // Optional: Try to write it initially (works on local, fails gracefully on Vercel)
        writeDb(inMemoryDb);
    }
} catch (error) {
    console.log('⚠️ Failed to load database, using In-Memory fallback:', error.message);
}

// Read DB
const readDb = () => {
    return inMemoryDb;
};

// Write DB
const writeDb = (data) => {
    // 1. Update In-Memory (Always works)
    inMemoryDb = data;

    // 2. Try to persist to file (Works locally, Fails on Vercel)
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        // This is expected on Vercel/Netlify
        // console.warn('⚠️ Could not write to DB file (Read-Only Env). Data saved in memory only.');
        return false;
    }
};

module.exports = { readDb, writeDb };
