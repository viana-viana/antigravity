export function initUI() {
    addMessage("Welcome to RuneScape Clone.", "system");

    // XP Tracker
    const xpDiv = document.createElement('div');
    xpDiv.id = 'xp-tracker';
    xpDiv.innerHTML = `
        <div>Woodcutting: <span id="xp-wc">1</span></div>
        <div>Mining: <span id="xp-mine">1</span></div>
    `;
    document.getElementById('ui-container').appendChild(xpDiv);

    // Customization Button
    const custBtn = document.createElement('button');
    custBtn.textContent = "Customize Character";
    custBtn.style.position = "absolute";
    custBtn.style.top = "10px";
    custBtn.style.right = "10px";
    custBtn.style.pointerEvents = "auto";
    custBtn.onclick = () => toggleCustomization();
    document.getElementById('ui-container').appendChild(custBtn);
}

export function updateXPUI(skills) {
    const wcEl = document.getElementById('xp-wc');
    const mineEl = document.getElementById('xp-mine');
    if (wcEl) wcEl.textContent = skills.woodcutting.level;
    if (mineEl) mineEl.textContent = skills.mining.level;
}

function toggleCustomization() {
    const color = prompt("Enter shirt color (hex, e.g. #ff0000):", "#ff0000");
    if (color) {
        window.dispatchEvent(new CustomEvent('changeColor', { detail: { color } }));
    }
}

export function addMessage(text, type = "normal") {
    const chatbox = document.getElementById('chatbox');
    if (!chatbox) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

export function addLog() {
    addItem("Log", "#5c4033");
}

export function addOre() {
    addItem("Ore", "#887766");
}

function addItem(name, color) {
    const inventory = document.getElementById('inventory');
    if (!inventory) return;
    const slots = inventory.getElementsByClassName('inv-slot');

    for (let slot of slots) {
        if (!slot.hasChildNodes()) {
            const item = document.createElement('div');
            item.className = 'inv-item';
            item.textContent = name;
            item.style.backgroundColor = color;
            item.style.borderRadius = "50%";
            item.style.width = "30px";
            item.style.height = "30px";
            item.style.margin = "auto";
            slot.appendChild(item);
            return;
        }
    }
    addMessage("Inventory is full!", "system");
}
