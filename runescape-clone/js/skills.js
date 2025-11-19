import { addMessage, updateXPUI } from './ui.js';

const skills = {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 }
};

export function addXP(skillName, amount) {
    if (!skills[skillName]) return;

    skills[skillName].xp += amount;

    // Simple leveling formula: Level = sqrt(XP) * 0.1 (just for demo)
    // Or standard RS formula approximation
    const currentLevel = skills[skillName].level;
    const newLevel = Math.floor(Math.sqrt(skills[skillName].xp / 10)) + 1;

    if (newLevel > currentLevel) {
        skills[skillName].level = newLevel;
        addMessage(`Congratulations! You just advanced a ${skillName} level.`, "system");
        addMessage(`Your ${skillName} level is now ${newLevel}.`, "system");
    }

    updateXPUI(skills);
}

export function getSkillLevel(skillName) {
    return skills[skillName] ? skills[skillName].level : 1;
}
