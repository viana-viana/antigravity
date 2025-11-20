import * as THREE from 'three';

export function createCharacterMesh(color, scale = 1) {
    const group = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: color });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

    // Dimensions
    const torsoWidth = 0.6 * scale;
    const torsoHeight = 0.8 * scale;
    const torsoDepth = 0.3 * scale;

    const headSize = 0.3 * scale;

    const limbWidth = 0.2 * scale;
    const limbLength = 0.8 * scale;
    const limbDepth = 0.2 * scale;

    // 1. Torso (Center)
    const torsoGeo = new THREE.BoxGeometry(torsoWidth, torsoHeight, torsoDepth);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = torsoHeight / 2 + limbLength; // Raise so legs touch ground
    torso.castShadow = true;
    group.add(torso);

    // 2. Head
    const headGeo = new THREE.BoxGeometry(headSize, headSize, headSize);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = torsoHeight / 2 + headSize / 2;
    head.castShadow = true;
    torso.add(head); // Attach to torso

    // 3. Arms (Pivots at shoulders)
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(torsoWidth / 2 + limbWidth / 2, torsoHeight / 2 - limbWidth / 2, 0);
    torso.add(leftArmGroup);

    const armGeo = new THREE.BoxGeometry(limbWidth, limbLength, limbDepth);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.y = -limbLength / 2; // Offset so pivot is at top
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-(torsoWidth / 2 + limbWidth / 2), torsoHeight / 2 - limbWidth / 2, 0);
    torso.add(rightArmGroup);

    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.y = -limbLength / 2;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);

    // 4. Legs (Pivots at hips)
    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(torsoWidth / 4, -torsoHeight / 2, 0);
    torso.add(leftLegGroup);

    const legGeo = new THREE.BoxGeometry(limbWidth, limbLength, limbDepth);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -limbLength / 2;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-torsoWidth / 4, -torsoHeight / 2, 0);
    torso.add(rightLegGroup);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.y = -limbLength / 2;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);

    // Store references for animation
    group.userData = {
        torso: torso,
        head: head,
        leftArm: leftArmGroup,
        rightArm: rightArmGroup,
        leftLeg: leftLegGroup,
        rightLeg: rightLegGroup
    };

    return group;
}
