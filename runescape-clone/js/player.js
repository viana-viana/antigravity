import * as THREE from 'three';

export function createPlayer(scene) {
    const player = {
        mesh: null,
        targetPosition: null,
        speed: 5,
        state: 'idle' // idle, moving, chopping
    };

    // Simple Capsule/Cylinder for player
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red shirt
    player.mesh = new THREE.Mesh(geometry, material);
    player.mesh.position.set(0, 1, 0);
    player.mesh.castShadow = true;

    // Add a "head" to make it look more like a person
    const headGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa }); // Skin tone
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.8, 0);
    player.mesh.add(head);

    scene.add(player.mesh);

    return player;
}

export function updatePlayer(player, delta, camera) {
    if (!player.targetPosition) return;

    const currentPos = player.mesh.position;
    const target = player.targetPosition;

    // Calculate direction
    const direction = new THREE.Vector3().subVectors(target, currentPos);
    direction.y = 0; // Keep movement on flat plane for now
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

    // Camera Follow
    const offset = new THREE.Vector3(10, 10, 10);
    camera.position.copy(currentPos).add(offset);
    camera.lookAt(currentPos);
}

window.addEventListener('changeColor', (e) => {
    // Find player mesh in scene (hacky but works for singleton)
    // Ideally pass player object to this scope or store globally
    // Since we don't have easy access to 'player' var here without export/import cycle or global
    // We will rely on the fact that we can find it in the scene or pass it differently.
    // Actually, let's just look for the mesh with specific properties or keep it simple.
    // Better: The game loop calls updatePlayer, but we need to set the color.
    // Let's assume the player mesh is the only one with a specific name or we can traverse.
    // For MVP, let's just re-select it from the scene if possible, OR better:
    // We can't easily access the specific 'player' instance created in game.js here.
    // Let's modify game.js to handle this event since it holds the player ref.
});
