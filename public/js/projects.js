// Projects Page JavaScript

let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAllProjects();
    initFilters();
    initModal();
});

// Load all projects - INSTANT loading with sample data first
async function loadAllProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    // INSTANT: Load sample projects immediately (no waiting!)
    allProjects = getSampleProjects();
    renderProjects(allProjects);

    // Then try to fetch from API (in background, with timeout)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const res = await fetch('/api/projects', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();

        if (data.projects && data.projects.length > 0) {
            allProjects = data.projects;
            renderProjects(data.projects);
        }
    } catch (error) {
        // Already showing sample data, no action needed
        console.log('Using sample projects (API not available)');
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = projects.map((project, index) => {
        return `
            <div class="project-card fade-in visible" data-category="${project.category}" data-index="${index}" onclick="openProjectModal(${index})">
                <div class="project-image">
                    <img src="${project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}" alt="${project.title}">
                    <div class="project-overlay">
                        <div class="project-links">
                            <button class="view-details-btn" onclick="event.stopPropagation(); openProjectModal(${index})"><i class="fas fa-eye"></i></button>
                            ${project.githubUrl && project.githubUrl !== '#' ? `<a href="${project.githubUrl}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.shortDescription || project.description}</p>
                    <div class="project-tech">
                        ${(project.technologies || []).slice(0, 4).map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal functionality
function initModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('projectModal')) {
        const modalHTML = `
            <div id="projectModal" class="project-modal">
                <div class="modal-content">
                    <button class="modal-close" onclick="closeProjectModal()">&times;</button>
                    <div class="modal-header">
                        <img id="modalImage" src="" alt="Project Image">
                    </div>
                    <div class="modal-body">
                        <span id="modalCategory" class="project-category"></span>
                        <h2 id="modalTitle"></h2>
                        <p id="modalDescription"></p>
                        <div class="modal-section">
                            <h4><i class="fas fa-code"></i> Technologies Used</h4>
                            <div id="modalTech" class="modal-tech"></div>
                        </div>
                        <div id="modalKeywords" class="modal-section" style="display: none;">
                            <h4><i class="fas fa-tags"></i> Keywords</h4>
                            <div class="modal-keywords"></div>
                        </div>
                        <div class="modal-actions">
                            <a id="modalGithub" href="#" target="_blank" class="btn btn-secondary" style="display: none;">
                                <i class="fab fa-github"></i> View Code
                            </a>
                            <a id="modalLive" href="#" target="_blank" class="btn btn-primary" style="display: none;">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Close modal on outside click
        document.getElementById('projectModal').addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') {
                closeProjectModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });
    }
}

function openProjectModal(index) {
    const project = allProjects[index];
    if (!project) return;

    const modal = document.getElementById('projectModal');
    document.getElementById('modalImage').src = project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').innerHTML = project.description || project.shortDescription;

    // Technologies
    document.getElementById('modalTech').innerHTML = (project.technologies || []).map(t => `<span>${t}</span>`).join('');

    // Keywords
    const keywordsSection = document.getElementById('modalKeywords');
    if (project.keywords && project.keywords.length > 0) {
        keywordsSection.style.display = 'block';
        keywordsSection.querySelector('.modal-keywords').innerHTML = project.keywords.map(k => `<span>${k}</span>`).join('');
    } else {
        keywordsSection.style.display = 'none';
    }

    // Links
    const githubBtn = document.getElementById('modalGithub');
    const liveBtn = document.getElementById('modalLive');

    if (project.githubUrl && project.githubUrl !== '#') {
        githubBtn.href = project.githubUrl;
        githubBtn.style.display = 'inline-flex';
    } else {
        githubBtn.style.display = 'none';
    }

    if (project.liveUrl && project.liveUrl !== '#') {
        liveBtn.href = project.liveUrl;
        liveBtn.style.display = 'inline-flex';
    } else {
        liveBtn.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Filter functionality
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.project-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function getSampleProjects() {
    return [
        {
            _id: '1',
            title: 'Clean Architecture Framework',
            shortDescription: 'Modular Monolith Architecture with plug-and-play modules, reducing project setup time by 40%',
            description: `
                <p><strong>R&D Internal Project</strong> - An enterprise-grade framework built to standardize and accelerate development across teams.</p>
                
                <h5>🎯 Key Achievements</h5>
                <ul>
                    <li>Designed and implemented <strong>Modular Monolith Architecture</strong> based on Clean Architecture principles</li>
                    <li>Enabled <strong>plug-and-play feature modules</strong>, reducing project setup time by <strong>40%</strong></li>
                    <li>Contributed to <strong>14 out of 47</strong> planned feature modules within R&D timelines</li>
                </ul>
                
                <h5>🛠️ Technical Implementation</h5>
                <ul>
                    <li>Built a <strong>generic CRUD framework</strong> for any entity or data model, minimizing repetitive code</li>
                    <li>Implemented <strong>JWT-based authentication</strong> and role-based authorization</li>
                    <li>Integrated <strong>.NET Core Identity</strong> and <strong>MSAL</strong> for secure, scalable access control</li>
                    <li>Designed RESTful APIs following industry best practices</li>
                </ul>
                
                <h5>📈 Impact</h5>
                <ul>
                    <li>Accelerated development speed across multiple teams</li>
                    <li>Reduced boilerplate code by implementing reusable patterns</li>
                    <li>Improved security with enterprise-grade authentication</li>
                </ul>
            `,
            category: 'backend',
            technologies: ['.NET Core', 'Clean Architecture', 'JWT', 'MSAL', 'Entity Framework', 'SQL Server', 'REST API', 'C#'],
            keywords: ['Clean Architecture', 'Modular Monolith', 'CRUD Framework', 'JWT Authentication', 'Role-Based Authorization', '.NET Core Identity', 'Enterprise Architecture', 'R&D Project'],
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '2',
            title: 'Admin 360',
            shortDescription: 'Enterprise admin platform with Azure AD SSO + API optimization achieving 95% performance improvement',
            description: `
                <p><strong>Internal Project</strong> - A comprehensive enterprise administration platform managing 24+ microservices with centralized identity management and optimized performance.</p>
                
                <h5>🔐 Authentication & Security</h5>
                <ul>
                    <li>Migrated authentication from <strong>Intra ID to Microsoft Azure AD (MSAL)</strong></li>
                    <li>Implemented <strong>unified SSO</strong> and centralized identity management</li>
                    <li>Enhanced security across all microservices with enterprise-grade authentication</li>
                </ul>
                
                <h5>⚡ Performance Optimization</h5>
                <ul>
                    <li>Optimized internal invoice API performance from <strong>30-40s → 1-2s</strong> (95%+ improvement)</li>
                    <li>Refactored data access from <strong>EF Core to Stored Procedures and Dapper</strong></li>
                    <li>Participated in <strong>database tuning</strong> and code optimization sessions</li>
                    <li>Identified query bottlenecks and improved overall throughput</li>
                </ul>
                
                <h5>🔧 System Enhancements</h5>
                <ul>
                    <li>Implemented <strong>automated scheduler jobs</strong> in Facility Management System (FMS)</li>
                    <li>Built daily automated deallocation for inactive employees</li>
                    <li>Enhanced performance across <strong>24+ microservices</strong></li>
                    <li>Improved scalability and response times across the platform</li>
                </ul>
                
                <h5>👥 Team Collaboration</h5>
                <ul>
                    <li>Worked under guidance of <strong>HOD Pradip Sir</strong></li>
                    <li>Handled service-level enhancements and cross-module integrations</li>
                    <li>Participated in code reviews and optimization sessions</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['Azure AD', 'MSAL', '.NET Core', 'Dapper', 'SQL Server', 'Stored Procedures', 'Microservices', 'Scheduler Jobs'],
            keywords: ['Azure AD', 'SSO', 'API Optimization', 'Microservices', 'Dapper', 'Performance Tuning', 'Enterprise Admin', 'FMS'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '3',
            title: 'Rtalent',
            shortDescription: 'Internal talent management platform serving 800-1,200 employees with auto-resume generation',
            description: `
                <p><strong>Internal Project</strong> - A comprehensive talent management platform enabling employees to manage skills, certifications, education, and project history efficiently.</p>
                
                <h5>👥 Platform Overview</h5>
                <ul>
                    <li>Developed and enhanced core modules for <strong>Rtalent</strong> talent management platform</li>
                    <li>Platform used by <strong>800-1,200 employees</strong> across the organization</li>
                    <li>Enabled management of skills, certifications, education, and project history</li>
                </ul>
                
                <h5>📄 Auto-Resume Generation</h5>
                <ul>
                    <li>Implemented <strong>auto-resume generation</strong> feature from employee profiles</li>
                    <li>Reduced manual resume creation effort by <strong>60-70%</strong></li>
                    <li>Improved <strong>data accuracy</strong> across employee profiles</li>
                    <li>Streamlined resume formatting with consistent templates</li>
                </ul>
                
                <h5>🤝 Stakeholder Collaboration</h5>
                <ul>
                    <li>Partnered with <strong>HR and leadership teams</strong> for requirements gathering</li>
                    <li>Aligned technical solutions with talent development goals</li>
                    <li>Improved feature usability and adoption rates</li>
                    <li>Gathered feedback for continuous improvement</li>
                </ul>
                
                <h5>📈 Impact</h5>
                <ul>
                    <li>Enhanced employee profile management experience</li>
                    <li>Reduced administrative overhead for HR teams</li>
                    <li>Improved talent tracking and skill gap analysis</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'REST API', 'PDF Generation', 'Bootstrap'],
            keywords: ['Talent Management', 'HR Tech', 'Auto-Resume', 'Employee Portal', 'Skills Management', 'Certification Tracking', 'Profile Management'],
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '4',
            title: 'Reflection',
            shortDescription: 'Performance feedback and review system with structured employee-manager evaluations',
            description: `
                <p><strong>Internal Project</strong> - A comprehensive performance feedback and review system enabling structured employee-to-manager evaluations across multiple departments and teams.</p>
                
                <h5>🎯 Core Development</h5>
                <ul>
                    <li>Developed <strong>key functional modules</strong> for Reflection performance feedback system</li>
                    <li>Enabled structured <strong>employee-to-manager evaluations</strong> across departments</li>
                    <li>Built scalable and maintainable backend and frontend components</li>
                </ul>
                
                <h5>📋 Standardization & Process Improvement</h5>
                <ul>
                    <li>Standardized <strong>feedback formats</strong> and evaluation criteria</li>
                    <li>Reduced review inconsistencies and manual follow-ups by <strong>25%</strong></li>
                    <li>Implemented consistent evaluation templates across teams</li>
                    <li>Streamlined the review workflow process</li>
                </ul>
                
                <h5>🤝 Stakeholder Collaboration</h5>
                <ul>
                    <li>Worked closely with <strong>managers and HR stakeholders</strong></li>
                    <li>Translated performance management requirements into technical solutions</li>
                    <li>Gathered feedback for continuous system improvement</li>
                    <li>Ensured alignment with organizational evaluation goals</li>
                </ul>
                
                <h5>📈 Impact</h5>
                <ul>
                    <li>Improved consistency in performance evaluations</li>
                    <li>Reduced administrative burden on HR teams</li>
                    <li>Enhanced transparency in the feedback process</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'REST API', 'Bootstrap', 'C#'],
            keywords: ['Performance Management', 'Feedback System', 'Employee Evaluation', 'HR Tech', 'Review System', 'Manager Tools', 'Appraisal'],
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '5',
            title: 'EMS - Employee Management System',
            shortDescription: 'Comprehensive employee lifecycle management from onboarding to resignation with cross-app integration',
            description: `
                <p><strong>Internal Project</strong> - A modern, full-featured Employee Management System handling the complete employee lifecycle from onboarding to exit, with seamless integration to other internal applications.</p>
                
                <h5>👤 Employee Lifecycle Management</h5>
                <ul>
                    <li>Automated <strong>employee onboarding</strong> workflow with document collection</li>
                    <li>Complete <strong>resignation/exit management</strong> with clearance tracking</li>
                    <li>Employee <strong>transfer and promotion</strong> management</li>
                    <li>Probation tracking and confirmation workflows</li>
                    <li>Employee status management (Active, On Leave, Resigned, Terminated)</li>
                </ul>
                
                <h5>📋 Master Data Management</h5>
                <ul>
                    <li><strong>Department Master</strong> - Organizational hierarchy management</li>
                    <li><strong>Designation Master</strong> - Role and position definitions</li>
                    <li><strong>Location Master</strong> - Office and branch management</li>
                    <li><strong>Shift Master</strong> - Work schedule configurations</li>
                    <li><strong>Holiday Master</strong> - Leave calendar management</li>
                    <li><strong>Document Type Master</strong> - Employee document categorization</li>
                </ul>
                
                <h5>📊 Core HR Features</h5>
                <ul>
                    <li>Employee <strong>personal information</strong> and contact details</li>
                    <li><strong>Educational qualifications</strong> and certifications tracking</li>
                    <li><strong>Work experience</strong> and employment history</li>
                    <li><strong>Bank details</strong> and salary information</li>
                    <li><strong>Emergency contacts</strong> and family information</li>
                    <li><strong>Document management</strong> with secure storage</li>
                </ul>
                
                <h5>🔗 System Integration</h5>
                <ul>
                    <li>Real-time <strong>data sync with other internal applications</strong></li>
                    <li>API-based integration for cross-system communication</li>
                    <li>Automated notifications and alerts</li>
                    <li>Centralized employee data as single source of truth</li>
                </ul>
                
                <h5>📈 Reporting & Analytics</h5>
                <ul>
                    <li>Employee headcount and attrition reports</li>
                    <li>Department-wise workforce analytics</li>
                    <li>Joining and exit trend analysis</li>
                    <li>Custom report generation</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'REST API', 'Bootstrap', 'SignalR', 'Background Jobs'],
            keywords: ['Employee Management', 'HRMS', 'Onboarding', 'Exit Management', 'Master Data', 'HR Automation', 'Workforce Management', 'API Integration'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '6',
            title: 'DOOHIT - Digital Out-of-Home Platform',
            shortDescription: 'Advertisement platform connecting media buyers and owners for virtual billboard visualization',
            description: `
                <p><strong>Client Project</strong> - An innovative Digital Out-of-Home (DOOH) advertising platform that bridges the gap between media buyers and media owners, enabling virtual visualization of advertisements on billboards and hoardings.</p>
                
                <h5>🎯 Platform Overview</h5>
                <ul>
                    <li>Connects <strong>media buyers</strong> (advertisers) with <strong>media owners</strong> (billboard operators)</li>
                    <li>Enables <strong>virtual advertisement visualization</strong> on billboards before purchase</li>
                    <li>Streamlines the outdoor advertising booking process</li>
                    <li>Platform for managing digital and traditional out-of-home advertising</li>
                </ul>
                
                <h5>👁️ Virtual Visualization Features</h5>
                <ul>
                    <li><strong>Real-time ad preview</strong> on virtual billboards/hoardings</li>
                    <li>Upload and visualize advertisement creatives</li>
                    <li>View ads in context with <strong>actual billboard locations</strong></li>
                    <li>Multiple format support for various billboard sizes</li>
                    <li>Before/after visualization comparison</li>
                </ul>
                
                <h5>📊 Media Owner Features</h5>
                <ul>
                    <li><strong>Inventory management</strong> for billboard locations</li>
                    <li>Availability calendar and booking management</li>
                    <li>Pricing and package configuration</li>
                    <li>Analytics on billboard impressions and engagement</li>
                    <li>Revenue tracking and reporting</li>
                </ul>
                
                <h5>🛒 Media Buyer Features</h5>
                <ul>
                    <li><strong>Search and discover</strong> billboard locations</li>
                    <li>Filter by location, size, traffic, and demographics</li>
                    <li>Campaign planning and scheduling</li>
                    <li>Budget management and cost estimation</li>
                    <li>Order tracking and invoice management</li>
                </ul>
                
                <h5>📈 Business Impact</h5>
                <ul>
                    <li>Reduced decision-making time for advertisers</li>
                    <li>Increased booking conversions through visualization</li>
                    <li>Streamlined communication between buyers and owners</li>
                    <li>Centralized platform for outdoor advertising management</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Azure', 'REST API', 'Image Processing', 'Google Maps API', 'Payment Gateway'],
            keywords: ['DOOH', 'Digital Advertising', 'Billboard', 'Media Buying', 'Out-of-Home', 'Ad Tech', 'Visualization', 'Client Project'],
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '7',
            title: 'Guest House Management System',
            shortDescription: 'Real-time room booking system for employees with conflict validation and optimized availability checking',
            description: `
                <p><strong>Internal Project</strong> - A comprehensive Guest House Management System enabling employees to book accommodations with real-time availability checking and intelligent conflict prevention.</p>
                
                <h5>🏨 Real-Time Booking System</h5>
                <ul>
                    <li><strong>Live room availability</strong> with instant status updates</li>
                    <li>Real-time booking confirmation and notifications</li>
                    <li>Interactive calendar view for date selection</li>
                    <li>Quick booking workflow for employee convenience</li>
                    <li>Booking modification and cancellation support</li>
                </ul>
                
                <h5>🔒 Conflict Validation & Prevention</h5>
                <ul>
                    <li><strong>Double-booking prevention</strong> - Two employees cannot book same room at same time</li>
                    <li>Real-time validation during booking process</li>
                    <li>Optimistic locking to handle concurrent booking attempts</li>
                    <li>Automatic conflict detection and user notification</li>
                    <li>Race condition handling for simultaneous requests</li>
                </ul>
                
                <h5>🏠 Room & Facility Management</h5>
                <ul>
                    <li><strong>Room inventory</strong> with categories (Single, Double, Suite)</li>
                    <li>Room amenities and facility details</li>
                    <li>Maintenance scheduling and room blocking</li>
                    <li>Guest house location and branch management</li>
                    <li>Room capacity and pricing configuration</li>
                </ul>
                
                <h5>👤 Employee Booking Features</h5>
                <ul>
                    <li>Employee authentication and profile integration</li>
                    <li><strong>Booking history</strong> and upcoming reservations</li>
                    <li>Check-in and check-out management</li>
                    <li>Guest details for accompanying visitors</li>
                    <li>Approval workflow for extended stays</li>
                </ul>
                
                <h5>⚡ Performance & Optimization</h5>
                <ul>
                    <li>Optimized queries for availability checking</li>
                    <li>Cached room availability for faster response</li>
                    <li>Efficient date range overlap detection</li>
                    <li>Database indexing for booking searches</li>
                </ul>
                
                <h5>📊 Admin & Reporting</h5>
                <ul>
                    <li>Occupancy reports and analytics</li>
                    <li>Booking trends and utilization statistics</li>
                    <li>Employee-wise booking reports</li>
                    <li>Revenue and cost tracking</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'SignalR', 'REST API', 'Bootstrap', 'Caching'],
            keywords: ['Guest House', 'Room Booking', 'Real-Time', 'Conflict Validation', 'Employee Portal', 'Hospitality', 'Reservation System', 'Accommodation'],
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '8',
            title: 'Inventory Management System',
            shortDescription: 'Full-featured IMS with CRUD operations, real-time activity logs, and low stock alerts',
            description: `
                <p><strong>Personal Project</strong> - A comprehensive Inventory Management System built from scratch with full CRUD functionality, real-time activity logging, and intelligent stock monitoring with alerts.</p>
                
                <h5>📦 Inventory CRUD Operations</h5>
                <ul>
                    <li><strong>Add Items</strong> - Create new inventory items with details</li>
                    <li><strong>Update Items</strong> - Modify item information, quantity, and pricing</li>
                    <li><strong>Delete Items</strong> - Remove items with confirmation</li>
                    <li>Bulk operations for efficient inventory management</li>
                    <li>Item categorization and organization</li>
                </ul>
                
                <h5>📋 Real-Time Activity Logs</h5>
                <ul>
                    <li><strong>Dedicated logs box</strong> displaying all system activities</li>
                    <li>Track all add, update, and delete operations</li>
                    <li>Timestamp and user information for each action</li>
                    <li>Complete audit trail of inventory changes</li>
                    <li>Filterable and searchable log history</li>
                </ul>
                
                <h5>⚠️ Low Stock Alerts</h5>
                <ul>
                    <li><strong>Automatic low stock detection</strong> based on threshold</li>
                    <li>Visual alert messages for items below minimum quantity</li>
                    <li>Configurable stock threshold per item</li>
                    <li>Dashboard highlighting items needing restock</li>
                    <li>Priority-based stock warnings</li>
                </ul>
                
                <h5>📊 Dashboard & Analytics</h5>
                <ul>
                    <li>Overview of total inventory value</li>
                    <li>Stock level visualization with charts</li>
                    <li>Category-wise inventory breakdown</li>
                    <li>Recent activity summary</li>
                    <li>Quick access to common operations</li>
                </ul>
                
                <h5>🔧 Technical Features</h5>
                <ul>
                    <li>RESTful API backend with .NET Core</li>
                    <li>Angular frontend with responsive design</li>
                    <li>Clean separation of frontend and backend</li>
                    <li>Database persistence with Entity Framework</li>
                    <li>Input validation and error handling</li>
                </ul>
                
                <h5>🔗 Source Code</h5>
                <ul>
                    <li><strong>Backend Repository:</strong> IMS_BE</li>
                    <li><strong>Frontend Repository:</strong> IMS_FE</li>
                    <li>Well-documented codebase</li>
                    <li>Open source on GitHub</li>
                </ul>
            `,
            category: 'fullstack',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'REST API', 'Bootstrap', 'TypeScript', 'C#'],
            keywords: ['Inventory Management', 'CRUD', 'Activity Logs', 'Stock Alerts', 'Personal Project', 'Full Stack', 'Angular', '.NET Core'],
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
            liveUrl: '#',
            githubUrl: 'https://github.com/HEMRAJ2907/IMS_BE'
        },
        {
            _id: '9',
            title: 'Gopal Herbals - Natural Wellness Website',
            shortDescription: 'Modern React.js website for herbal products with AI-assisted development, deployed on Netlify',
            description: `
                <p><strong>Personal Project (AI-Assisted)</strong> - A beautiful, modern website for Gopal Herbals showcasing natural herbal products and wellness solutions, built using React.js with AI assistance.</p>
                
                <h5>🌿 Website Overview</h5>
                <ul>
                    <li><strong>Gopal Herbals</strong> - Natural Healing & Wellness brand</li>
                    <li>Premium natural herbal products showcase</li>
                    <li>Modern, elegant design with nature-inspired aesthetics</li>
                    <li>Responsive design for all devices</li>
                </ul>
                
                <h5>🎨 Design Features</h5>
                <ul>
                    <li><strong>Beautiful UI/UX</strong> with modern typography (Outfit, Playfair Display)</li>
                    <li>Nature-inspired color palette and imagery</li>
                    <li>Smooth animations and transitions</li>
                    <li>Clean and professional layout</li>
                    <li>Mobile-first responsive design</li>
                </ul>
                
                <h5>📦 Product Showcase</h5>
                <ul>
                    <li>Herbal shampoo and hair care products</li>
                    <li>Natural wellness solutions</li>
                    <li>Product descriptions and benefits</li>
                    <li>Category-based product organization</li>
                </ul>
                
                <h5>🛠️ Technical Implementation</h5>
                <ul>
                    <li>Built with <strong>React.js</strong> and <strong>Vite</strong> for fast performance</li>
                    <li>Modern JavaScript/ES6+ features</li>
                    <li>Component-based architecture</li>
                    <li>Optimized build for production</li>
                    <li>SEO-friendly meta tags</li>
                </ul>
                
                <h5>🤖 AI-Assisted Development</h5>
                <ul>
                    <li>Developed with <strong>AI assistance</strong> for rapid prototyping</li>
                    <li>AI-generated components and styling</li>
                    <li>Efficient development workflow</li>
                    <li>Modern best practices implementation</li>
                </ul>
                
                <h5>🚀 Deployment</h5>
                <ul>
                    <li>Deployed on <strong>Netlify</strong> for fast global CDN</li>
                    <li>Continuous deployment from repository</li>
                    <li>SSL/HTTPS enabled</li>
                    <li>Live and accessible worldwide</li>
                </ul>
            `,
            category: 'frontend',
            technologies: ['React.js', 'Vite', 'JavaScript', 'CSS3', 'HTML5', 'Netlify', 'AI Development'],
            keywords: ['React.js', 'Herbal Products', 'E-commerce', 'Netlify', 'AI Development', 'Frontend', 'Wellness Website', 'Vite'],
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
            liveUrl: 'https://ephemeral-sable-888455.netlify.app/',
            githubUrl: 'https://github.com/HEMRAJ2907'
        }
    ];
}
