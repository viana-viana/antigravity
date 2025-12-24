// State
let userLevels = { ...INITIAL_USER_LEVELS };
let userPreferences = {
    accountType: 'standard', // 'standard', 'ironman'
    trainingPreference: 'active' // 'afk', 'active', 'profit'
};

// Dashboard State
let activeSkill = null;
let sessionStartXp = 0;
let sessionStartTime = null;

// DOM Elements
const skillsGrid = document.getElementById('skills-grid');
const skillModal = document.getElementById('skill-modal');
const settingsModal = document.getElementById('settings-modal');
const levelEditorModal = document.getElementById('level-editor-modal');

const settingsBtn = document.getElementById('settings-btn');
const openLevelEditorBtn = document.getElementById('open-level-editor-btn');
const saveLevelsBtn = document.getElementById('save-levels-btn');

const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

// Initialization
function init() {
    loadData();
    renderSkills();
    setupEventListeners();
    setupNavigation();

    // Default to Skills view or last active
    switchView('skills-view');

    // Start session timer if active
    if (activeSkill) {
        startSessionTimer();
    }

    updateHeaderTotal();
}

function loadData() {
    const savedLevels = localStorage.getItem('rs3_user_levels');
    if (savedLevels) {
        userLevels = JSON.parse(savedLevels);
    }

    // Load Dashboard State
    const savedActiveSkill = localStorage.getItem('rs3_active_skill');
    if (savedActiveSkill) {
        activeSkill = savedActiveSkill;
        sessionStartXp = parseInt(localStorage.getItem('rs3_session_start_xp') || 0);
        sessionStartTime = parseInt(localStorage.getItem('rs3_session_start_time') || Date.now());
    }
}

function saveData() {
    localStorage.setItem('rs3_user_levels', JSON.stringify(userLevels));
}

// Navigation
function setupNavigation() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            switchView(targetId);
        });
    });
}

function switchView(viewId) {
    // Update Buttons
    navBtns.forEach(btn => {
        if (btn.dataset.target === viewId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Views
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.add('active');
            view.classList.remove('hidden');
        } else {
            view.classList.remove('active');
            view.classList.add('hidden');
        }
    });

    // Refresh interaction specific views
    if (viewId === 'dashboard-view') renderDashboard();
    if (viewId === 'quests-view') renderQuests();
}

// Rendering Skills
function renderSkills() {
    skillsGrid.innerHTML = '';
    SKILLS.forEach(skill => {
        const level = userLevels[skill] || 1;
        // Simplified max check logic
        const maxLevel = (skill === 'Invention' || skill === 'Slayer' || skill === 'Farming' || skill === 'Herblore' || skill === 'Archaeology' || skill === 'Necromancy' || skill === 'Dungeoneering') ? 120 : 99;
        const isMaxed = level >= maxLevel;

        const skillCard = document.createElement('div');
        skillCard.className = `skill-item ${isMaxed ? 'maxed' : ''}`;
        skillCard.innerHTML = `
            <div class="skill-icon icon-${skill}"></div>
            <span class="skill-name">${skill}</span>
            <span class="skill-level-badge">${level}</span>
        `;
        skillCard.addEventListener('click', () => openSkillModal(skill));
        skillsGrid.appendChild(skillCard);
    });
}

function updateHeaderTotal() {
    const total = Object.values(userLevels).reduce((a, b) => a + b, 0);
    document.getElementById('total-level').textContent = `Total: ${total}`;
}

