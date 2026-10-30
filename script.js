/**
 * ==============================================================================
 * AI Student Performance Analytics Dashboard
 * Karunya Institute of Technology and Sciences (Deemed-to-be University)
 * Academic Micro-Project | First Year - Semester I
 * ==============================================================================
 * 
 * File: script.js
 * Purpose: Handles client-side interactivity, dynamic grading calculations,
 *          theme switching, responsive mobile navigation, modal portals,
 *          scroll-triggered animations, and visual particle effects.
 * 
 * Concepts Demonstrated (Clear & Explanatory for 1st Year Students):
 * 1. Event Listeners ('DOMContentLoaded', 'click', 'input', 'keydown', 'scroll')
 * 2. Theme State Persistence using localStorage and CSS Variables
 * 3. Mobile Navigation Drawer with ARIA state and touch-backdrop handling
 * 4. Reactive Mathematical Formulas for SGPA (Choice Based Credit System - CBCS)
 * 5. Intersection Observer API for scroll-triggered counters and reveals
 * 6. Lightweight HTML5 Canvas Particle Engine for milestone confetti celebrations
 * 7. Accessible Modal & Accordion patterns (Keyboard Esc & ARIA expanded)
 * ==============================================================================
 */

// Execute all interactive modules once the HTML document structure is fully parsed
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Global Utilities & Toast Notifications ---
    initToastSystem();

    // --- 2. Theme Switcher (Dark / Light Mode) ---
    initThemeToggle();

    // --- 3. Responsive Navigation & Mobile Drawer ---
    initNavigationScrollSpy();
    initMobileNavigation();
    initDynamicAcademicYear();

    // --- 4. Interactive Showcase & Mini-Cards ---
    initSubjectCardInteractions();
    initProgressBarAnimations();

    // --- 5. Dynamic Number Counters (Stats & Profile KPIs) ---
    initAnimatedCounters();

    // --- 6. Interactive Live Grade Simulator Widget ---
    initGradeSimulator();

    // --- 7. Interactive Live SGPA Calculator (CBCS Formula) ---
    initSGPACalculator();

    // --- 8. Interactive Grade Table Quick Lookup Search ---
    initGradeTableLookup();

    // --- 9. Continuous Assessment Portal Modal ---
    initPortalModal();

    // --- 10. Academic FAQ Accordion ---
    initFaqAccordion();

    // --- 11. Scroll-Triggered Reveal Animations ---
    initScrollReveal();

    // --- 12. Button Click Tactile Ripple Wave Effect ---
    initButtonRipples();

    // --- 13. Floating Back-to-Top with Circular Scroll Progress ---
    initBackToTopWithProgress();

    // --- 14. Confetti Celebration Particle Engine ---
    initCelebrationConfetti();

    console.log('🎓 Karunya Analytics: All interactive modules initialized successfully!');
});


/**
 * ------------------------------------------------------------------------------
 * 1. Global Toast Notification System
 * ------------------------------------------------------------------------------
 * Renders non-intrusive floating feedback messages for user actions
 * (e.g., "Theme changed", "Marks saved", "Preset loaded").
 */
let toastTimeoutId = null;

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger entrance transition
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function initToastSystem() {
    // Expose showToast globally for convenient access across modules
    window.showToast = showToast;
}


/**
 * ------------------------------------------------------------------------------
 * 2. Theme Switcher (Dark / Light Mode) with LocalStorage
 * ------------------------------------------------------------------------------
 * Toggles [data-theme="dark"] on the <html> element, synchronizes the UI icon,
 * and persists the preference across reloads.
 */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Retrieve saved theme or infer from system color preference
    const savedTheme = localStorage.getItem('karunya_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
    }

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('karunya_theme', nextTheme);

        showToast(`${nextTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'} activated`, 'info');
    });
}


