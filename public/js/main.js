// ===== PORTFOLIO MAIN JS =====

// Configuration
const API_BASE = '/api';

// Your work start date at Rishabh Software
const WORK_START_DATE = '2025-01-01';

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initVisitorTracking();
    loadFeaturedProjects();
    updateDynamicExperience();
});

// ===== DYNAMIC EXPERIENCE CALCULATION =====
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

function updateDynamicExperience() {
    const duration = calculateExperienceDuration(WORK_START_DATE);
    const experienceEl = document.getElementById('experienceYears');

    if (experienceEl) {
        if (duration.years >= 2) {
            experienceEl.textContent = duration.years + '+';
            const label = experienceEl.nextElementSibling;
            if (label) label.textContent = 'Years Experience';
        } else if (duration.years >= 1) {
            experienceEl.textContent = '1+';
            const label = experienceEl.nextElementSibling;
            if (label) label.textContent = 'Year Experience';
        } else {
            experienceEl.textContent = duration.months + '';
            const label = experienceEl.nextElementSibling;
            if (label) label.textContent = 'Months Experience';
        }
    }
}

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const scrollTop = document.getElementById('scrollTop');

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop?.classList.add('visible');
        } else {
            scrollTop?.classList.remove('visible');
        }
    });

    // Scroll to top
    scrollTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in')
        .forEach(el => observer.observe(el));
}

// ===== VISITOR TRACKING =====
function initVisitorTracking() {
    const sessionId = getSessionId();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Track visit
    fetch(`${API_BASE}/visitors/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId,
            page: currentPage,
            referrer: document.referrer,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.sessionId) {
                sessionStorage.setItem('visitorId', data.sessionId);
            }
        })
        .catch(() => console.log('Tracking offline'));

    // Get visitor count
    fetch(`${API_BASE}/visitors/count`)
        .then(res => res.json())
        .then(data => {
            const counter = document.getElementById('visitorCount');
            if (counter) {
                counter.textContent = data.total || '0';
            }
        })
        .catch(() => { });

    // Track time spent
    let timeSpent = 0;
    setInterval(() => {
        timeSpent += 30;
        fetch(`${API_BASE}/visitors/time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, timeSpent: 30 })
        }).catch(() => { });
    }, 30000);
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('visitorId');
    if (!sessionId) {
        sessionId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('visitorId', sessionId);
    }
    return sessionId;
}

// ===== FEATURED PROJECTS - INSTANT LOADING =====
async function loadFeaturedProjects() {
    const grid = document.getElementById('featuredProjectsGrid');
    if (!grid) return;

    // INSTANT: Load sample projects immediately (no waiting!)
    const sampleProjects = getSampleProjects();
    window.allHomeProjects = sampleProjects;
    grid.innerHTML = sampleProjects.map((project, index) => createProjectCard(project, index)).join('');
    updateDynamicStats(sampleProjects);

    // Then try to fetch from API (in background, with timeout)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const res = await fetch(`${API_BASE}/projects?featured=true`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();

        if (data.projects && data.projects.length > 0) {
            window.allHomeProjects = data.projects;
            grid.innerHTML = data.projects.map((project, index) => createProjectCard(project, index)).join('');
            updateDynamicStats(data.projects);
        }
    } catch (error) {
        // Already showing sample data, no action needed
        console.log('Using sample projects (API not available)');
    }
}

// Update dynamic stats on homepage
function updateDynamicStats(projects) {
    const projectCount = document.getElementById('projectCount');
    const clientCount = document.getElementById('clientCount');

    if (projectCount && projects) {
        projectCount.textContent = projects.length + '+';
    }

    if (clientCount && projects) {
        // Count internal/enterprise projects (not personal)
        const enterpriseProjects = projects.filter(p =>
            p.description?.includes('Internal Project') ||
            p.description?.includes('Client Project') ||
            p.description?.includes('R&D')
        ).length;
        clientCount.textContent = enterpriseProjects + '+';
    }
}

