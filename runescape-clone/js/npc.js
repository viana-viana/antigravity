import * as THREE from 'three';
import { addMessage } from './ui.js';

export function createNPCs(scene, world) {
    // Guide NPC
    const guide = createNPCMesh(0xffff00); // Yellow shirt
    guide.position.set(-5, 0, 0); // Inside castle area
    guide.userData = {
        type: 'npc',
        name: 'Guide',
        dialog: [
            "Welcome to RuneScape Clone!",
            "Click on trees to cut wood.",
            "Click on rocks to mine ore.",
            "Good luck!"
        ]
    };
    scene.add(guide);
    world.npcs.push(guide);

    // Goblin NPC (Placeholder)
    const goblin = createNPCMesh(0x00ff00, 0.7); // Green, smaller
    goblin.position.set(25, 0, 5); // Across the river
    goblin.userData = {
        type: 'npc',
        name: 'Goblin',
        dialog: ["Me smash!", "Go away human!"]
    };
    scene.add(goblin);
    world.npcs.push(goblin);
}

function createNPCMesh(color, scale = 1) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.5 * scale, 1 * scale, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1 * scale;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.4 * scale, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8 * scale;
    group.add(head);

    return group;
}

export function interactWithNPC(npc) {
    addMessage(`${npc.userData.name}: Hello there!`, "system");

    // Simple dialog loop
    let lineIndex = 0;
    const lines = npc.userData.dialog;

    function showNextLine() {
        if (lineIndex < lines.length) {
            addMessage(`${npc.userData.name}: ${lines[lineIndex]}`, "normal");
            lineIndex++;
            setTimeout(showNextLine, 1500);
        }
    }

    showNextLine();
}
