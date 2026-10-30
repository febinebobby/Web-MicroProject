/**
 * ==============================================================================
 * AI Student Performance Analytics Dashboard
 * Karunya Institute of Technology and Sciences (Deemed-to-be University)
 * Academic Micro-Project | First Year - Semester I
 * ==============================================================================
 * 
 * File: script.js
 * Purpose: Handles client-side interactivity, dynamic grading calculations,
 *          scroll-triggered animations, interactive widgets, and visual effects.
 * 
 * Key Concepts Covered (Beginner-Friendly for 1st Year Students):
 * 1. DOM Selection & Manipulation (querySelector, querySelectorAll, classList)
 * 2. Event Listeners ('DOMContentLoaded', 'click', 'input', 'scroll')
 * 3. Intersection Observer API (High-performance scroll triggers)
 * 4. requestAnimationFrame (Smooth number counting & animations)
 * 5. Dynamic HTML5 Canvas particle rendering (Confetti celebration)
 * ==============================================================================
 */

// Wait for the complete DOM document to load before executing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Core Navigation & Year Synchronization ---
    initNavigationScrollSpy();
    initDynamicAcademicYear();

    // --- 2. Interactive Showcase & Mini-Cards ---
    initSubjectCardInteractions();
    initProgressBarAnimations();

    // --- 3. Dynamic Number Counters (Stats & Profile KPIs) ---
    initAnimatedCounters();

    // --- 4. Interactive Live Grade & SGPA Simulator Widget ---
    initGradeSimulator();

    // --- 5. Interactive Grade Table Quick Lookup Search ---
    initGradeTableLookup();

    // --- 6. Scroll-Triggered Reveal Animations (AOS Style) ---
    initScrollReveal();

    // --- 7. Button Click Ripple Wave Effect ---
    initButtonRipples();

    // --- 8. Floating Back-to-Top with Circular Scroll Progress ---
    initBackToTopWithProgress();

    // --- 9. Confetti Celebration Particle Engine ---
    initCelebrationConfetti();

    console.log('🎓 Karunya Analytics: All interactive modules & animations initialized successfully!');
});


/**
 * ------------------------------------------------------------------------------
 * 1. Navigation ScrollSpy & Smooth Scrolling
 * ------------------------------------------------------------------------------
 * Automatically highlights the active menu link as the user scrolls
 * through different sections of the page.
 */
function initNavigationScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id], footer[id]');
    let isClickScrolling = false;

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

    // Smooth scroll on navbar link click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                highlightNav(targetId);

                // Pause scroll-triggered spy while smooth-scroll transitions
                isClickScrolling = true;
                setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            }
        });
    });

    // High-performance IntersectionObserver for scroll tracking
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (isClickScrolling) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    highlightNav(entry.target.id);
                }
            });
        }, {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }
}


/**
 * ------------------------------------------------------------------------------
 * 2. Animated Number Counters (Statistics & Student KPIs)
 * ------------------------------------------------------------------------------
 * Smoothly counts numbers from 0 up to their target values using
 * requestAnimationFrame with an ease-out timing curve.
 */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-target]');
    if (!counterElements.length) return;

    // Helper function to animate a single counter
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600; // 1.6 seconds animation duration
        const startTime = performance.now();

        // Preserve inner markup like <span>Scale</span> if present
        const childSpan = el.querySelector('span');
        const spanText = childSpan ? childSpan.outerHTML : '';

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-Out Cubic mathematical curve: starts fast, lands gently
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * target;

            // Update text with correct decimal places
            const formattedNum = currentVal.toFixed(decimals) + suffix;

            if (childSpan) {
                el.innerHTML = `${formattedNum} ${spanText}`;
            } else {
                el.textContent = formattedNum;
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                // Ensure exact final number is displayed
                const finalNum = target.toFixed(decimals) + suffix;
                if (childSpan) {
                    el.innerHTML = `${finalNum} ${spanText}`;
                } else {
                    el.textContent = finalNum;
                }
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // Trigger counter when the element scrolls into viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target); // Run once only
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        counterElements.forEach(el => animateCounter(el));
    }
}


/**
 * ------------------------------------------------------------------------------
 * 3. Animated Progress Bars on Viewport Entry
 * ------------------------------------------------------------------------------
 * Starts progress bars at 0% and expands them to their target percentages
 * when the Showcase Dashboard scrolls into view.
 */
function initProgressBarAnimations() {
    const progressFills = document.querySelectorAll('.progress-fill[data-width]');
    if (!progressFills.length) return;

    // Initially collapse all fills to 0% width
    progressFills.forEach(fill => {
        fill.style.width = '0%';
    });

    function fillBars() {
        progressFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width');
            fill.style.width = `${targetWidth}%`;
        });
    }

    const mockup = document.querySelector('.dashboard-mockup');
    if (mockup && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillBars();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(mockup);
    } else {
        fillBars();
    }
}


/**
 * ------------------------------------------------------------------------------
 * 4. Interactive Subject Cards in Showcase Dashboard
 * ------------------------------------------------------------------------------
 * Clicking or pressing Enter on a subject card updates the AI Performance
 * Insight recommendation banner in real time.
 */
