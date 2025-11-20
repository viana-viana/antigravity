// --- NPC MODULE ---
function createNPCs(scene, world) {
    // Guide NPC
    const guide = createCharacterMesh(0xffff00, 1); // Yellow shirt
    guide.position.set(-5, 0, 0); // Inside castle area
    guide.userData.type = 'npc';
    guide.userData.name = 'Guide';
    guide.userData.dialog = [
        "Welcome to RuneScape Clone!",
        "Click on trees to cut wood.",
        "Click on rocks to mine ore.",
        "Good luck!"
    ];
    scene.add(guide);
    world.npcs.push(guide);

    // Goblin NPC
    const goblin = createCharacterMesh(0x00ff00, 0.7); // Green, smaller
    goblin.position.set(25, 0, 5); // Across the river
    goblin.userData.type = 'npc';
    goblin.userData.name = 'Goblin';
    goblin.userData.dialog = ["Me smash!", "Go away human!"];
    scene.add(goblin);
    world.npcs.push(goblin);
}

function updateNPC(npc, delta) {
    // Simple wandering logic
    if (!npc.userData.target) {
        if (Math.random() < 0.01) {
            const range = 5;
            npc.userData.target = new THREE.Vector3(
                npc.position.x + (Math.random() - 0.5) * range,
                0,
                npc.position.z + (Math.random() - 0.5) * range
            );
        }
        npc.userData.state = 'idle';
    } else {
        const dir = new THREE.Vector3().subVectors(npc.userData.target, npc.position);
        dir.y = 0;
        const dist = dir.length();
        if (dist < 0.1) {
            npc.userData.target = null;
            npc.userData.state = 'idle';
        } else {
            dir.normalize();
            npc.position.add(dir.multiplyScalar(2 * delta));
            npc.lookAt(npc.userData.target);
            npc.userData.state = 'moving';
        }
    }

    // Animation
    if (!npc.userData.animationTime) npc.userData.animationTime = 0;
    npc.userData.animationTime += delta;
    animateCharacter(npc, npc.userData.state || 'idle', npc.userData.animationTime);
}

function interactWithNPC(npc) {
    addMessage(`You talk to the ${npc.userData.name}.`, "action");
    const dialog = npc.userData.dialog;
    const line = dialog[Math.floor(Math.random() * dialog.length)];
    setTimeout(() => {
        addMessage(`${npc.userData.name}: "${line}"`, "system");
    }, 500);
}
