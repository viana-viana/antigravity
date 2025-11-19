import * as THREE from 'three';

export function createWorld(scene) {
    const world = {
        trees: [],
        rocks: [],
        npcs: []
    };

    // Ground (Green Grass)
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x5da130 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);

    // River (Blue Strip)
    const riverGeo = new THREE.PlaneGeometry(20, 100);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x0077be });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(20, 0.01, 0); // Slightly above ground to prevent z-fighting
    river.receiveShadow = true;
    scene.add(river);

    // Bridge
    const bridgeGeo = new THREE.BoxGeometry(10, 0.5, 6);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(20, 0.2, 0);
    bridge.receiveShadow = true;
    bridge.castShadow = true;
    scene.add(bridge);

    // Castle Walls (Placeholder Grey Blocks)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x808080 });

    // West Wall
    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 30), wallMat);
    wall1.position.set(-15, 3, 0);
    wall1.castShadow = true;
    scene.add(wall1);

    // North Wall
    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(30, 6, 2), wallMat);
    wall2.position.set(0, 3, -15);
    wall2.castShadow = true;
    scene.add(wall2);

    // South Wall
    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(30, 6, 2), wallMat);
    wall3.position.set(0, 3, 15);
    wall3.castShadow = true;
    scene.add(wall3);

    // Trees (Randomly placed, avoiding river and castle)
    for (let i = 0; i < 30; i++) {
        const x = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 90;

        // Simple collision check (avoid river x=10 to x=30, and castle area x=-15 to 15, z=-15 to 15)
        if ((x > 10 && x < 30) || (x > -20 && x < 20 && z > -20 && z < 20)) continue;

        const tree = createTree();
        tree.position.set(x, 0, z);
        scene.add(tree);
        world.trees.push(tree);
    }

    // Rocks (Mining)
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 90;

        if ((x > 10 && x < 30) || (x > -20 && x < 20 && z > -20 && z < 20)) continue;

        const rock = createRock();
        rock.position.set(x, 0, z);
        scene.add(rock);
        world.rocks.push(rock);
    }

    return world;
}

function createTree() {
    const group = new THREE.Group();
    group.name = "tree";
    group.userData = { type: 'resource', resourceType: 'wood', xp: 25, name: 'Tree' };

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    group.add(trunk);

    // Leaves
    const leavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 2.25;
    leaves.castShadow = true;
    group.add(leaves);

    return group;
}

function createRock() {
    const group = new THREE.Group();
    group.name = "rock";
    group.userData = { type: 'resource', resourceType: 'ore', xp: 35, name: 'Copper Rock' };

    const geo = new THREE.DodecahedronGeometry(0.8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x887766 }); // Copper-ish
    const rock = new THREE.Mesh(geo, mat);
    rock.position.y = 0.5;
    rock.castShadow = true;

    // Random rotation for variety
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    group.add(rock);
    return group;
}

export function updateWorld(world, delta) {
    // Animation or updates for world objects can go here
}