function initSubjectCardInteractions() {
    const subjectCards = document.querySelectorAll('.subject-mini-card');
    const insightBanner = document.querySelector('.mockup-insight-banner .insight-text');

    if (!subjectCards.length || !insightBanner) return;

    // Detailed subject diagnostic text
    const subjectInsights = {
        'Machine Learning & AI': '<strong>Machine Learning & AI (93/100):</strong> Outstanding conceptual grasp and practical neural model implementation. Top 5% in cohort. Recommendation: Recommended for Advanced Deep Learning Elective.',
        'Database Management': '<strong>Database Management (86/100):</strong> Excellent query optimization and relational schema design proficiency. Eligible for cloud database certification track.',
        'Computer Networks': '<strong>Computer Networks (82/100):</strong> Strong understanding of OSI stack and protocol routing. Consistent performance across continuous internal assessments.',
        'Design & Analysis of Algorithms': '<strong>Design & Analysis of Algorithms (76/100):</strong> Good asymptotic complexity analysis and dynamic programming foundation. Recommended for competitive programming workshops.'
    };

    function selectCard(card) {
        const titleElement = card.querySelector('h5');
        if (!titleElement) return;

        const subjectTitle = titleElement.textContent.trim();
        const insightText = subjectInsights[subjectTitle];

        if (insightText) {
            insightBanner.style.opacity = '0';
            setTimeout(() => {
                insightBanner.innerHTML = insightText;
                insightBanner.style.opacity = '1';
            }, 140);

            subjectCards.forEach(c => c.classList.remove('selected-card'));
            card.classList.add('selected-card');
        }
    }

    subjectCards.forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => selectCard(card));

        // Keyboard accessibility (Enter & Space keys)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCard(card);
            }
        });
    });
}


/**
 * ------------------------------------------------------------------------------
 * 5. Interactive Real-Time Grade & SGPA Simulator
 * ------------------------------------------------------------------------------
 * Allows the student or evaluator to drag the range slider or click preset
 * chips to test dynamic 10-point scale grade conversion instantly!
 */
function initGradeSimulator() {
    const slider = document.getElementById('simMarksInput');
    const scoreVal = document.getElementById('simScoreValue');
    const gradePill = document.getElementById('simGradePill');
    const gradePoint = document.getElementById('simGradePoint');
    const statusPill = document.getElementById('simStatusPill');
    const remark = document.getElementById('simRemark');
    const presetButtons = document.querySelectorAll('.preset-chip');

    if (!slider || !scoreVal || !gradePill) return;

    let hasCelebrated = false;

    // Karunya 10-Point Grade Conversion Logic
    function calculateGrade(score) {
        if (score >= 90) {
            return {
                letter: 'O',
                point: '10.0',
                status: 'Passed with Distinction',
                remark: 'Outstanding conceptual mastery & continuous assessment record.',
                colorClass: 'grade-o'
            };
        } else if (score >= 80) {
            return {
                letter: 'A+',
                point: '9.0',
                status: 'Passed with Honors',
                remark: 'Excellent performance and strong practical problem-solving.',
                colorClass: 'grade-aplus'
            };
        } else if (score >= 70) {
            return {
                letter: 'A',
                point: '8.0',
                status: 'Passed (Very Good)',
                remark: 'Very good grasp of theory with consistent assignment delivery.',
                colorClass: 'grade-a'
            };
        } else if (score >= 60) {
            return {
                letter: 'B+',
                point: '7.0',
                status: 'Passed (Good)',
                remark: 'Good foundational comprehension and satisfactory practicals.',
                colorClass: 'grade-bplus'
            };
        } else if (score >= 50) {
            return {
                letter: 'B',
                point: '6.0',
                status: 'Passed (Above Average)',
                remark: 'Satisfactory completion of course outcomes. Scope for improvement.',
                colorClass: 'grade-b'
            };
        } else {
            return {
                letter: 'RA',
                point: '0.0',
                status: 'Remedial Required (Arrear)',
                remark: 'Re-appear required; recommended to attend mentor remedial coaching.',
                colorClass: 'grade-ra'
            };
        }
    }

    // Updates UI state
    function updateSimulator(score, triggerConfetti = true) {
        scoreVal.textContent = score;
        const res = calculateGrade(score);

        // Update Grade Pill with bounce animation
        gradePill.textContent = res.letter;
        gradePill.className = `sim-grade-pill ${res.colorClass} pop-anim`;
        setTimeout(() => gradePill.classList.remove('pop-anim'), 350);

        // Update Grade Point & Standing
        gradePoint.textContent = res.point;
        statusPill.textContent = res.status;
        remark.textContent = res.remark;

        // Synchronize preset button active highlights
        presetButtons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-score'), 10) === score) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Trigger celebratory confetti burst when achieving Grade O (90+)
        if (score >= 90 && triggerConfetti && !hasCelebrated && window.fireConfetti) {
            window.fireConfetti();
            hasCelebrated = true;
        } else if (score < 90) {
            hasCelebrated = false; // Reset trigger
        }
    }

    // Range slider input event (fires continuously during drag)
    slider.addEventListener('input', (e) => {
        const score = parseInt(e.target.value, 10);
        updateSimulator(score);
    });

    // Preset button clicks
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const score = parseInt(btn.getAttribute('data-score'), 10);
            slider.value = score;
            updateSimulator(score, true);
        });
    });

    // Initial render
    updateSimulator(parseInt(slider.value, 10), false);
}