// Modal Logic
function openSkillModal(skill) {
    const currentLevel = userLevels[skill] || 1;

    // Populate Modal
    document.getElementById('modal-skill-name').textContent = skill;
    document.getElementById('modal-skill-icon').className = `skill-icon-large icon-${skill}`;
    document.getElementById('modal-current-level').textContent = currentLevel;

    const currentXp = getXpForLevel(currentLevel);
    document.getElementById('modal-current-xp').textContent = currentXp.toLocaleString();

    const maxLevel = (skill === 'Invention' || skill === 'Slayer' || skill === 'Farming' || skill === 'Herblore' || skill === 'Archaeology' || skill === 'Necromancy' || skill === 'Dungeoneering') ? 120 : 99;
    const nextLevel = Math.min(currentLevel + 1, maxLevel);
    const nextXp = getXpForLevel(nextLevel);

    if (currentLevel >= maxLevel) {
        document.getElementById('modal-xp-diff').textContent = 'Maxed';
    } else {
        document.getElementById('modal-xp-diff').textContent = (nextXp - currentXp).toLocaleString();
    }

    // Generate Walkthrough
    generateWalkthroughForSkill(skill, currentLevel);

    // Add "Set as Active" button logic
    // Clear previous dynamic buttons to avoid duplicates
    const titleGroup = document.querySelector('.modal-title-group');
    const existingBtn = document.getElementById('set-active-skill-btn');
    if (existingBtn) existingBtn.remove();

    const activeBtn = document.createElement('button');
    activeBtn.id = 'set-active-skill-btn';
    activeBtn.className = 'btn primary small';
    activeBtn.style.marginLeft = 'auto'; // Push to right

    activeBtn.textContent = (activeSkill === skill) ? 'Currently Training' : 'Train This Skill';
    activeBtn.onclick = (e) => {
        e.stopPropagation();
        setActiveSkill(skill);
        activeBtn.textContent = 'Currently Training';
    };

    if (titleGroup) titleGroup.appendChild(activeBtn);

    openModal(skillModal);
}

function setActiveSkill(skill) {
    activeSkill = skill;
    sessionStartXp = getXpForLevel(userLevels[skill] || 1);
    sessionStartTime = Date.now();

    localStorage.setItem('rs3_active_skill', activeSkill);
    localStorage.setItem('rs3_session_start_xp', sessionStartXp);
    localStorage.setItem('rs3_session_start_time', sessionStartTime);

    // Add to activity log (mock)
    const log = document.getElementById('activity-log');
    if (log) {
        const emptyMsg = log.querySelector('.empty-log');
        if (emptyMsg) emptyMsg.remove();

        const li = document.createElement('li');
        li.innerHTML = `<span>Started training ${skill}</span><span class="timestamp">Just now</span>`;
        log.prepend(li);
    }

    // Force refresh dashboard if visible
    if (document.getElementById('dashboard-view').classList.contains('active')) {
        renderDashboard();
    }
}

// Walkthrough Logic
function generateWalkthroughForSkill(skill, currentLevel) {
    const container = document.getElementById('modal-walkthrough-steps'); // Updated ID to match HTML
    if (!container) return;
    container.innerHTML = ''; // Clear previous

    const methods = TRAINING_METHODS[skill];

    if (!methods) {
        container.innerHTML = '<p>No specific guide available yet.</p>';
        return;
    }

    // Filter methods relevant to current level and higher
    // We want to show the NEXT few steps, not just the current one
    const relevantMethods = methods.filter(m => m.maxLevel >= currentLevel).sort((a, b) => a.minLevel - b.minLevel);

    if (relevantMethods.length === 0) {
        container.innerHTML = '<p>You have reached the end of the guide for this skill!</p>';
        return;
    }

    renderWalkthroughSteps(relevantMethods, container);
}

function renderWalkthroughSteps(steps, container) {
    steps.forEach(step => {
        const card = document.createElement('div');
        card.className = 'step-card';

        // Generate description HTML
        // Note: step.description now contains rich HTML from data.js

        card.innerHTML = `
            <h4>Levels ${step.minLevel} - ${step.maxLevel}: ${step.method}</h4>
            <div class="step-meta">
                <span class="xp-rate">${step.xpRate.toLocaleString()} XP/hr</span>
                <span class="method-type">${step.type.toUpperCase()}</span>
            </div>
            <div class="step-description">
                ${step.description}
            </div>
        `;
        container.appendChild(card);
    });
}

// Dashboard Logic
function renderDashboard() {
    const display = document.getElementById('active-skill-display');
    if (!display) return;

    if (!activeSkill) {
        display.innerHTML = '<div class="placeholder-text">Select a skill from the Skills tab to start training</div>';
        return;
    }

    const level = userLevels[activeSkill] || 1;
    const currentXp = getXpForLevel(level); // In a real app we'd track exact XP, here we approximate from level
    const nextLevel = level + 1;
    const nextLevelXp = getXpForLevel(nextLevel);
    const progress = ((currentXp - getXpForLevel(level)) / (nextLevelXp - getXpForLevel(level))) * 100; // Rough progress

    display.innerHTML = `
        <div class="active-skill-content">
            <div class="skill-icon icon-${activeSkill}" style="width: 80px; height: 80px;"></div>
            <div class="active-skill-info" style="flex: 1;">
                <h2>${activeSkill}</h2>
                <div class="stat-row">
                    <span>Level</span>
                    <span class="value">${level}</span>
                </div>
                <div class="stat-row">
                    <span>Next Level</span>
                    <span class="value">${(nextLevelXp - currentXp).toLocaleString()} XP</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${Math.max(5, progress)}%"></div>
                </div>
            </div>
        </div>
    `;

    // Update Session Stats (Mock)
    const timeEl = document.getElementById('session-time');
    if (timeEl) timeEl.textContent = getTimeElapsed();
}