function createProjectCard(project, index = 0) {
    return `
        <div class="project-card fade-in" data-category="${project.category}" onclick="openHomeProjectModal(${index})" style="cursor: pointer;">
            <div class="project-image">
                <img src="${project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}" alt="${project.title}">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.liveUrl && project.liveUrl !== '#' ? `<a href="${project.liveUrl}" target="_blank" title="Live Demo" onclick="event.stopPropagation();"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.githubUrl && project.githubUrl !== '#' ? `<a href="${project.githubUrl}" target="_blank" title="View Code" onclick="event.stopPropagation();"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.shortDescription}</p>
                <div class="project-tech">
                    ${project.technologies?.slice(0, 4).map(tech => `<span>${tech}</span>`).join('') || ''}
                </div>
                <button class="btn btn-sm btn-outline" style="margin-top: 10px;" onclick="event.stopPropagation(); openHomeProjectModal(${index});">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
}

// Open project modal on homepage
function openHomeProjectModal(index) {
    const project = window.allHomeProjects?.[index];
    if (!project) {
        // Redirect to projects page if modal not available
        window.location.href = 'projects.html';
        return;
    }

    // Check if modal exists, if not redirect to projects page
    const modal = document.getElementById('projectModal');
    if (!modal) {
        window.location.href = 'projects.html';
        return;
    }

    document.getElementById('modalImage').src = project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').innerHTML = project.description || project.shortDescription;

    // Technologies
    document.getElementById('modalTech').innerHTML = (project.technologies || []).map(t => `<span>${t}</span>`).join('');

    // Keywords
    const keywordsSection = document.getElementById('modalKeywords');
    if (keywordsSection && project.keywords && project.keywords.length > 0) {
        keywordsSection.style.display = 'block';
        keywordsSection.querySelector('.modal-keywords').innerHTML = project.keywords.map(k => `<span>${k}</span>`).join('');
    } else if (keywordsSection) {
        keywordsSection.style.display = 'none';
    }

    // Links
    const githubBtn = document.getElementById('modalGithub');
    const liveBtn = document.getElementById('modalLive');

    if (githubBtn) {
        if (project.githubUrl && project.githubUrl !== '#') {
            githubBtn.href = project.githubUrl;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }
    }

    if (liveBtn) {
        if (project.liveUrl && project.liveUrl !== '#') {
            liveBtn.href = project.liveUrl;
            liveBtn.style.display = 'inline-flex';
        } else {
            liveBtn.style.display = 'none';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make function globally available
window.openHomeProjectModal = openHomeProjectModal;

function getSampleProjects() {
    return [
        {
            _id: '1',
            title: 'Clean Architecture Framework',
            category: 'backend',
            shortDescription: 'Modular Monolith Architecture with plug-and-play modules, reducing project setup time by 40%',
            description: '<p><strong>R&D Internal Project</strong> - Enterprise-grade framework for standardized development.</p>',
            technologies: ['.NET Core', 'Clean Architecture', 'JWT', 'MSAL'],
            keywords: ['Clean Architecture', 'Enterprise'],
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '2',
            title: 'Admin 360',
            category: 'fullstack',
            shortDescription: 'Enterprise admin platform with Azure AD SSO + API optimization achieving 95% performance improvement',
            description: '<p><strong>Internal Project</strong> - 24+ microservices with centralized identity management.</p>',
            technologies: ['Azure AD', 'MSAL', '.NET Core', 'Dapper'],
            keywords: ['Azure AD', 'Microservices'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '3',
            title: 'Rtalent',
            category: 'fullstack',
            shortDescription: 'Internal talent management platform serving 800-1,200 employees with auto-resume generation',
            description: '<p><strong>Internal Project</strong> - Talent management with auto-resume generation.</p>',
            technologies: ['.NET Core', 'Angular', 'SQL Server'],
            keywords: ['Talent Management', 'HR Tech'],
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '4',
            title: 'Reflection',
            category: 'fullstack',
            shortDescription: 'Performance feedback and review system with structured employee-manager evaluations',
            description: '<p><strong>Internal Project</strong> - Performance feedback and review system.</p>',
            technologies: ['.NET Core', 'Angular', 'SQL Server'],
            keywords: ['Performance Management', 'HR Tech'],
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '5',
            title: 'EMS - Employee Management System',
            category: 'fullstack',
            shortDescription: 'Comprehensive employee lifecycle management from onboarding to resignation',
            description: '<p><strong>Internal Project</strong> - Full employee lifecycle management.</p>',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'SignalR'],
            keywords: ['Employee Management', 'HRMS'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '6',
            title: 'DOOHIT - Digital Out-of-Home Platform',
            category: 'fullstack',
            shortDescription: 'Advertisement platform connecting media buyers and owners for virtual billboard visualization',
            description: '<p><strong>Client Project</strong> - Digital Out-of-Home advertising platform.</p>',
            technologies: ['.NET Core', 'Angular', 'Azure', 'Google Maps API'],
            keywords: ['DOOH', 'Digital Advertising', 'Client Project'],
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '7',
            title: 'Guest House Management System',
            category: 'fullstack',
            shortDescription: 'Real-time room booking system with conflict validation and optimized availability checking',
            description: '<p><strong>Internal Project</strong> - Guest house booking with conflict prevention.</p>',
            technologies: ['.NET Core', 'Angular', 'SQL Server', 'SignalR'],
            keywords: ['Guest House', 'Room Booking'],
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907'
        },
        {
            _id: '8',
            title: 'Inventory Management System',
            category: 'fullstack',
            shortDescription: 'Full-featured IMS with CRUD operations, real-time activity logs, and low stock alerts',
            description: '<p><strong>Personal Project</strong> - Comprehensive inventory management.</p>',
            technologies: ['.NET Core', 'Angular', 'SQL Server'],
            keywords: ['Inventory Management', 'Personal Project'],
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
            githubUrl: 'https://github.com/HEMRAJ2907/IMS_BE'
        },
        {
            _id: '9',
            title: 'Gopal Herbals - Natural Wellness Website',
            category: 'frontend',
            shortDescription: 'Modern React.js website for herbal products with AI-assisted development',
            description: '<p><strong>Personal Project (AI-Assisted)</strong> - React.js herbal products website.</p>',
            technologies: ['React.js', 'Vite', 'JavaScript', 'Netlify'],
            keywords: ['React.js', 'AI Development'],
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
            liveUrl: 'https://ephemeral-sable-888455.netlify.app/',
            githubUrl: 'https://github.com/HEMRAJ2907'
        }
    ];
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showToast(result.error || 'Failed to send message', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Export for use in other scripts
window.showToast = showToast;
window.createProjectCard = createProjectCard;
