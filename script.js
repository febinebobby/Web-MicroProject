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

    // --- 4. Interactive Showcase & Dashboard Workspace ---
    initDashboardWorkspace();
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

    // Retrieve saved theme preference; default strictly to 'light' mode
    const savedTheme = localStorage.getItem('karunya_theme');

    if (savedTheme === 'dark') {
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

    // Only run scrollspy if there are in-page hash links matching page sections
    const hasHashLinks = Array.from(navLinks).some(l => {
        const h = l.getAttribute('href');
        return h && h.startsWith('#') && h.length > 1;
    });
    if (!hasHashLinks || !sections.length) return;

    function highlightNav(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                if (href === `#${targetId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
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
 * 5B. Blank-First Interactive Dashboard Workspace (dashboard.html)
 * ------------------------------------------------------------------------------
 * Starts completely blank; computes avatar initials, SGPA, academic standing,
 * subject cards, progress fills, and AI insights only as data is entered or
 * when the user clicks "Load Sample Data".
 */
function initDashboardWorkspace() {
    const entryPanel = document.getElementById('dash-entry-panel');
    if (!entryPanel) return;

    const nameInput = document.getElementById('dash-input-name');
    const regInput = document.getElementById('dash-input-reg');
    const deptInput = document.getElementById('dash-input-dept');
    const attInput = document.getElementById('dash-input-attendance');
    const coursesContainer = document.getElementById('dash-course-inputs');
    const addCourseBtn = document.getElementById('dash-add-course-btn');
    const loadSampleBtn = document.getElementById('dash-load-sample-btn');
    const resetBtn = document.getElementById('dash-reset-btn');

    const statusPill = document.getElementById('dash-status-pill');
    const avatarEl = document.getElementById('dash-avatar');
    const displayNameEl = document.getElementById('dash-display-name');
    const displayMetaEl = document.getElementById('dash-display-meta');
    const kpiSgpaEl = document.getElementById('dash-kpi-sgpa');
    const kpiStandingEl = document.getElementById('dash-kpi-standing');
    const kpiAttEl = document.getElementById('dash-kpi-attendance');
    const subjectGridEl = document.getElementById('dash-subject-grid');
    const insightTextEl = document.getElementById('dash-insight-text');
    const simSlider = document.getElementById('simMarksInput');

    const sampleCourses = [
        { name: 'Machine Learning & AI', credits: 4, score: 93 },
        { name: 'Database Management', credits: 4, score: 86 },
        { name: 'Computer Networks', credits: 3, score: 82 },
        { name: 'Design & Analysis of Algorithms', credits: 4, score: 76 }
    ];

    function createCourseRow(name = '', credits = 4, score = '') {
        const row = document.createElement('div');
        row.className = 'dash-course-row';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'dash-course-name';
        titleInput.placeholder = 'Course Name (e.g. Data Structures)';
        titleInput.value = name;

        const creditSelect = document.createElement('select');
        creditSelect.className = 'dash-course-credits';
        [1, 2, 3, 4, 5].forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = `${c}.0 Credit${c > 1 ? 's' : ''}`;
            if (c === credits) opt.selected = true;
            creditSelect.appendChild(opt);
        });

        const scoreInput = document.createElement('input');
        scoreInput.type = 'number';
        scoreInput.className = 'dash-course-score';
        scoreInput.min = '0';
        scoreInput.max = '100';
        scoreInput.placeholder = 'Marks (0-100)';
        scoreInput.value = score !== '' && score !== null ? score : '';

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn-delete-row';
        delBtn.title = 'Remove course';
        delBtn.setAttribute('aria-label', 'Remove course');
        delBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';

        [titleInput, scoreInput].forEach(el => el.addEventListener('input', renderDashboard));
        creditSelect.addEventListener('change', renderDashboard);
        delBtn.addEventListener('click', () => {
            if (coursesContainer.querySelectorAll('.dash-course-row').length <= 1) {
                titleInput.value = '';
                scoreInput.value = '';
                renderDashboard();
                return;
            }
            row.remove();
            renderDashboard();
        });

        row.append(titleInput, creditSelect, scoreInput, delBtn);
        return row;
    }

    function getFillClass(score) {
        if (score >= 90) return 'fill-emerald';
        if (score >= 80) return 'fill-blue';
        if (score >= 65) return 'fill-purple';
        return 'fill-amber';
    }

    function renderDashboard() {
        const studentName = (nameInput?.value || '').trim();
        const regNo = (regInput?.value || '').trim();
        const dept = (deptInput?.value || '').trim();
        const rawAtt = (attInput?.value || '').trim();
        const hasAtt = rawAtt !== '' && !isNaN(parseFloat(rawAtt));
        const attVal = hasAtt ? Math.min(Math.max(parseFloat(rawAtt), 0), 100) : null;

        // Initials & identity
        if (studentName) {
            const parts = studentName.split(/\s+/).filter(Boolean);
            const initials = parts.length >= 2
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : studentName.slice(0, 2).toUpperCase();
            if (avatarEl) avatarEl.textContent = initials;
            if (displayNameEl) displayNameEl.textContent = studentName;
        } else {
            if (avatarEl) avatarEl.textContent = '--';
            if (displayNameEl) displayNameEl.textContent = 'No Student Data Entered';
        }

        if (regNo || dept) {
            if (displayMetaEl) {
                displayMetaEl.innerHTML = '';
                if (regNo) {
                    const regLabel = document.createTextNode('Register No: ');
                    const strong = document.createElement('strong');
                    strong.textContent = regNo;
                    displayMetaEl.append(regLabel, strong);
                }
                if (regNo && dept) {
                    displayMetaEl.appendChild(document.createTextNode(' \u2022 '));
                }
                if (dept) {
                    displayMetaEl.appendChild(document.createTextNode(dept));
                }
            }
        } else if (displayMetaEl) {
            displayMetaEl.textContent = 'Enter student details above or click "Load Sample Data" for a live demo';
        }

        // Attendance KPI
        if (kpiAttEl) {
            kpiAttEl.textContent = hasAtt ? `${attVal.toFixed(1)}%` : '--%';
        }

        // Collect entered courses
        const courseRows = coursesContainer.querySelectorAll('.dash-course-row');
        const enteredCourses = [];
        let totalCredits = 0;
        let totalWeightedPoints = 0;
        let arrears = 0;

        courseRows.forEach(row => {
            const cName = row.querySelector('.dash-course-name').value.trim();
            const cCredits = parseFloat(row.querySelector('.dash-course-credits').value) || 0;
            const scoreField = row.querySelector('.dash-course-score');
            const rawScore = scoreField.value.trim();
            if (rawScore === '' || isNaN(parseFloat(rawScore))) return;

            let score = parseFloat(rawScore);
            if (score > 100) { score = 100; scoreField.value = 100; }
            if (score < 0) { score = 0; scoreField.value = 0; }

            const grade = getKarunyaGrade(score);
            totalCredits += cCredits;
            totalWeightedPoints += cCredits * grade.point;
            if (grade.letter === 'RA') arrears++;

            enteredCourses.push({
                name: cName || 'Untitled Course',
                credits: cCredits,
                score,
                grade
            });
        });

        // Compute SGPA & Standing
        if (enteredCourses.length > 0 && totalCredits > 0) {
            const sgpa = totalWeightedPoints / totalCredits;
            const standing = arrears > 0 ? 'Remedial'
                : sgpa >= 8.5 ? 'Distinction'
                : sgpa >= 7.5 ? 'Honors'
                : sgpa >= 6.5 ? 'First Class'
                : 'Passed';

            if (kpiSgpaEl) kpiSgpaEl.textContent = sgpa.toFixed(2);
            if (kpiStandingEl) kpiStandingEl.textContent = standing;
            if (statusPill) statusPill.textContent = 'Live Calculated';

            // Render subject mini-cards
            if (subjectGridEl) {
                subjectGridEl.innerHTML = '';
                enteredCourses.forEach((course, idx) => {
                    const card = document.createElement('div');
                    card.className = `subject-mini-card${idx === 0 ? ' selected-card' : ''}`;
                    card.tabIndex = 0;
                    card.setAttribute('role', 'button');
                    card.setAttribute('aria-label', `Inspect ${course.name}`);
                    card.style.cursor = 'pointer';

                    const meta = document.createElement('div');
                    meta.className = 'subject-meta';
                    const h5 = document.createElement('h5');
                    h5.textContent = course.name;
                    const pill = document.createElement('span');
                    pill.className = `grade-pill ${course.grade.colorClass}`;
                    pill.textContent = `${course.grade.letter} Grade`;
                    meta.append(h5, pill);

                    const scores = document.createElement('div');
                    scores.className = 'subject-scores';
                    const s1 = document.createElement('span');
                    s1.innerHTML = `Score: <strong>${course.score} / 100</strong>`;
                    const s2 = document.createElement('span');
                    s2.innerHTML = `Credits: <strong>${course.credits.toFixed(1)}</strong>`;
                    scores.append(s1, s2);

                    const track = document.createElement('div');
                    track.className = 'progress-track';
                    const fill = document.createElement('div');
                    fill.className = `progress-fill ${getFillClass(course.score)}`;
                    fill.style.width = `${course.score}%`;
                    track.appendChild(fill);

                    card.append(meta, scores, track);

                    const showCardInsight = () => {
                        subjectGridEl.querySelectorAll('.subject-mini-card').forEach(c => c.classList.remove('selected-card'));
                        card.classList.add('selected-card');
                        if (insightTextEl) {
                            insightTextEl.innerHTML = '';
                            const strong = document.createElement('strong');
                            strong.textContent = `${course.name} (${course.score}/100 \u2022 ${course.grade.letter}): `;
                            insightTextEl.append(strong, document.createTextNode(`${course.grade.status}. ${course.grade.remark}`));
                        }
                    };
                    card.addEventListener('click', showCardInsight);
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            showCardInsight();
                        }
                    });

                    subjectGridEl.appendChild(card);
                });
            }

            // Overall AI Insight
            if (insightTextEl) {
                const topCourse = [...enteredCourses].sort((a, b) => b.score - a.score)[0];
                let attNote = '';
                if (hasAtt && attVal < 75) {
                    attNote = ' Warning: Attendance is below the 75% university eligibility threshold.';
                } else if (hasAtt && attVal >= 90) {
                    attNote = ` Attendance (${attVal.toFixed(1)}%) qualifies cleanly for all exams.`;
                }
                insightTextEl.innerHTML = '';
                const strong = document.createElement('strong');
                strong.textContent = 'Academic Performance Insight: ';
                insightTextEl.append(
                    strong,
                    document.createTextNode(`Computed SGPA is ${sgpa.toFixed(2)} (${standing}) across ${totalCredits.toFixed(1)} credits. Highest performance in ${topCourse.name} (${topCourse.score}/100).${attNote}`)
                );
            }
        } else {
            if (kpiSgpaEl) kpiSgpaEl.textContent = '--';
            if (kpiStandingEl) kpiStandingEl.textContent = 'Awaiting Data';
            if (statusPill) statusPill.textContent = (studentName || regNo || dept || hasAtt) ? 'Profile Entered' : 'Awaiting Input';

            if (subjectGridEl) {
                subjectGridEl.innerHTML = '<div class="dash-empty-state">No courses entered yet. Fill in a course and score above, or click <strong>\u26a1 Load Sample Data</strong> to preview subject grade cards.</div>';
            }
            if (insightTextEl) {
                insightTextEl.innerHTML = '<strong>Academic Performance Insight:</strong> Enter student courses and attendance above to generate real-time CBCS standing and personalized advisor recommendations.';
            }
        }
    }

    function clearDashboard(showNotice = false) {
        if (nameInput) nameInput.value = '';
        if (regInput) regInput.value = '';
        if (deptInput) deptInput.value = '';
        if (attInput) attInput.value = '';
        coursesContainer.innerHTML = '';
        coursesContainer.appendChild(createCourseRow('', 4, ''));
        if (simSlider) simSlider.dispatchEvent(new Event('reset-pristine'));
        renderDashboard();
        if (showNotice) showToast('Dashboard cleared', 'info');
    }

    function loadSampleDashboard() {
        if (nameInput) nameInput.value = 'Kavitha R.';
        if (regInput) regInput.value = 'URK22CS1042';
        if (deptInput) deptInput.value = 'B.Tech Computer Science & Engineering';
        if (attInput) attInput.value = '94.5';
        coursesContainer.innerHTML = '';
        sampleCourses.forEach(c => coursesContainer.appendChild(createCourseRow(c.name, c.credits, c.score)));
        if (simSlider) {
            simSlider.value = 88;
            simSlider.dispatchEvent(new Event('input'));
        }
        renderDashboard();
        showToast('Sample student analytics data loaded!', 'success');
    }

    [nameInput, regInput, deptInput, attInput].filter(Boolean).forEach(input => {
        input.addEventListener('input', renderDashboard);
    });

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            coursesContainer.appendChild(createCourseRow('', 4, ''));
        });
    }
    if (loadSampleBtn) loadSampleBtn.addEventListener('click', loadSampleDashboard);
    if (resetBtn) resetBtn.addEventListener('click', () => clearDashboard(true));

    // Start completely blank
    clearDashboard(false);
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

    function resetSimulator() {
        slider.value = 0;
        slider.setAttribute('data-pristine', 'true');
        scoreVal.textContent = '--';
        gradePill.textContent = '--';
        gradePill.className = 'sim-grade-pill grade-neutral';
        gradePoint.textContent = '--';
        statusPill.textContent = 'Awaiting Input';
        remark.textContent = 'Move the slider or pick a score to calculate grade';
        presetButtons.forEach(btn => btn.classList.remove('active'));
        hasCelebrated = false;
    }

    function updateSimulator(score, triggerConfetti = true) {
        slider.removeAttribute('data-pristine');
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

    slider.addEventListener('reset-pristine', resetSimulator);

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const score = parseInt(btn.getAttribute('data-score'), 10);
            slider.value = score;
            updateSimulator(score, true);
        });
    });

    if (slider.getAttribute('data-pristine') === 'true') {
        resetSimulator();
    } else {
        updateSimulator(parseInt(slider.value, 10), false);
    }
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

    function createRow(name = '', credits = 4, marks = '') {
        rowCounter++;
        const rowId = `calc-row-${rowCounter}`;
        const hasMarks = marks !== '' && marks !== null && !isNaN(parseFloat(marks));
        const gradeInfo = hasMarks ? getKarunyaGrade(parseFloat(marks)) : null;

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
                    <input type="number" class="calc-input-marks" min="0" max="100" value="${hasMarks ? marks : ''}" placeholder="0-100">
                    <span class="calc-mark-suffix">/ 100</span>
                </div>
            </td>
            <td>
                <span class="grade-badge-sm ${gradeInfo ? gradeInfo.colorClass : 'grade-neutral'} row-grade-badge">${gradeInfo ? gradeInfo.letter : '--'}</span>
            </td>
            <td>
                <strong class="row-gp-val">${gradeInfo ? gradeInfo.point.toFixed(1) : '--'}</strong>
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
            const raw = marksInput.value.trim();
            if (raw === '') {
                badge.textContent = '--';
                badge.className = 'grade-badge-sm grade-neutral row-grade-badge';
                gpVal.textContent = '--';
                calculateTotalSGPA();
                return;
            }

            let val = parseFloat(raw);
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
        let enteredCount = 0;

        rows.forEach(row => {
            const rawMarks = row.querySelector('.calc-input-marks').value.trim();
            if (rawMarks === '') return;

            const marks = parseFloat(rawMarks);
            if (isNaN(marks)) return;

            const credits = parseFloat(row.querySelector('.calc-select-credits').value) || 0;
            const res = getKarunyaGrade(marks);
            enteredCount++;
            totalCredits += credits;
            totalQualityPoints += (credits * res.point);

            if (res.letter === 'RA') {
                arrearsCount++;
            }
        });

        if (enteredCount === 0) {
            if (resultSgpa) resultSgpa.textContent = '0.00';
            if (resultCredits) resultCredits.textContent = '0.0';
            if (resultPercentage) resultPercentage.textContent = '0.0%';
            if (resultStanding) {
                resultStanding.textContent = 'Awaiting Marks';
                resultStanding.className = 'standing-pill';
            }
            if (resultArrears) {
                resultArrears.textContent = 'Pending';
                resultArrears.className = 'metric-value-sm';
            }
            if (resultStatusText) {
                resultStatusText.textContent = 'Enter marks to compute';
            }
            return;
        }

        let sgpa = totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0;
        let percentage = sgpa > 0 ? Math.max((sgpa - 0.5) * 10, 0) : 0;

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
            rowsContainer.appendChild(createRow('', 4, ''));
            calculateTotalSGPA();
            showToast('Blank course row added — enter marks to calculate', 'info');
        });
    }

    if (fillSem1Btn) {
        fillSem1Btn.addEventListener('click', () => {
            populatePreset(sem1Preset);
            showToast('Sample Semester 1 data loaded!', 'success');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            rowsContainer.innerHTML = '';
            rowsContainer.appendChild(createRow('', 4, ''));
            calculateTotalSGPA();
            showToast('Calculator cleared', 'info');
        });
    }

    // Initialize blank (no dummy data until user enters marks or clicks Load Sample Data)
    rowsContainer.innerHTML = '';
    rowsContainer.appendChild(createRow('', 4, ''));
    calculateTotalSGPA();
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
            return;
        }

        const mark = parseFloat(query);
        if (isNaN(mark) || mark < 0 || mark > 100) {
            tableRows.forEach(row => row.classList.remove('row-active'));
            if (resultBadge) resultBadge.innerHTML = '<span class="text-danger">Please enter a valid mark (0–100)</span>';
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
    const form = document.getElementById('modal-marks-form') || document.getElementById('portal-marks-form');

    const cia1Input = document.getElementById('mark-cia1');
    const cia2Input = document.getElementById('mark-cia2');
    const quizInput = document.getElementById('mark-quiz');
    const endsemInput = document.getElementById('mark-endsem');

    const scorePreview = document.getElementById('modal-score-preview');
    const gradePreview = document.getElementById('modal-grade-preview');
    const standingPreview = document.getElementById('modal-standing-preview');
    const recentTbody = document.getElementById('portal-recent-tbody');
    const exportCsvBtn = document.getElementById('portal-export-csv-btn');
    const sampleBtn = document.getElementById('portal-sample-btn');
    const clearBtn = document.getElementById('portal-clear-btn');

    function hasAnyMarkEntered() {
        return [cia1Input, cia2Input, quizInput, endsemInput]
            .filter(Boolean)
            .some(el => el.value.trim() !== '');
    }

    function getPortalScores() {
        const c1 = Math.min(Math.max(parseFloat(cia1Input?.value) || 0, 0), 25);
        const c2 = Math.min(Math.max(parseFloat(cia2Input?.value) || 0, 0), 25);
        const qz = Math.min(Math.max(parseFloat(quizInput?.value) || 0, 0), 20);
        const es = Math.min(Math.max(parseFloat(endsemInput?.value) || 0, 0), 30);
        const total = Math.round(c1 + c2 + qz + es);
        return { total, grade: getKarunyaGrade(total) };
    }

    function updateModalPreview() {
        if (!hasAnyMarkEntered()) {
            if (scorePreview) scorePreview.textContent = '-- / 100';
            if (gradePreview) {
                gradePreview.textContent = '--';
                gradePreview.className = 'grade-badge-sm grade-neutral';
            }
            if (standingPreview) {
                standingPreview.textContent = 'Awaiting Marks';
                standingPreview.className = 'standing-pill';
            }
            return;
        }

        const { total, grade } = getPortalScores();

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

    function appendAuditRow(regNo, studentName, total, grade) {
        if (!recentTbody) return;
        const emptyRow = recentTbody.querySelector('.portal-empty-row');
        if (emptyRow) emptyRow.remove();

        const tr = document.createElement('tr');
        const shortStatus = total >= 90 ? 'Distinction'
            : total >= 80 ? 'Honors'
            : total >= 70 ? 'Very Good'
            : total >= 60 ? 'Good'
            : total >= 50 ? 'Passed'
            : 'Re-Appear';

        const tdReg = document.createElement('td');
        const strongReg = document.createElement('strong');
        strongReg.textContent = regNo;
        tdReg.appendChild(strongReg);

        const tdName = document.createElement('td');
        tdName.textContent = studentName;

        const tdScore = document.createElement('td');
        tdScore.textContent = `${total} / 100`;

        const tdGrade = document.createElement('td');
        const gradeBadge = document.createElement('span');
        gradeBadge.className = `grade-badge-sm ${grade.colorClass}`;
        gradeBadge.textContent = grade.letter;
        tdGrade.appendChild(gradeBadge);

        const tdStatus = document.createElement('td');
        const statusPill = document.createElement('span');
        statusPill.className = `standing-pill ${total < 50 ? 'standing-remedial' : ''}`;
        statusPill.textContent = shortStatus;
        tdStatus.appendChild(statusPill);

        tr.append(tdReg, tdName, tdScore, tdGrade, tdStatus);
        recentTbody.prepend(tr);
    }

    // Always wire inputs for live calculation (whether modal or standalone portal page)
    [cia1Input, cia2Input, quizInput, endsemInput].filter(Boolean).forEach(input => {
        input.addEventListener('input', updateModalPreview);
    });
    updateModalPreview();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const regNo = (document.getElementById('student-reg')?.value || '').trim();
            const studentName = (document.getElementById('student-name')?.value || '').trim();
            const course = document.getElementById('course-select')?.value || '';

            if (!regNo || !studentName || !course || !hasAnyMarkEntered()) {
                showToast('Please fill in student details, course, and marks before submitting.', 'warning');
                return;
            }

            const { total, grade } = getPortalScores();
            appendAuditRow(regNo, studentName, total, grade);

            if (modal && modal.classList.contains('is-open')) {
                closeModal();
            }
            showToast(`✓ Continuous assessment marks recorded for ${regNo} (${course})!`, 'success');

            if (total >= 90 && window.fireConfetti) {
                window.fireConfetti();
            }
        });
    }

    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            const regEl = document.getElementById('student-reg');
            const nameEl = document.getElementById('student-name');
            const courseEl = document.getElementById('course-select');
            if (regEl) regEl.value = 'URK22CS1042';
            if (nameEl) nameEl.value = 'Kavitha R.';
            if (courseEl) courseEl.value = 'Machine Learning & AI';
            if (cia1Input) cia1Input.value = 23;
            if (cia2Input) cia2Input.value = 22;
            if (quizInput) quizInput.value = 19;
            if (endsemInput) endsemInput.value = 28;
            updateModalPreview();

            // Also seed demo audit records if table is currently empty
            if (recentTbody && recentTbody.querySelector('.portal-empty-row')) {
                [
                    { reg: 'URK22CS1088', name: 'Sneha Miriam', total: 78 },
                    { reg: 'URK22CS1015', name: 'Aaron Philip', total: 86 },
                    { reg: 'URK22CS1042', name: 'Kavitha R.', total: 92 }
                ].forEach(s => appendAuditRow(s.reg, s.name, s.total, getKarunyaGrade(s.total)));
            }

            showToast('Sample student assessment data loaded!', 'success');
        });
    }

    if (clearBtn && form) {
        clearBtn.addEventListener('click', () => {
            form.reset();
            updateModalPreview();
            if (recentTbody) {
                recentTbody.innerHTML = '<tr class="portal-empty-row"><td colspan="5">No assessment records yet. Enter marks on the left or click &ldquo;Load Sample Data&rdquo; for a demo.</td></tr>';
            }
            showToast('Portal form and records cleared', 'info');
        });
    }

    // Real CSV Export for the Portal Audit Table
    if (exportCsvBtn && recentTbody) {
        exportCsvBtn.addEventListener('click', () => {
            const dataRows = Array.from(recentTbody.querySelectorAll('tr:not(.portal-empty-row)'));
            if (!dataRows.length) {
                showToast('No records to export yet. Submit an assessment or click Load Sample Data first.', 'warning');
                return;
            }

            const rows = [['Register No', 'Student Name', 'Score', 'Grade', 'Standing']];
            dataRows.forEach(tr => {
                const cells = Array.from(tr.querySelectorAll('td')).map(td => {
                    const text = td.textContent.trim().replace(/\s+/g, ' ');
                    return `"${text.replace(/"/g, '""')}"`;
                });
                if (cells.length) rows.push(cells);
            });

            const csvContent = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'karunya_grade_sheet.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast('✓ Grade Sheet exported as karunya_grade_sheet.csv!', 'success');
            if (window.fireConfetti) {
                window.fireConfetti();
            }
        });
    }

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

    const colors = ['#1e4d96', '#2563b8', '#10b981', '#c9a84c', '#0f2d5e', '#4a80c8', '#fcd34d'];

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
