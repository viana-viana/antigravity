// --- WORLD MODULE ---
function createWorld(scene) {
    const world = {
        trees: [],
        rocks: [],
        npcs: [],
        river: []
    };

    // Ground
    const groundGeo = new THREE.PlaneGeometry(100, 100, 64, 64);
    const groundMat = new THREE.MeshStandardMaterial({ map: textures.grass });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);

    // River - winding path using multiple segments
    const waterMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.3
    });

    // Create river segments that curve
    const riverSegments = [
        { x: 20, z: -20, width: 4, length: 15, rotation: 0 },
        { x: 20, z: -10, width: 5, length: 8, rotation: 0.2 },
        { x: 21, z: -3, width: 4, length: 8, rotation: -0.1 },
        { x: 20, z: 3, width: 5, length: 8, rotation: 0.15 },
        { x: 19, z: 10, width: 4, length: 8, rotation: -0.2 },
        { x: 20, z: 17, width: 5, length: 10, rotation: 0 }
    ];

    riverSegments.forEach(seg => {
        const riverPart = new THREE.Mesh(
            new THREE.BoxGeometry(seg.width, 0.2, seg.length),
            waterMat
        );
        riverPart.position.set(seg.x, -0.3, seg.z);
        riverPart.rotation.y = seg.rotation;
        riverPart.receiveShadow = true;
        riverPart.name = 'river'; // Mark as river for collision detection
        scene.add(riverPart);
        world.river.push(riverPart); // Store river segments
    });

    // Create riverbed (carved ground channel)
    const riverbedMat = new THREE.MeshStandardMaterial({
        map: textures.stone,
        color: 0x8b7355 // Brownish color for riverbed
    });

    riverSegments.forEach(seg => {
        const riverbed = new THREE.Mesh(
            new THREE.BoxGeometry(seg.width + 2, 0.5, seg.length + 2),
            riverbedMat
        );
        riverbed.position.set(seg.x, -0.4, seg.z);
        riverbed.rotation.y = seg.rotation;
        riverbed.receiveShadow = true;
        scene.add(riverbed);
    });

    // Bridge - positioned over the middle of the river
    const bridgeGeo = new THREE.BoxGeometry(8, 0.3, 6);
    const bridgeMat = new THREE.MeshStandardMaterial({ map: textures.wood });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(20, 0.25, 0);
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    bridge.name = 'bridge';
    scene.add(bridge);

    // === CASTLE ===
    // Floor
    const castleFloorGeo = new THREE.BoxGeometry(20, 0.2, 20);
    const castleFloorMat = new THREE.MeshStandardMaterial({ map: textures.stone });
    const castleFloor = new THREE.Mesh(castleFloorGeo, castleFloorMat);
    castleFloor.position.set(-5, 0.1, -5);
    castleFloor.receiveShadow = true;
    scene.add(castleFloor);

    // Wall material
    const wallMat = new THREE.MeshStandardMaterial({ map: textures.bricks });

    // West wall (back) - full wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 20), wallMat);
    westWall.position.set(-15, 2.5, -5);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    scene.add(westWall);

    // East wall (front with gate) - split for gate entrance
    const eastWallLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 7), wallMat);
    eastWallLeft.position.set(5, 2.5, -11.5);
    eastWallLeft.castShadow = true;
    scene.add(eastWallLeft);

    const eastWallRight = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 7), wallMat);
    eastWallRight.position.set(5, 2.5, 1.5);
    eastWallRight.castShadow = true;
    scene.add(eastWallRight);

    // Gate arch above entrance
    const gateArch = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 6), wallMat);
    gateArch.position.set(5, 5, -5);
    gateArch.castShadow = true;
    scene.add(gateArch);

    // North wall (right side)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 1), wallMat);
    northWall.position.set(-5, 2.5, -15);
    northWall.castShadow = true;
    scene.add(northWall);

    // South wall (left side)
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 1), wallMat);
    southWall.position.set(-5, 2.5, 5);
    southWall.castShadow = true;
    scene.add(southWall);

    // Corner Towers
    const towerGeo = new THREE.CylinderGeometry(2, 2, 8, 8);
    const towerRoofGeo = new THREE.ConeGeometry(2.5, 3, 8);
    const towerRoofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    function createTower(x, z) {
        const tower = new THREE.Mesh(towerGeo, wallMat);
        tower.position.set(x, 4, z);
        tower.castShadow = true;
        scene.add(tower);

        const roof = new THREE.Mesh(towerRoofGeo, towerRoofMat);
        roof.position.set(x, 9.5, z);
        roof.castShadow = true;
        scene.add(roof);
    }

    // Place towers at corners
    createTower(-15, -15); // Back-left
    createTower(-15, 5);   // Back-right
    createTower(5, -15);   // Front-left (near gate)
    createTower(5, 5);     // Front-right (near gate)

    // Spawn trees
    for (let i = 0; i < 40; i++) {
        const x = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 90;
        // Don't spawn inside castle or on river
        if ((x > 10 && x < 30) || (x > -15 && x < 5 && z > -15 && z < 5)) continue;
        const tree = createTree();
        tree.position.set(x, 0, z);
        tree.rotation.y = Math.random() * Math.PI;
        scene.add(tree);
        world.trees.push(tree);
    }

    // Spawn rocks
    for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 90;
        // Don't spawn inside castle or on river
        if ((x > 10 && x < 30) || (x > -15 && x < 5 && z > -15 && z < 5)) continue;
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

    // Trunk - High poly cylinder
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
    const trunkMat = new THREE.MeshStandardMaterial({ map: textures.wood });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1;
    group.add(trunk);

    // Leaves - High poly spheres
    const leavesMat = new THREE.MeshStandardMaterial({ map: textures.leaves });
    const leafGeo = new THREE.SphereGeometry(1.2, 16, 16); // Smoother leaves

    const leaf1 = new THREE.Mesh(leafGeo, leavesMat);
    leaf1.position.y = 2.5;
    group.add(leaf1);

    const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), leavesMat);
    leaf2.position.set(0.8, 2.0, 0);
    group.add(leaf2);

    const leaf3 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), leavesMat);
    leaf3.position.set(-0.8, 2.2, 0.5);
    group.add(leaf3);

    group.traverse(c => { c.castShadow = true; c.receiveShadow = true; });
    return group;
}

function createRock() {
    const group = new THREE.Group();
    group.name = "rock";
    group.userData = { type: 'resource', resourceType: 'ore', xp: 35, name: 'Copper Rock' };

    // Base Rock - High poly dodecahedron (detail level 1 adds vertices)
    const geo = new THREE.DodecahedronGeometry(0.8, 1);
    const mat = new THREE.MeshStandardMaterial({ map: textures.stone, roughness: 0.9 });
    const rock = new THREE.Mesh(geo, mat);
    rock.position.y = 0.4;
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.scale.set(1.2, 0.8, 1.2);
    group.add(rock);

    // Veins (Copper)
    const veinMat = new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.4, metalness: 0.8 });
    for (let i = 0; i < 3; i++) {
        const vein = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), veinMat); // Spherical veins
        vein.position.set((Math.random() - 0.5), 0.6, (Math.random() - 0.5));
        group.add(vein);
    }

    group.traverse(c => { c.castShadow = true; c.receiveShadow = true; });
    return group;
}

function updateWorld(world, delta) {
    world.npcs.forEach(npc => {
        updateNPC(npc, delta);
    });
}
