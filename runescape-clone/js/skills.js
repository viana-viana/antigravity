// --- SKILLS MODULE ---
const skills = {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 }
};

function addXP(skillName, amount) {
    if (!skills[skillName]) return;
    skills[skillName].xp += amount;
    const currentLevel = skills[skillName].level;
    const newLevel = Math.floor(Math.sqrt(skills[skillName].xp / 10)) + 1;
    if (newLevel > currentLevel) {
        skills[skillName].level = newLevel;
        addMessage(`Congratulations! You just advanced a ${skillName} level.`, "system");
        addMessage(`Your ${skillName} level is now ${newLevel}.`, "system");
    }
    updateXPUI(skills);
}
