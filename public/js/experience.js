// Experience Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadExperiences();
    updateExperienceStats();
});

// Calculate dynamic experience duration
function calculateExperienceDuration(startDateStr) {
    const startDate = new Date(startDateStr);
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    // Adjust for day of month
    if (now.getDate() < startDate.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    return { years, months, totalMonths: years * 12 + months };
}

// Update experience stats dynamically
function updateExperienceStats() {
    // Your work started at Rishabh Software on Jan 1, 2025
    const workStartDate = '2025-01-01';
    const duration = calculateExperienceDuration(workStartDate);

    // Find and update the "Year Experience" stat
    const statCards = document.querySelectorAll('.glass-card');
    statCards.forEach(card => {
        const label = card.querySelector('p');
        const value = card.querySelector('h3');

        if (label && value && label.textContent.includes('Year')) {
            // Update the experience dynamically
            if (duration.years >= 2) {
                value.textContent = duration.years + '+';
                label.textContent = 'Years Experience';
            } else if (duration.years >= 1) {
                value.textContent = '1+';
                label.textContent = 'Year Experience';
            } else {
                value.textContent = duration.months + '';
                label.textContent = 'Months Experience';
            }
        }
    });
}

// Load experiences - INSTANT loading with sample data first
async function loadExperiences() {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline) return;

    // INSTANT: Load sample experiences immediately (no waiting!)
    renderExperiences(getSampleExperiences());

    // Then try to fetch from API (in background, with timeout)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const res = await fetch('/api/experience', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();

        if (data.experiences && data.experiences.length > 0) {
            renderExperiences(data.experiences);
        }
    } catch (error) {
        // Already showing sample data, no action needed
        console.log('Using sample experiences (API not available)');
    }
}

function renderExperiences(experiences) {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline) return;

    timeline.innerHTML = experiences.map(exp => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        return `
            <div class="timeline-item fade-in visible">
                <span class="timeline-date">${startFormatted} - ${endDate}</span>
                <h3 class="timeline-title">${exp.position}</h3>
                <p class="timeline-company">${exp.company} ${exp.location ? `• ${exp.location}` : ''}</p>
                <p class="timeline-description">${exp.description || ''}</p>
                ${exp.responsibilities?.length ? `
                    <ul class="timeline-list">
                        ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                ` : ''}
                ${exp.technologies?.length ? `
                    <div class="timeline-tech">
                        ${exp.technologies.map(t => `<span>${t}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function getSampleExperiences() {
    return [
        {
            _id: '1',
            company: 'Rishabh Software',
            position: 'Full Stack Intern → Software Engineer Trainee',
            location: 'Vadodara, Gujarat, India',
            type: 'full-time',
            startDate: '2025-01-01',
            current: true,
            description: `<strong>1 Year 1 Month</strong> | Started as Full Stack Intern (Jan 2025 - Jun 2025), promoted to Software Engineer Trainee (Jul 2025 - Present). Working on enterprise-grade applications using .NET Core, Angular, and SQL Server.`,
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
            technologies: ['Angular', 'ASP.NET', '.NET Core', 'C#', 'SQL Server', 'Azure AD', 'MSAL', 'Dapper', 'Entity Framework', 'Clean Architecture', 'Microservices', 'REST API']
        },
        {
            _id: '2',
            company: 'GTU IBM SkillBuild',
            position: 'AI Intern',
            location: 'Online (Remote)',
            type: 'internship',
            startDate: '2025-07-01',
            endDate: '2025-07-31',
            description: 'Completed a one-month online AI internship program focused on conversational AI and chatbot development.',
            responsibilities: [
                'Developed "Banking Bot" implementing basic conversational AI logic',
                'Learned fundamentals of Artificial Intelligence and Machine Learning',
                'Implemented chatbot workflows using AI-based conversation patterns',
                'Gained hands-on experience with AI development tools and frameworks',
                'Completed IBM SkillBuild AI training modules and assessments'
            ],
            technologies: ['AI', 'Chatbot Development', 'Conversational AI', 'IBM Watson', 'Python', 'NLP']
        },
        {
            _id: '3',
            company: 'Arth Consultancy',
            position: 'Web Developer Intern',
            location: 'On-site',
            type: 'internship',
            startDate: '2024-07-01',
            endDate: '2024-07-31',
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
            technologies: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'CSS Grid', 'Bootstrap', 'JavaScript']
        }
    ];
}