function getTimeElapsed() {
    if (!sessionStartTime) return '00:00:00';
    const diff = Date.now() - sessionStartTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

function startSessionTimer() {
    setInterval(() => {
        if (document.getElementById('dashboard-view').classList.contains('active')) {
            const timeEl = document.getElementById('session-time');
            if (timeEl) timeEl.textContent = getTimeElapsed();
        }
    }, 60000); // Update every minute
}

// Quest Logic
function renderQuests() {
    const list = document.getElementById('quest-list');
    if (!list) return;
    list.innerHTML = '';

    QUEST_DATA.forEach(quest => {
        const status = checkQuestRequirements(quest);

        const card = document.createElement('div');
        card.className = `quest-card status-${status.canComplete ? 'available' : 'locked'}`;

        let reqsHtml = '';
        if (status.missing.length > 0) {
            reqsHtml = `<div class="req-list"><strong>Missing:</strong><br>${status.missing.map(m => `<span class="req-missing">• ${m}</span>`).join('<br>')}</div>`;
        } else {
            reqsHtml = `<div class="req-list"><span class="req-met">✓ All requirements met</span></div>`;
        }

        card.innerHTML = `
            <h4>${quest.name}</h4>
            <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 10px;">${quest.description}</p>
            ${reqsHtml}
            <div class="quest-status-icon">${status.canComplete ? '🟢' : '🔴'}</div>
            <div style="margin-top: 10px;">
                <a href="https://runescape.wiki/w/${quest.wiki}" target="_blank" class="wiki-link">Wiki Guide</a>
            </div>
        `;
        list.appendChild(card);
    });
}

function checkQuestRequirements(quest) {
    let missing = [];

    // Check Levels
    for (const [skill, reqLevel] of Object.entries(quest.requirements.levels)) {
        if ((userLevels[skill] || 1) < reqLevel) {
            missing.push(`${skill} ${reqLevel} (Have ${userLevels[skill] || 1})`);
        }
    }

    return {
        canComplete: missing.length === 0,
        missing: missing
    };
}

// Helper: Open/Close Modals
function openModal(modalEl) {
    if (modalEl) modalEl.classList.remove('hidden');
}

function closeModal(modalEl) {
    if (modalEl) modalEl.classList.add('hidden');
}

// Event Listeners
function setupEventListeners() {
    // 1. Close Buttons (Class based)
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalEl = e.target.closest('.modal');
            closeModal(modalEl);
        });
    });

    // 2. Click Outside Modal
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl || e.target.classList.contains('modal-backdrop')) {
                closeModal(modalEl);
            }
        });
    });

    // 3. Settings Button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Close other modals if open? No need, z-index handles it, or just open.
            openModal(settingsModal);
        });
    }

    // 4. Open Level Editor
    if (openLevelEditorBtn) {
        openLevelEditorBtn.addEventListener('click', () => {
            closeModal(settingsModal); // Close settings first
            openLevelEditor();
        });
    }

    // 5. Save Levels
    if (saveLevelsBtn) {
        saveLevelsBtn.addEventListener('click', saveLevels);
    }
}

function openLevelEditor() {
    const grid = document.getElementById('level-inputs-grid');
    if (!grid) return;
    grid.innerHTML = '';
    SKILLS.forEach(skill => {
        const level = userLevels[skill] || 1;
        const div = document.createElement('div');
        div.innerHTML = `
            <label>${skill}</label>
            <input type="number" min="1" max="99" value="${level}" data-skill="${skill}">
        `;
        grid.appendChild(div);
    });
    openModal(levelEditorModal);
}

function saveLevels() {
    const inputs = document.querySelectorAll('#level-inputs-grid input');
    inputs.forEach(input => {
        const skill = input.dataset.skill;
        let val = parseInt(input.value);
        if (val < 1) val = 1;
        if (val > 120) val = 120; // Allow 120 for virtual max
        userLevels[skill] = val;
    });
    saveData();
    renderSkills();
    updateHeaderTotal();
    closeModal(levelEditorModal);
}

// Run
init();
