import * as THREE from 'three';
import { createCharacterMesh } from './character_model.js';

export function createPlayer(scene) {
    const player = {
        mesh: null,
        targetPosition: null,
        speed: 5,
        state: 'idle', // idle, moving, chopping
        animationTime: 0
    };

    // Use new hierarchical model
    player.mesh = createCharacterMesh(0xff0000); // Red shirt
    scene.add(player.mesh);

    return player;
}

export function updatePlayer(player, delta, camera) {
    // Animation Logic
    player.animationTime += delta;
    animatePlayer(player);

    if (!player.targetPosition) {
        player.state = 'idle';
        // Camera Follow (even when idle)
        updateCamera(player, camera);
        return;
    }

    const currentPos = player.mesh.position;
    const target = player.targetPosition;

    // Calculate direction
    const direction = new THREE.Vector3().subVectors(target, currentPos);
    direction.y = 0; // Keep movement on flat plane
    const distance = direction.length();

    if (distance > 0.1) {
        direction.normalize();
        const moveStep = direction.multiplyScalar(player.speed * delta);

        // Prevent overshooting
        if (moveStep.length() > distance) {
            currentPos.x = target.x;
            currentPos.z = target.z;
            player.targetPosition = null;
            player.state = 'idle';
        } else {
            currentPos.add(moveStep);
            player.state = 'moving';

            // Rotate to face direction
            player.mesh.lookAt(target.x, player.mesh.position.y, target.z);
        }
    } else {
        player.targetPosition = null;
        player.state = 'idle';
    }

    updateCamera(player, camera);
}

function updateCamera(player, camera) {
    const offset = new THREE.Vector3(10, 10, 10);
    camera.position.copy(player.mesh.position).add(offset);
    camera.lookAt(player.mesh.position);
}

function animatePlayer(player) {
    const parts = player.mesh.userData;
    const time = player.animationTime;

    if (player.state === 'idle') {
        // Breathing / Bobbing
        parts.torso.position.y = (0.8 / 2 + 0.8) + Math.sin(time * 2) * 0.02;

        // Reset limbs
        parts.leftArm.rotation.x = THREE.MathUtils.lerp(parts.leftArm.rotation.x, 0, 0.1);
        parts.rightArm.rotation.x = THREE.MathUtils.lerp(parts.rightArm.rotation.x, 0, 0.1);
        parts.leftLeg.rotation.x = THREE.MathUtils.lerp(parts.leftLeg.rotation.x, 0, 0.1);
        parts.rightLeg.rotation.x = THREE.MathUtils.lerp(parts.rightLeg.rotation.x, 0, 0.1);
    }
    else if (player.state === 'moving') {
        const speed = 12; // Slightly faster
        const amp = 0.8; // More exaggerated swing

        // Arm Swing
        parts.leftArm.rotation.x = Math.sin(time * speed) * amp;
        parts.rightArm.rotation.x = Math.sin(time * speed + Math.PI) * amp;

        // Leg Swing (Opposite to arms)
        parts.leftLeg.rotation.x = Math.sin(time * speed + Math.PI) * amp;
        parts.rightLeg.rotation.x = Math.sin(time * speed) * amp;
    }
    else if (player.state === 'chopping' || player.state === 'mining') {
        // Action animation
        const speed = 15;
        parts.rightArm.rotation.x = -Math.PI / 2 + Math.sin(time * speed) * 0.5;
        parts.torso.rotation.y = Math.sin(time * speed) * 0.2;
    }
}

window.addEventListener('changeColor', (e) => {
    // We need a way to access the player instance or we can search the scene
    // But since we don't have the player instance here easily without global, 
    // we will leave this for now or handle it in game.js
});
