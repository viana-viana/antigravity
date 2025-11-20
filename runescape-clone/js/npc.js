import * as THREE from 'three';
import { addMessage } from './ui.js';
import { createCharacterMesh } from './character_model.js';

export function createNPCs(scene, world) {
    // Guide NPC
    const guide = createCharacterMesh(0xffff00); // Yellow shirt
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

    // Goblin NPC (Placeholder)
    const goblin = createCharacterMesh(0x00ff00, 0.7); // Green, smaller
    goblin.position.set(25, 0, 5); // Across the river
    goblin.userData.type = 'npc';
    goblin.userData.name = 'Goblin';
    goblin.userData.dialog = ["Me smash!", "Go away human!"];
    scene.add(goblin);
    world.npcs.push(goblin);
}

// createNPCMesh is no longer needed as we use createCharacterMesh

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

export function updateNPC(npc, delta) {
    if (!npc.userData.animationTime) npc.userData.animationTime = 0;
    npc.userData.animationTime += delta;

    // Wandering Logic
    if (!npc.userData.targetPosition) {
        npc.userData.state = 'idle';

        // 1% chance per frame to start moving (approx every few seconds)
        if (Math.random() < 0.01) {
            const wanderRadius = 5;
            const offsetX = (Math.random() - 0.5) * wanderRadius * 2;
            const offsetZ = (Math.random() - 0.5) * wanderRadius * 2;

            // Keep within bounds (simple check)
            const targetX = npc.position.x + offsetX;
            const targetZ = npc.position.z + offsetZ;

            npc.userData.targetPosition = new THREE.Vector3(targetX, npc.position.y, targetZ);
        }
    } else {
        // Move to target
        const currentPos = npc.position;
        const target = npc.userData.targetPosition;
        const speed = 2; // Slower than player

        const direction = new THREE.Vector3().subVectors(target, currentPos);
        direction.y = 0;
        const distance = direction.length();

        if (distance > 0.1) {
            direction.normalize();
            const moveStep = direction.multiplyScalar(speed * delta);

            if (moveStep.length() > distance) {
                currentPos.x = target.x;
                currentPos.z = target.z;
                npc.userData.targetPosition = null;
                npc.userData.state = 'idle';
            } else {
                currentPos.add(moveStep);
                npc.userData.state = 'moving';
                npc.lookAt(target.x, currentPos.y, target.z);
            }
        } else {
            npc.userData.targetPosition = null;
            npc.userData.state = 'idle';
        }
    }

    animateNPC(npc);
}

function animateNPC(npc) {
    const parts = npc.userData;
    const time = npc.userData.animationTime;

    // Safety check if parts are missing
    if (!parts.torso) return;

    if (npc.userData.state === 'idle') {
        parts.torso.position.y = (0.8 / 2 + 0.8) + Math.sin(time * 2) * 0.02;
        parts.leftArm.rotation.x = THREE.MathUtils.lerp(parts.leftArm.rotation.x, 0, 0.1);
        parts.rightArm.rotation.x = THREE.MathUtils.lerp(parts.rightArm.rotation.x, 0, 0.1);
        parts.leftLeg.rotation.x = THREE.MathUtils.lerp(parts.leftLeg.rotation.x, 0, 0.1);
        parts.rightLeg.rotation.x = THREE.MathUtils.lerp(parts.rightLeg.rotation.x, 0, 0.1);
    } else if (npc.userData.state === 'moving') {
        const speed = 8;
        parts.leftArm.rotation.x = Math.sin(time * speed) * 0.5;
        parts.rightArm.rotation.x = Math.sin(time * speed + Math.PI) * 0.5;
        parts.leftLeg.rotation.x = Math.sin(time * speed + Math.PI) * 0.5;
        parts.rightLeg.rotation.x = Math.sin(time * speed) * 0.5;
    }
}
