// --- CHARACTER MODEL & ANIMATION ---
function createCharacterMesh(color, scale = 1) {
    const group = new THREE.Group();
    group.userData = { parts: {} }; // Store references to body parts

    const material = new THREE.MeshStandardMaterial({ color: color });
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.5 * scale, 0.7 * scale, 0.3 * scale);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = 0.7 * scale;
    torso.castShadow = true;
    group.add(torso);
    group.userData.parts.torso = torso;

    // Head
    const headGeo = new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.3 * scale);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.y = 0.55 * scale; // Relative to torso
    torso.add(head);
    group.userData.parts.head = head;

    // Arms (Pivot at shoulder)
    const armGeo = new THREE.BoxGeometry(0.15 * scale, 0.6 * scale, 0.15 * scale);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.35 * scale, 0.3 * scale, 0);
    torso.add(leftArmGroup);
    const leftArm = new THREE.Mesh(armGeo, skinMaterial);
    leftArm.position.y = -0.2 * scale;
    leftArmGroup.add(leftArm);
    group.userData.parts.leftArm = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.35 * scale, 0.3 * scale, 0);
    torso.add(rightArmGroup);
    const rightArm = new THREE.Mesh(armGeo, skinMaterial);
    rightArm.position.y = -0.2 * scale;
    rightArmGroup.add(rightArm);
    group.userData.parts.rightArm = rightArmGroup;

    // Legs (Pivot at hip)
    const legGeo = new THREE.BoxGeometry(0.18 * scale, 0.6 * scale, 0.18 * scale);
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.15 * scale, -0.35 * scale, 0);
    torso.add(leftLegGroup);
    const leftLeg = new THREE.Mesh(legGeo, pantsMaterial);
    leftLeg.position.y = -0.3 * scale;
    leftLegGroup.add(leftLeg);
    group.userData.parts.leftLeg = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-0.15 * scale, -0.35 * scale, 0);
    torso.add(rightLegGroup);
    const rightLeg = new THREE.Mesh(legGeo, pantsMaterial);
    rightLeg.position.y = -0.3 * scale;
    rightLegGroup.add(rightLeg);
    group.userData.parts.rightLeg = rightLegGroup;

    return group;
}

const npcColors = [0xffff00, 0x00ff00, 0xff00ff, 0x00ffff];

function animateCharacter(mesh, state, time) {
    const parts = mesh.userData.parts;
    if (!parts) return;

    // Reset rotations
    parts.leftArm.rotation.x = 0;
    parts.rightArm.rotation.x = 0;
    parts.leftLeg.rotation.x = 0;
    parts.rightLeg.rotation.x = 0;
    parts.torso.position.y = 0.7; // Reset height

    if (state === 'idle') {
        // Breathing / Bobbing
        parts.torso.position.y = 0.7 + Math.sin(time * 2) * 0.02;
        parts.leftArm.rotation.z = Math.sin(time * 1.5) * 0.05 + 0.1;
        parts.rightArm.rotation.z = -Math.sin(time * 1.5) * 0.05 - 0.1;
    } else if (state === 'moving') {
        // Walking
        const speed = 10;
        const armAmp = 0.8;
        const legAmp = 1.0;

        parts.leftArm.rotation.x = Math.sin(time * speed) * armAmp;
        parts.rightArm.rotation.x = Math.sin(time * speed + Math.PI) * armAmp;
        parts.leftLeg.rotation.x = Math.sin(time * speed + Math.PI) * legAmp;
        parts.rightLeg.rotation.x = Math.sin(time * speed) * legAmp;
    } else if (state === 'chopping' || state === 'mining') {
        // Chopping/Mining animation - swing arms
        const swingSpeed = 6;
        const swingAmp = 1.2;

        // Both arms swing together for chopping
        const swing = Math.sin(time * swingSpeed) * swingAmp;
        parts.leftArm.rotation.x = -Math.PI / 4 + swing;
        parts.rightArm.rotation.x = -Math.PI / 4 + swing;
    }
}
