// --- UI MODULE ---
function addMessage(text, type = "normal") {
    const chatbox = document.getElementById('chatbox');
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function updateXPUI(skills) {
    document.getElementById('xp-wc').textContent = skills.woodcutting.level;
    document.getElementById('xp-mine').textContent = skills.mining.level;
}

function toggleCustomization() {
    const color = prompt("Enter shirt color (hex, e.g. #ff0000):", "#ff0000");
    if (color && game.player && game.player.torso) {
        game.player.torso.material.color.set(color);
    }
}

function addLog() { addItem("Log", "#5c4033"); }
function addOre() { addItem("Ore", "#554433"); }

function addItem(name, color) {
    const inventory = document.getElementById('inventory');
    const slots = inventory.getElementsByClassName('inv-slot');
    for (let slot of slots) {
        if (!slot.hasChildNodes()) {
            const item = document.createElement('div');
            item.className = 'inv-item';
            item.textContent = name;
            item.style.backgroundColor = color;
            item.style.borderRadius = "4px";
            item.style.width = "25px";
            item.style.height = "25px";
            item.style.margin = "auto";
            item.style.border = "1px solid rgba(0,0,0,0.5)";
            slot.appendChild(item);
            return;
        }
    }
    addMessage("Inventory is full!", "system");
}
