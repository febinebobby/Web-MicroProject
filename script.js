/**
 * ==============================================================================
 * AI Student Performance Analytics Dashboard
 * Karunya Institute of Technology and Sciences (Deemed-to-be University)
 * Academic Micro-Project | First Year - Semester I
 * ==============================================================================
 * 
 * File: script.js
 * Purpose: Handles all client-side JavaScript interactions, dynamic behaviors,
 *          and navigation tracking.
 * 
 * Structure:
 * 1. DOMContentLoaded Event Initialization
 * 2. Navigation Active State & Smooth Scrolling (ScrollSpy)
 * 3. Interactive Subject Mini-Cards (Showcase Dashboard)
 * 4. Dynamic Academic Year Setup
 * 5. Console Diagnostics / Ready Signal
 * ==============================================================================
 */

// Wait for the entire HTML document to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all modular components
    initNavigationScrollSpy();
    initSubjectCardInteractions();
    initDynamicAcademicYear();
    
    console.log('✅ Karunya Student Analytics Portal: script.js loaded successfully.');
});

/**
 * ------------------------------------------------------------------------------
 * 1. Navigation ScrollSpy & Smooth Scrolling
 * ------------------------------------------------------------------------------
 * Automatically highlights the corresponding navigation link in the top menu
 * as the user scrolls through different sections of the page.
 */
function initNavigationScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id], footer[id]');
    let isClickScrolling = false;

    // Helper function to update the 'active' class on navbar links
    function highlightNav(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Event Listener for Navbar Clicks: Immediately update active state
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if link is an internal section anchor (#id)
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                highlightNav(targetId);

                // Temporarily pause scroll-triggered updates while smooth scrolling
                isClickScrolling = true;
                setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            }
        });
    });

    // IntersectionObserver options: Trigger when section is in viewport
    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
    };

    // Modern IntersectionObserver for high-performance scroll detection
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (isClickScrolling) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    highlightNav(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    } else {
        // Fallback for older browsers using window scroll event
        window.addEventListener('scroll', () => {
            if (isClickScrolling) return;
            
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                highlightNav(currentSectionId);
            }
        });
    }
}

/**
 * ------------------------------------------------------------------------------
 * 2. Interactive Subject Cards in Showcase Dashboard
 * ------------------------------------------------------------------------------
 * Allows user to click on subject cards in the live transcript mockup
 * to update the AI Academic Performance Insight banner dynamically.
 */
function initSubjectCardInteractions() {
    const subjectCards = document.querySelectorAll('.subject-mini-card');
    const insightBanner = document.querySelector('.mockup-insight-banner .insight-text');

    if (!subjectCards.length || !insightBanner) return;

    // Detailed subject insights mapping
    const subjectInsights = {
        'Machine Learning & AI': '<strong>Machine Learning & AI (93/100):</strong> Outstanding conceptual grasp and practical implementation skills. Top 5% in cohort. Recommendation: Recommended for Advanced Deep Learning Elective.',
        'Database Management': '<strong>Database Management (86/100):</strong> Excellent query optimization and relational schema design proficiency. Eligible for cloud database certification track.',
        'Computer Networks': '<strong>Computer Networks (82/100):</strong> Strong understanding of OSI stack and protocol routing. Consistent performance across continuous internal assessments.',
        'Design & Analysis of Algorithms': '<strong>Design & Analysis of Algorithms (76/100):</strong> Good asymptotic complexity analysis and dynamic programming foundation. Recommended for competitive programming workshops.'
    };

    subjectCards.forEach(card => {
        // Change cursor to indicate interactivity
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            // Find subject title inside the card
            const titleElement = card.querySelector('h5');
            if (!titleElement) return;

            const subjectTitle = titleElement.textContent.trim();
            const insightText = subjectInsights[subjectTitle];

            if (insightText) {
                // Subtle fade transition for insight text
                insightBanner.style.opacity = '0';
                setTimeout(() => {
                    insightBanner.innerHTML = insightText;
                    insightBanner.style.opacity = '1';
                }, 150);

                // Highlight active card
                subjectCards.forEach(c => c.classList.remove('selected-card'));
                card.classList.add('selected-card');
            }
        });
    });
}

/**
 * ------------------------------------------------------------------------------
 * 3. Dynamic Academic Year Setup
 * ------------------------------------------------------------------------------
 * Keeps the copyright year in the footer dynamically synchronized.
 */
function initDynamicAcademicYear() {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        // Preserves academic institution attribution with current year
        footerYear.innerHTML = `&copy; ${currentYear} Karunya Institute of Technology and Sciences. All rights reserved. Academic Micro-Project.`;
    }
}