/**
 * ------------------------------------------------------------------------------
 * 6. Interactive Quick Table Row Lookup Search
 * ------------------------------------------------------------------------------
 * Allows the user to type any score (0-100) into the input box to instantly
 * highlight the matching row in the Karunya 10-point scale table.
 */
function initGradeTableLookup() {
    const searchInput = document.getElementById('gradeTableSearch');
    const statusText = document.getElementById('lookupStatusText');
    const tableRows = document.querySelectorAll('.grading-table .grade-row');

    if (!searchInput || !tableRows.length) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (query === '') {
            tableRows.forEach(row => row.classList.remove('row-active'));
            if (statusText) statusText.textContent = 'Type score to highlight row';
            return;
        }

        const mark = parseFloat(query);
        if (isNaN(mark) || mark < 0 || mark > 100) {
            tableRows.forEach(row => row.classList.remove('row-active'));
            if (statusText) statusText.textContent = 'Please enter a valid mark (0 - 100)';
            return;
        }

        let matchedRow = null;
        tableRows.forEach(row => {
            const min = parseFloat(row.getAttribute('data-min'));
            const max = parseFloat(row.getAttribute('data-max'));

            if (mark >= min && mark <= max) {
                row.classList.add('row-active');
                matchedRow = row;
            } else {
                row.classList.remove('row-active');
            }
        });

        if (matchedRow && statusText) {
            const gradeName = matchedRow.querySelector('.grade-badge-sm')?.textContent || '';
            statusText.textContent = `Score ${mark} matches Grade ${gradeName} (${matchedRow.querySelector('td:nth-child(4)')?.textContent})`;
        }
    });
}


/**
 * ------------------------------------------------------------------------------
 * 7. Scroll-Triggered Reveal Animations (AOS style)
 * ------------------------------------------------------------------------------
 * Reveals sections and cards as they enter the user's viewport with smooth
 * upward translation and fade-in transitions.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }
}


/**
 * ------------------------------------------------------------------------------
 * 8. Button Click Ripple Wave Effect
 * ------------------------------------------------------------------------------
 * Spawns an expanding circular ripple from the exact coordinates of the mouse
 * click, giving buttons a tactile, responsive feedback.
 */
function initButtonRipples() {
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-secondary, .btn-hero-secondary, .btn-callout, .preset-chip');

    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-wave');

            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}


/**
 * ------------------------------------------------------------------------------
 * 9. Floating Back-to-Top Button with Circular Scroll Progress
 * ------------------------------------------------------------------------------
 * Fades in a floating circular button when scrolled down, updating an SVG
 * progress ring that reflects the user's current reading position.
 */
function initBackToTopWithProgress() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const progressCircle = document.getElementById('scrollProgressCircle');

    if (!backToTopBtn || !progressCircle) return;

    const circumference = 2 * Math.PI * 20; // Radius = 20, ~125.66px
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

        // Update progress ring offset
        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = `${offset}`;

        // Show button after scrolling past 320px
        if (scrollTop > 320) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Smooth scroll back to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/**
 * ------------------------------------------------------------------------------
 * 10. Standalone Celebration Confetti Canvas
 * ------------------------------------------------------------------------------
 * A zero-dependency, lightweight particle simulation that bursts festive
 * confetti across the screen when achieving high academic milestones (O Grade).
 */
function initCelebrationConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette matching the university branding
    const colors = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ec4899', '#fcd34d'];

    function createParticle() {
        return {
            x: canvas.width / 2 + (Math.random() - 0.5) * 300,
            y: canvas.height * 0.45,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 1.2) * 14,
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            opacity: 1,
            gravity: 0.38
        };
    }

    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98; // air resistance
            p.rotation += p.vRot;
            p.opacity -= 0.012;

            if (p.opacity > 0) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(p.opacity, 0);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
        }

        // Keep only active particles
        particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

        if (particles.length > 0) {
            animationId = requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Expose global trigger function
    window.fireConfetti = function() {
        // Spawn 45 festive confetti flakes
        for (let i = 0; i < 45; i++) {
            particles.push(createParticle());
        }

        if (!animationId) {
            renderConfetti();
        }
    };
}


/**
 * ------------------------------------------------------------------------------
 * 11. Dynamic Academic Year Setup
 * ------------------------------------------------------------------------------
 * Keeps the copyright year in the footer dynamically synchronized.
 */
function initDynamicAcademicYear() {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Karunya Institute of Technology and Sciences. All rights reserved. Academic Micro-Project.`;
    }
}
