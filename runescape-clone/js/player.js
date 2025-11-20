// --- PLAYER MODULE ---
function createPlayer(scene) {
    const player = createCharacterMesh(0xff0000, 1); // Red shirt
    player.position.set(0, 0, 0);
    player.userData.speed = 5;
    player.userData.targetPosition = null;
    player.userData.state = 'idle';
    player.userData.animationTime = 0;
    player.userData.interactionTarget = null;

    scene.add(player);

    return {
        mesh: player,
        targetPosition: null,
        speed: 5,
        state: 'idle',
        animationTime: 0,
        interactionTarget: null
    };
}

// Camera rotation controls
const cameraControls = {
    rotateLeft: false,
    rotateRight: false,
    angle: 0, // Current rotation angle around player
    radius: 14.14 // Distance from player (sqrt(10^2 + 10^2))
};

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        cameraControls.rotateLeft = true;
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        cameraControls.rotateRight = true;
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        cameraControls.rotateLeft = false;
    } else if (e.key === 'ArrowRight') {
        cameraControls.rotateRight = false;
    }
});

function updateCamera(player, camera, delta) {
    const rotationSpeed = 2; // radians per second

    // Rotate camera based on arrow keys
    if (cameraControls.rotateLeft) {
        cameraControls.angle += rotationSpeed * delta;
    }
    if (cameraControls.rotateRight) {
        cameraControls.angle -= rotationSpeed * delta;
    }

    // Calculate camera position around player
    const playerPos = player.mesh.position;
    const offsetX = Math.sin(cameraControls.angle) * cameraControls.radius;
    const offsetZ = Math.cos(cameraControls.angle) * cameraControls.radius;

    camera.position.set(
        playerPos.x + offsetX,
        playerPos.y + 10, // Height above player
        playerPos.z + offsetZ
    );
    camera.lookAt(playerPos);
}

function updatePlayer(player, delta, camera) {
    if (!player.mesh.userData.animationTime) player.mesh.userData.animationTime = 0;
    player.mesh.userData.animationTime += delta;

    if (player.targetPosition) {
        const currentPos = player.mesh.position;
        const target = player.targetPosition;
        const speed = player.speed;

        const direction = new THREE.Vector3().subVectors(target, currentPos);
        direction.y = 0;
        const distance = direction.length();

        // Stop further away if we have an interaction target
        const stopDistance = player.interactionTarget ? 1.5 : 0.1;

        if (distance > stopDistance) {
            direction.normalize();
            const moveStep = direction.multiplyScalar(speed * delta);

            if (moveStep.length() > distance - stopDistance) {
                currentPos.x = target.x;
                currentPos.z = target.z;
                player.targetPosition = null;
                player.state = 'idle';

                // Trigger interaction if we have a target
                if (player.interactionTarget) {
                    if (player.interactionTarget.userData.type === 'resource') {
                        gatherResource(player.interactionTarget);
                    } else if (player.interactionTarget.userData.type === 'npc') {
                        interactWithNPC(player.interactionTarget);
                    }
                    player.interactionTarget = null;
                }
            } else {
                // Calculate new position
                const newPos = currentPos.clone().add(moveStep);

                // Check if new position is in river (not on bridge)
                let inRiver = false;
                if (game.world && game.world.river) {
                    for (let riverPart of game.world.river) {
                        const riverBox = new THREE.Box3().setFromObject(riverPart);
                        // Check if in river, but allow bridge area (x: 16-24, z: -3 to 3)
                        if (riverBox.containsPoint(newPos) &&
                            !(newPos.x > 16 && newPos.x < 24 && newPos.z > -3 && newPos.z < 3)) {
                            inRiver = true;
                            break;
                        }
                    }
                }

                // Only move if not entering river
                if (!inRiver) {
                    currentPos.add(moveStep);
                    player.state = 'moving';
                    player.mesh.lookAt(target.x, currentPos.y, target.z);
                } else {
                    // Stop at river edge
                    player.targetPosition = null;
                    player.state = 'idle';
                }
            }
        } else {
            player.targetPosition = null;
            player.state = 'idle';

            // Trigger interaction
            if (player.interactionTarget) {
                if (player.interactionTarget.userData.type === 'resource') {
                    gatherResource(player.interactionTarget);
                } else if (player.interactionTarget.userData.type === 'npc') {
                    interactWithNPC(player.interactionTarget);
                }
                player.interactionTarget = null;
            }
        }
    }

    // Adjust player height for bridge
    if (player.mesh.position.x > 16 && player.mesh.position.x < 24 &&
        player.mesh.position.z > -3 && player.mesh.position.z < 3) {
        // On bridge - raise player slightly
        player.mesh.position.y = 0.5;
    } else {
        // On ground - normal height
        player.mesh.position.y = 0;
    }

    // Update camera to follow player with rotation
    updateCamera(player, camera, delta);

    // Animate player
    animateCharacter(player.mesh, player.state, player.mesh.userData.animationTime);
}