/**
 * ------------------------------------------------------------------------------
 * 3. Responsive Navigation, ScrollSpy & Mobile Drawer
 * ------------------------------------------------------------------------------
 * Provides high-performance section highlighting and mobile navigation drawer.
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

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                highlightNav(targetId);

                isClickScrolling = true;
                setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            }
        });
    });

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

function initMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navbar = document.getElementById('navbar');
    const backdrop = document.getElementById('nav-backdrop');
    const navLinks = document.querySelectorAll('.nav-links a, #mobile-portal-btn');

    if (!hamburgerBtn || !navbar) return;

    function toggleMenu(isOpen) {
        const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !navbar.classList.contains('nav-open');

        hamburgerBtn.classList.toggle('is-active', shouldOpen);
        hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        navbar.classList.toggle('nav-open', shouldOpen);

        if (backdrop) {
            backdrop.classList.toggle('is-active', shouldOpen);
        }

        // Prevent body scroll when drawer is open
        document.body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', () => toggleMenu());

    if (backdrop) {
        backdrop.addEventListener('click', () => toggleMenu(false));
    }

    // Close mobile drawer upon clicking any internal navigation item
    navLinks.forEach(item => {
        item.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
            toggleMenu(false);
        }
    });
}


/**
 * ------------------------------------------------------------------------------
 * 4. Animated Number Counters (Statistics & Profile KPIs)
 * ------------------------------------------------------------------------------
 * Mathematical Ease-Out curve for smooth counter animations from 0 to target.
 */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-target]');
    if (!counterElements.length) return;

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const startTime = performance.now();

        const childSpan = el.querySelector('span');
        const spanText = childSpan ? childSpan.outerHTML : '';

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * target;

            const formattedNum = currentVal.toFixed(decimals) + suffix;

            if (childSpan) {
                el.innerHTML = `${formattedNum} ${spanText}`;
            } else {
                el.textContent = formattedNum;
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
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

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => observer.observe(el));
    } else {
        counterElements.forEach(el => animateCounter(el));
    }
}


/**
 * ------------------------------------------------------------------------------
 * 5. Animated Progress Bars on Viewport Entry
 * ------------------------------------------------------------------------------
 */
function initProgressBarAnimations() {
    const progressFills = document.querySelectorAll('.progress-fill[data-width]');
    if (!progressFills.length) return;

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
 * 6. Interactive Subject Cards in Showcase Dashboard
 * ------------------------------------------------------------------------------
 */
function initSubjectCardInteractions() {
    const subjectCards = document.querySelectorAll('.subject-mini-card');
    const insightBanner = document.querySelector('.mockup-insight-banner .insight-text');

    if (!subjectCards.length || !insightBanner) return;

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
 * 7. Interactive Live Grade Simulator Widget
 * ------------------------------------------------------------------------------
 */
function getKarunyaGrade(score) {
    if (score >= 90) {
        return { letter: 'O', point: 10.0, status: 'Passed with Distinction', remark: 'Outstanding conceptual mastery & continuous assessment record.', colorClass: 'grade-o' };
    } else if (score >= 80) {
        return { letter: 'A+', point: 9.0, status: 'Passed with Honors', remark: 'Excellent performance and strong practical problem-solving.', colorClass: 'grade-aplus' };
    } else if (score >= 70) {
        return { letter: 'A', point: 8.0, status: 'Passed (Very Good)', remark: 'Very good grasp of theory with consistent assignment delivery.', colorClass: 'grade-a' };
    } else if (score >= 60) {
        return { letter: 'B+', point: 7.0, status: 'Passed (Good)', remark: 'Good foundational comprehension and satisfactory practicals.', colorClass: 'grade-bplus' };
    } else if (score >= 50) {
        return { letter: 'B', point: 6.0, status: 'Passed (Above Average)', remark: 'Satisfactory completion of course outcomes. Scope for improvement.', colorClass: 'grade-b' };
    } else {
        return { letter: 'RA', point: 0.0, status: 'Remedial Required (Arrear)', remark: 'Re-appear required; recommended to attend mentor remedial coaching.', colorClass: 'grade-ra' };
    }
}

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

    function updateSimulator(score, triggerConfetti = true) {
        scoreVal.textContent = score;
        const res = getKarunyaGrade(score);

        gradePill.textContent = res.letter;
        gradePill.className = `sim-grade-pill ${res.colorClass} pop-anim`;
        setTimeout(() => gradePill.classList.remove('pop-anim'), 350);

        gradePoint.textContent = res.point.toFixed(1);
        statusPill.textContent = res.status;
        remark.textContent = res.remark;

        presetButtons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-score'), 10) === score) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (score >= 90 && triggerConfetti && !hasCelebrated && window.fireConfetti) {
            window.fireConfetti();
            hasCelebrated = true;
        } else if (score < 90) {
            hasCelebrated = false;
        }
    }

    slider.addEventListener('input', (e) => {
        const score = parseInt(e.target.value, 10);
        updateSimulator(score);
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const score = parseInt(btn.getAttribute('data-score'), 10);
            slider.value = score;
            updateSimulator(score, true);
        });
    });

    updateSimulator(parseInt(slider.value, 10), false);
}


/**
 * ------------------------------------------------------------------------------
 * 8. Interactive Live SGPA & Grade Calculator (CBCS Engine)
 * ------------------------------------------------------------------------------
 * Allows students to add/remove course rows, customize credits & marks,
 * and calculates SGPA = Σ(Credits * GP) / Σ(Credits) in real time.
 */
function initSGPACalculator() {
    const rowsContainer = document.getElementById('calc-rows-container');
    const addRowBtn = document.getElementById('calc-add-row');
    const fillSem1Btn = document.getElementById('calc-fill-sem1');
    const resetBtn = document.getElementById('calc-reset');

    const resultSgpa = document.getElementById('calc-result-sgpa');
    const resultCredits = document.getElementById('calc-result-credits');
    const resultPercentage = document.getElementById('calc-result-percentage');
    const resultStanding = document.getElementById('calc-result-standing');
    const resultArrears = document.getElementById('calc-result-arrears');
    const resultStatusText = document.getElementById('calc-result-status-text');

    if (!rowsContainer) return;

    // Semester 1 Standard Course Catalog Preset for First-Year Engineering
    const sem1Preset = [
        { name: 'Linear Algebra & Calculus', credits: 4, marks: 88 },
        { name: 'Engineering Physics & Sensors', credits: 4, marks: 92 },
        { name: 'Programming in Python & C', credits: 3, marks: 95 },
        { name: 'Basic Electrical & Electronics', credits: 3, marks: 78 },
        { name: 'Technical English Communication', credits: 2, marks: 85 },
        { name: 'Computer Aided Engineering Graphics', credits: 2, marks: 84 }
    ];

    let rowCounter = 0;

    function createRow(name = '', credits = 4, marks = 85) {
        rowCounter++;
        const rowId = `calc-row-${rowCounter}`;
        const gradeInfo = getKarunyaGrade(marks);

        const tr = document.createElement('tr');
        tr.id = rowId;
        tr.className = 'calc-row';
        tr.innerHTML = `
            <td>
                <input type="text" class="calc-input-name" placeholder="Course Name (e.g. Physics)" value="${name}">
            </td>
            <td>
                <select class="calc-select-credits">
                    <option value="1" ${credits === 1 ? 'selected' : ''}>1.0 Credit</option>
                    <option value="2" ${credits === 2 ? 'selected' : ''}>2.0 Credits</option>
                    <option value="3" ${credits === 3 ? 'selected' : ''}>3.0 Credits</option>
                    <option value="4" ${credits === 4 ? 'selected' : ''}>4.0 Credits</option>
                    <option value="5" ${credits === 5 ? 'selected' : ''}>5.0 Credits</option>
                </select>
            </td>
            <td>
                <div class="calc-mark-input-wrap">
                    <input type="number" class="calc-input-marks" min="0" max="100" value="${marks}" placeholder="0-100">
                    <span class="calc-mark-suffix">/ 100</span>
                </div>
            </td>
            <td>
                <span class="grade-badge-sm ${gradeInfo.colorClass} row-grade-badge">${gradeInfo.letter}</span>
            </td>
            <td>
                <strong class="row-gp-val">${gradeInfo.point.toFixed(1)}</strong>
            </td>
            <td>
                <button type="button" class="btn-delete-row" aria-label="Delete course row" title="Remove course">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;

        // Attach reactive listeners to row inputs
        const marksInput = tr.querySelector('.calc-input-marks');
        const creditsSelect = tr.querySelector('.calc-select-credits');
        const deleteBtn = tr.querySelector('.btn-delete-row');
        const badge = tr.querySelector('.row-grade-badge');
        const gpVal = tr.querySelector('.row-gp-val');

        function updateRowGrade() {
            let val = parseFloat(marksInput.value);
            if (isNaN(val)) val = 0;
            if (val > 100) { val = 100; marksInput.value = 100; }
            if (val < 0) { val = 0; marksInput.value = 0; }

            const res = getKarunyaGrade(val);
            badge.textContent = res.letter;
            badge.className = `grade-badge-sm ${res.colorClass} row-grade-badge`;
            gpVal.textContent = res.point.toFixed(1);

            calculateTotalSGPA();
        }

        marksInput.addEventListener('input', updateRowGrade);
        creditsSelect.addEventListener('change', calculateTotalSGPA);

        deleteBtn.addEventListener('click', () => {
            if (rowsContainer.querySelectorAll('.calc-row').length <= 1) {
                showToast('You must keep at least one course row in the calculator.', 'warning');
                return;
            }
            tr.remove();
            calculateTotalSGPA();
        });

        return tr;
    }

    function calculateTotalSGPA() {
        const rows = rowsContainer.querySelectorAll('.calc-row');
        let totalCredits = 0;
        let totalQualityPoints = 0;
        let arrearsCount = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.calc-select-credits').value) || 0;
            let marks = parseFloat(row.querySelector('.calc-input-marks').value);
            if (isNaN(marks)) marks = 0;

            const res = getKarunyaGrade(marks);
            totalCredits += credits;
            totalQualityPoints += (credits * res.point);

            if (res.letter === 'RA') {
                arrearsCount++;
            }
        });

        let sgpa = 0;
        if (totalCredits > 0) {
            sgpa = totalQualityPoints / totalCredits;
        }

        // Percentage conversion according to AICTE / UGC standard: (SGPA - 0.5) * 10
        let percentage = 0;
        if (sgpa > 0) {
            percentage = Math.max((sgpa - 0.5) * 10, 0);
        }

        // Determine Academic Honors Standing
        let standing = 'Awaiting Marks';
        if (sgpa >= 8.5 && arrearsCount === 0) {
            standing = 'First Class with Distinction';
        } else if (sgpa >= 7.5 && arrearsCount === 0) {
            standing = 'First Class with Honors';
        } else if (sgpa >= 6.5 && arrearsCount === 0) {
            standing = 'First Class';
        } else if (sgpa >= 5.0 && arrearsCount === 0) {
            standing = 'Second Class';
        } else if (arrearsCount > 0) {
            standing = 'Remedial Required';
        }

        // Update DOM elements
        if (resultSgpa) resultSgpa.textContent = sgpa.toFixed(2);
        if (resultCredits) resultCredits.textContent = totalCredits.toFixed(1);
        if (resultPercentage) resultPercentage.textContent = `${percentage.toFixed(1)}%`;
        if (resultStanding) {
            resultStanding.textContent = standing;
            resultStanding.className = `standing-pill ${arrearsCount > 0 ? 'standing-remedial' : ''}`;
        }
        if (resultArrears) {
            resultArrears.textContent = arrearsCount === 0 ? 'All Clear' : `${arrearsCount} Arrears`;
            resultArrears.className = `metric-value-sm ${arrearsCount === 0 ? 'text-emerald' : 'text-danger'}`;
        }
        if (resultStatusText) {
            resultStatusText.textContent = arrearsCount === 0 ? '0 Backlogs detected' : 'Requires re-examination';
        }

        // Celebrate if SGPA >= 9.0
        if (sgpa >= 9.0 && window.fireConfetti && arrearsCount === 0) {
            window.fireConfetti();
        }
    }

    function populatePreset(courses) {
        rowsContainer.innerHTML = '';
        courses.forEach(c => {
            rowsContainer.appendChild(createRow(c.name, c.credits, c.marks));
        });
        calculateTotalSGPA();
    }

    // Button event listeners
    if (addRowBtn) {
        addRowBtn.addEventListener('click', () => {
            rowsContainer.appendChild(createRow('New Elective Course', 3, 80));
            calculateTotalSGPA();
            showToast('Course subject added to calculator', 'info');
        });
    }

    if (fillSem1Btn) {
        fillSem1Btn.addEventListener('click', () => {
            populatePreset(sem1Preset);
            showToast('Semester 1 course model loaded!', 'success');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            rowsContainer.innerHTML = '';
            rowsContainer.appendChild(createRow('Subject 1', 4, 80));
            calculateTotalSGPA();
            showToast('Calculator reset to default', 'info');
        });
    }

    // Initialize with Semester 1 Preset
    populatePreset(sem1Preset);
}


/**
 * ------------------------------------------------------------------------------
 * 9. Interactive Grade Table Quick Score Inspector
 * ------------------------------------------------------------------------------
 * Connects input search fields (#grade-score-input and #gradeTableSearch)
 * to highlight the matching university grade scale row.
 */
function initGradeTableLookup() {
    const scoreInput = document.getElementById('grade-score-input');
    const resultBadge = document.getElementById('grade-score-result');
    const tableRows = document.querySelectorAll('.grading-table tbody tr');

    if (!scoreInput || !tableRows.length) return;

    function inspectScore(rawVal) {
        const query = (rawVal || '').toString().trim();

        if (query === '') {
            tableRows.forEach(row => row.classList.remove('row-active'));
            if (resultBadge) resultBadge.innerHTML = '<span>Enter any score to highlight matching grade</span>';
            if (statusText) statusText.textContent = 'Type score to highlight row';
            return;
        }

        const mark = parseFloat(query);
        if (isNaN(mark) || mark < 0 || mark > 100) {
            tableRows.forEach(row => row.classList.remove('row-active'));
            if (resultBadge) resultBadge.innerHTML = '<span class="text-danger">Please enter a valid mark (0–100)</span>';
            if (statusText) statusText.textContent = 'Please enter a valid mark (0 - 100)';
            return;
        }

        const grade = getKarunyaGrade(mark);
        let matchedRow = null;

        tableRows.forEach(row => {
            const min = parseFloat(row.getAttribute('data-min'));
            const max = parseFloat(row.getAttribute('data-max'));

            if (!isNaN(min) && !isNaN(max) && mark >= min && mark <= max) {
                row.classList.add('row-active');
                matchedRow = row;
            } else {
                row.classList.remove('row-active');
            }
        });

        const feedbackHtml = `<strong>Score ${mark}:</strong> <span class="grade-badge-sm ${grade.colorClass}">${grade.letter}</span> • Grade Point: <strong>${grade.point.toFixed(1)}</strong> (${grade.status})`;

        if (resultBadge) resultBadge.innerHTML = feedbackHtml;

        if (mark >= 90 && window.fireConfetti) {
            window.fireConfetti();
        }
    }

    scoreInput.addEventListener('input', (e) => inspectScore(e.target.value));
}


/**
 * ------------------------------------------------------------------------------
 * 10. Continuous Assessment Portal Modal (Simulate Faculty Entry)
 * ------------------------------------------------------------------------------
 */
function initPortalModal() {
    const modal = document.getElementById('portal-modal');
    const openBtns = [
        document.getElementById('open-portal-btn'),
        document.getElementById('mobile-portal-btn')
    ].filter(Boolean);

    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const form = document.getElementById('modal-marks-form');

    const cia1Input = document.getElementById('mark-cia1');
    const cia2Input = document.getElementById('mark-cia2');
    const quizInput = document.getElementById('mark-quiz');
    const endsemInput = document.getElementById('mark-endsem');

    const scorePreview = document.getElementById('modal-score-preview');
    const gradePreview = document.getElementById('modal-grade-preview');
    const standingPreview = document.getElementById('modal-standing-preview');

    if (!modal) return;

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        updateModalPreview();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateModalPreview() {
        const c1 = Math.min(Math.max(parseFloat(cia1Input?.value) || 0, 0), 25);
        const c2 = Math.min(Math.max(parseFloat(cia2Input?.value) || 0, 0), 25);
        const qz = Math.min(Math.max(parseFloat(quizInput?.value) || 0, 0), 20);
        const es = Math.min(Math.max(parseFloat(endsemInput?.value) || 0, 0), 30);

        const total = Math.round(c1 + c2 + qz + es);
        const grade = getKarunyaGrade(total);

        if (scorePreview) scorePreview.textContent = `${total} / 100`;
        if (gradePreview) {
            gradePreview.textContent = `${grade.letter} (${grade.point.toFixed(1)})`;
            gradePreview.className = `grade-badge-sm ${grade.colorClass}`;
        }
        if (standingPreview) {
            standingPreview.textContent = grade.status;
            standingPreview.className = `standing-pill ${total < 50 ? 'standing-remedial' : ''}`;
        }
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    [cia1Input, cia2Input, quizInput, endsemInput].filter(Boolean).forEach(input => {
        input.addEventListener('input', updateModalPreview);
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const regNo = document.getElementById('student-reg')?.value || 'URK22CS1042';
            const course = document.getElementById('course-select')?.value || 'Course';

            closeModal();
            showToast(`✓ Continuous assessment marks recorded for ${regNo} (${course})!`, 'success');

            if (window.fireConfetti) {
                window.fireConfetti();
            }
        });
    }
}


/**
 * ------------------------------------------------------------------------------
 * 11. Academic FAQ Accordion
 * ------------------------------------------------------------------------------
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Toggle selected item
            if (!isCurrentlyActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


/**
 * ------------------------------------------------------------------------------
 * 12. Scroll-Triggered Reveal Animations (AOS Style)
 * ------------------------------------------------------------------------------
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
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }
}


/**
 * ------------------------------------------------------------------------------
 * 13. Button Click Tactile Ripple Wave Effect
 * ------------------------------------------------------------------------------
 */
function initButtonRipples() {
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-secondary, .btn-hero-secondary, .btn-callout, .preset-chip, .btn-calc-preset');

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
 * 14. Floating Back-to-Top with Circular Scroll Progress Ring
 * ------------------------------------------------------------------------------
 */
function initBackToTopWithProgress() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const progressCircle = document.getElementById('scrollProgressCircle');

    if (!backToTopBtn || !progressCircle) return;

    const circumference = 2 * Math.PI * 20;
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = `${offset}`;

        if (scrollTop > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/**
 * ------------------------------------------------------------------------------
 * 15. Standalone Celebration Confetti Canvas Particle Engine
 * ------------------------------------------------------------------------------
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

    const colors = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ec4899', '#fcd34d'];

    function createParticle() {
        return {
            x: canvas.width / 2 + (Math.random() - 0.5) * 350,
            y: canvas.height * 0.45,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 1.2) * 15,
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
            p.vx *= 0.98;
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

        particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

        if (particles.length > 0) {
            animationId = requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    window.fireConfetti = function() {
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
 * 16. Dynamic Academic Year Setup
 * ------------------------------------------------------------------------------
 */
function initDynamicAcademicYear() {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Karunya Institute of Technology and Sciences. All rights reserved. Academic Micro-Project.`;
    }
}
