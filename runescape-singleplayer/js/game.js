const chatbox = document.getElementById("chatbox");
const inventoryRoot = document.getElementById("inventory");
const customizeButton = document.getElementById("customize-btn");
const customizationModal = document.getElementById("customization-modal");
const customizationForm = document.getElementById("customization-form");
const customizationClose = document.getElementById("customization-close");
const customizationCancel = document.getElementById("customization-cancel");
const hairStyleField = document.getElementById("hair-style");
const hairColorField = document.getElementById("hair-color");
const torsoColorField = document.getElementById("torso-color");
const legColorField = document.getElementById("leg-color");
const skillsList = document.getElementById("skills-list");

const defaultAppearance = {
    hairStyle: "short",
    hairColor: "#3b2612",
    torsoColor: "#b03030",
    legColor: "#333333"
};

const hairStyleOptions = ["short", "mohawk", "pony"];
const hairColorPalette = ["#3b2612", "#6b3a1f", "#1c1c1c", "#d9b48f"];

const randomHairStyle = () => hairStyleOptions[THREE.MathUtils.randInt(0, hairStyleOptions.length - 1)];
const randomHairColor = () => hairColorPalette[THREE.MathUtils.randInt(0, hairColorPalette.length - 1)];

const skillDefinitions = {
    woodcutting: {
        label: "Woodcutting",
        color: "#c27a3f",
        icon: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="#3e2b13" d="M13 6h4v20h-4z"/>
            <path fill="#d3c7b8" d="M17 6c6 0 10-4 10-4l1 1s-2 8-11 8z"/>
        </svg>`
    },
    mining: {
        label: "Mining",
        color: "#6b8aa0",
        icon: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="#2d2d2d" d="M6 10l2-2 7 7-2 2z"/>
            <path fill="#b5c8d6" d="M17 9l4-4 7 7-4 4z"/>
        </svg>`
    },
    fishing: {
        label: "Fishing",
        color: "#4c91c2",
        icon: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#4c91c2" stroke-width="2" d="M8 6c10 8 12 18 1 20"/>
            <circle cx="19" cy="14" r="4" fill="#a0d3ff"/>
        </svg>`
    },
    smithing: {
        label: "Smithing",
        color: "#9d5f3f",
        icon: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="14" width="20" height="6" fill="#4a4a4a"/>
            <rect x="11" y="8" width="10" height="4" fill="#c9a063"/>
        </svg>`
    }
};

function createInventorySlots() {
    for (let i = 0; i < 28; i += 1) {
        const slot = document.createElement("div");
        slot.className = "inv-slot";
        slot.dataset.index = i.toString();
        inventoryRoot.appendChild(slot);
    }
}

function addMessage(text, type = "normal") {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

const skills = {};

function normalizeHex(value, fallback = "#ffffff") {
    if (value instanceof THREE.Color) {
        return `#${value.getHexString()}`;
    }
    if (typeof value === "number") {
        return `#${value.toString(16).padStart(6, "0")}`;
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("#")) return trimmed.toLowerCase();
        if (/^[0-9a-f]{6}$/i.test(trimmed)) return `#${trimmed.toLowerCase()}`;
    }
    return fallback;
}
const randRange = (min, max) => Math.random() * (max - min) + min;

function xpForLevel(level) {
    return 10 * Math.pow(Math.max(level - 1, 0), 2);
}

function createSkillRows() {
    Object.entries(skillDefinitions).forEach(([key, config]) => {
        const row = document.createElement("div");
        row.className = "skill-row";

        const icon = document.createElement("div");
        icon.className = "skill-icon";
        icon.innerHTML = config.icon;

        const info = document.createElement("div");
        info.className = "skill-info";

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = config.label;

        const level = document.createElement("div");
        level.className = "level";
        level.textContent = "Lvl 1";

        const progress = document.createElement("div");
        progress.className = "skill-progress";
        const fill = document.createElement("div");
        fill.className = "fill";
        fill.style.background = `linear-gradient(90deg, ${config.color}, #1c1c1c)`;
        progress.appendChild(fill);

        const xp = document.createElement("div");
        xp.className = "skill-xp";
        xp.textContent = "0 xp";

        info.appendChild(label);
        info.appendChild(level);
        info.appendChild(progress);
        info.appendChild(xp);

        row.appendChild(icon);
        row.appendChild(info);
        skillsList.appendChild(row);

        skills[key] = {
            xp: 0,
            level: 1,
            levelEl: level,
            xpEl: xp,
            fillEl: fill
        };

        updateSkillDisplay(key);
    });
}

function addXP(skill, amount) {
    const stat = skills[skill];
    if (!stat) return;
    stat.xp += amount;
    const newLevel = Math.floor(Math.sqrt(stat.xp / 10)) + 1;
    if (newLevel > stat.level) {
        stat.level = newLevel;
        const label = skillDefinitions[skill]?.label || skill;
        addMessage(`Level up! ${label} is now ${newLevel}.`, "system");
    }
    updateSkillDisplay(skill);
}

function updateSkillDisplay(skillName) {
    const stat = skills[skillName];
    if (!stat) return;
    const currentLevel = stat.level;
    const baseXp = xpForLevel(currentLevel);
    const nextLevelXp = xpForLevel(currentLevel + 1);
    const span = nextLevelXp - baseXp || 1;
    const progress = Math.max(0, Math.min(1, (stat.xp - baseXp) / span));

    stat.levelEl.textContent = `Lvl ${currentLevel}`;
    stat.fillEl.style.width = `${progress * 100}%`;
    stat.xpEl.textContent = `${stat.xp.toLocaleString()} xp`;
}

const TextureFactory = {
    makeCanvas(size = 512) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        return canvas;
    },
    createNoise(base, accent, density = 7000) {
        const canvas = this.makeCanvas();
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < density; i += 1) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const w = Math.random() * 4;
            const h = Math.random() * 4;
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = accent;
            ctx.fillRect(x, y, w, h);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    },
    createWood() {
        const canvas = this.makeCanvas();
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#6d4427";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#3d2414";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 90; i += 1) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, 0);
            ctx.bezierCurveTo(
                Math.random() * canvas.width,
                canvas.height * 0.3,
                Math.random() * canvas.width,
                canvas.height * 0.6,
                Math.random() * canvas.width,
                canvas.height
            );
            ctx.stroke();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    },
    createLeaves() {
        const canvas = this.makeCanvas();
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            20,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        gradient.addColorStop(0, "#2f6d32");
        gradient.addColorStop(1, "#1b3a1d");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    },
    createWater() {
        const canvas = this.makeCanvas();
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#1f4e8a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#4fbbe6";
        for (let i = 0; i < 400; i += 1) {
            ctx.beginPath();
            const radius = Math.random() * 40;
            ctx.ellipse(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                radius,
                radius / 2,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }
};

const textures = {
    grass: TextureFactory.createNoise("#314f1f", "#4d7c2a", 9000),
    dirt: TextureFactory.createNoise("#5c402a", "#734b31", 4000),
    wood: TextureFactory.createWood(),
    leaves: TextureFactory.createLeaves(),
    stone: TextureFactory.createNoise("#555555", "#2b2b2b", 5000),
    water: TextureFactory.createWater()
};

textures.grass.repeat.set(20, 20);
textures.dirt.repeat.set(4, 2);
textures.water.repeat.set(3, 1);

const baseMaterials = {
    trunk: new THREE.MeshStandardMaterial({ map: textures.wood }),
    leaves: new THREE.MeshStandardMaterial({ map: textures.leaves }),
    stone: new THREE.MeshStandardMaterial({ map: textures.stone, roughness: 0.9 }),
    vein: new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 })
};

function createHairMesh(style = "short", color = "#3b2612", scale = 1) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });

    const addCap = (width, height, depth, yOffset) => {
        const cap = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
        cap.position.y = yOffset;
        cap.castShadow = true;
        cap.receiveShadow = true;
        group.add(cap);
    };

    switch (style) {
        case "mohawk": {
            addCap(0.12 * scale, 0.35 * scale, 0.4 * scale, 0.2 * scale);
            const back = new THREE.Mesh(new THREE.BoxGeometry(0.18 * scale, 0.2 * scale, 0.18 * scale), mat);
            back.position.set(0, 0.05 * scale, -0.1 * scale);
            group.add(back);
            break;
        }
        case "pony": {
            addCap(0.32 * scale, 0.18 * scale, 0.34 * scale, 0.2 * scale);
            const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 0.5 * scale, 10), mat);
            tail.rotation.x = Math.PI / 2.3;
            tail.position.set(0, 0, -0.25 * scale);
            tail.castShadow = true;
            tail.receiveShadow = true;
            group.add(tail);
            break;
        }
        case "short":
        default: {
            addCap(0.34 * scale, 0.2 * scale, 0.34 * scale, 0.2 * scale);
            const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.34 * scale, 0.1 * scale, 0.14 * scale), mat);
            fringe.position.set(0, 0.05 * scale, 0.2 * scale);
            group.add(fringe);
            break;
        }
    }

    group.userData = {
        hairStyle: style,
        hairColor: normalizeHex(color)
    };
    return group;
}

function applyHair(parts, style, color, scale = 1) {
    if (parts.hair && parts.hair.parent) {
        parts.hair.parent.remove(parts.hair);
    }
    const hair = createHairMesh(style, color, scale);
    hair.position.y = 0.25 * scale;
    parts.head.add(hair);
    parts.hair = hair;
}

function applyPlayerAppearance(overrides = {}) {
    if (!game.player) return;
    const mesh = game.player.mesh;
    const parts = mesh.userData.parts;
    if (!parts) return;
    const current = { ...defaultAppearance, ...(mesh.userData.customization || {}) };
    const updated = {
        ...current,
        ...overrides,
        hairColor: normalizeHex(overrides.hairColor || current.hairColor),
        torsoColor: normalizeHex(overrides.torsoColor || current.torsoColor),
        legColor: normalizeHex(overrides.legColor || current.legColor)
    };

    parts.torsoMaterial?.color.set(updated.torsoColor);
    parts.legMaterial?.color.set(updated.legColor);
    applyHair(parts, updated.hairStyle, updated.hairColor, mesh.userData.scale || 1);

    mesh.userData.customization = updated;
}

function addInventoryItem(name, color) {
    const slots = inventoryRoot.querySelectorAll(".inv-slot");
    for (const slot of slots) {
        if (!slot.firstElementChild) {
            const item = document.createElement("div");
            item.className = "item";
            item.style.backgroundColor = color;
            item.textContent = name;
            item.dataset.item = name;
            slot.appendChild(item);
            return;
        }
    }
    addMessage("Your backpack is full.", "system");
}

function countInventoryItems(name) {
    return Array.from(inventoryRoot.querySelectorAll(".item")).filter(
        (item) => item.dataset.item === name || item.textContent === name
    ).length;
}

function removeInventoryItem(name) {
    const item = Array.from(inventoryRoot.querySelectorAll(".item")).find(
        (el) => el.dataset.item === name || el.textContent === name
    );
    if (item) item.remove();
}

const game = {
    scene: null,
    camera: null,
    renderer: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    player: null,
    world: { trees: [], rocks: [], npcs: [] },
    controls: { rotateLeft: false, rotateRight: false, angle: Math.PI / 4, radius: 14 },
    waterMaterial: null,
    waterTime: 0
};

function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 20, 70);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(10, 12, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.prepend(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(25, 35, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    game.scene = scene;
    game.camera = camera;
    game.renderer = renderer;
}

function createGroundAndRiver() {
    const groundGeo = new THREE.PlaneGeometry(90, 90, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ map: textures.grass });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.name = "ground";
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    game.scene.add(ground);

    const pathGeo = new THREE.PlaneGeometry(16, 4, 1, 1);
    const pathMat = new THREE.MeshStandardMaterial({ map: textures.dirt });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.02, -4);
    path.receiveShadow = true;
    path.name = "path";
    game.scene.add(path);

    const riverGeo = new THREE.PlaneGeometry(80, 8);
    const waterTexture = textures.water.clone();
    waterTexture.wrapS = THREE.RepeatWrapping;
    waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(3, 1);

    const riverMat = new THREE.MeshStandardMaterial({
        map: waterTexture,
        transparent: true,
        opacity: 0.85,
        roughness: 0.15,
        metalness: 0.2,
        color: 0xffffff
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.01, 10);
    river.name = "river";
    river.receiveShadow = false;
    game.scene.add(river);
    game.waterMaterial = riverMat;
}

function createTree() {
    const tree = new THREE.Group();
    tree.name = "tree";
    tree.userData = { type: "resource", resourceType: "wood", xp: 25, label: "Tree" };

    const height = randRange(1.8, 2.6);
    const trunkGeo = new THREE.CylinderGeometry(randRange(0.22, 0.32), randRange(0.32, 0.42), height, 10);
    const trunkMat = baseMaterials.trunk.clone();
    trunkMat.color.offsetHSL((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = height / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;

    tree.add(trunk);

    const clusterCount = THREE.MathUtils.randInt(3, 5);
    for (let i = 0; i < clusterCount; i += 1) {
        const leafGeo = new THREE.SphereGeometry(randRange(0.8, 1.3), 14, 14);
        const leafMat = baseMaterials.leaves.clone();
        leafMat.color.offsetHSL((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.2);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(
            randRange(-0.6, 0.6),
            height - randRange(0.1, 0.4),
            randRange(-0.5, 0.5)
        );
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        tree.add(leaf);
    }
    return tree;
}

function createRock() {
    const rock = new THREE.Group();
    rock.name = "rock";
    rock.userData = { type: "resource", resourceType: "ore", xp: 35, label: "Copper rock" };

    const detail = THREE.MathUtils.randInt(0, 2);
    const geoOptions = [
        () => new THREE.DodecahedronGeometry(randRange(0.7, 1), detail),
        () => new THREE.IcosahedronGeometry(randRange(0.65, 0.95), detail),
        () => new THREE.OctahedronGeometry(randRange(0.75, 1.1), detail)
    ];
    const geo = geoOptions[THREE.MathUtils.randInt(0, geoOptions.length - 1)]();
    const mat = baseMaterials.stone.clone();
    mat.flatShading = true;
    mat.color.offsetHSL((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.15);
    const mesh = new THREE.Mesh(geo, mat);
    const radius = geo.parameters?.radius || 0.8;
    mesh.position.y = radius / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.add(mesh);

    const veins = THREE.MathUtils.randInt(2, 4);
    for (let i = 0; i < veins; i += 1) {
        const vein = new THREE.Mesh(
            new THREE.CapsuleGeometry(randRange(0.08, 0.15), randRange(0.1, 0.3), 4, 8),
            baseMaterials.vein.clone()
        );
        vein.material.color.offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2);
        vein.position.set(randRange(-0.3, 0.3), randRange(0.2, 0.6), randRange(-0.3, 0.3));
        vein.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        vein.castShadow = true;
        rock.add(vein);
    }

    return rock;
}

function createNPC(name, color) {
    const appearance = {
        hairStyle: randomHairStyle(),
        hairColor: randomHairColor(),
        torsoColor: normalizeHex(color),
        legColor: "#2f2f2f"
    };
    const npc = createCharacterMesh(appearance.torsoColor, 0.8, appearance);
    npc.position.set(-5, 0, -5);
    npc.userData.type = "npc";
    npc.userData.dialog = [
        `Greetings, adventurer. I am ${name}.`,
        "Remember to bank your valuables!",
        "These woods hold secrets."
    ];
    npc.userData.name = name;
    npc.userData.target = null;
    npc.userData.state = "idle";
    return npc;
}

function populateWorld() {
    createGroundAndRiver();

    for (let i = 0; i < 28; i += 1) {
        const tree = createTree();
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        if ((z > 6 && z < 14) || (Math.abs(z + 4) < 2 && Math.abs(x) < 9)) continue;
        tree.position.set(x, 0, z);
        game.scene.add(tree);
        game.world.trees.push(tree);
    }

    for (let i = 0; i < 12; i += 1) {
        const rock = createRock();
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        if ((z > 6 && z < 14) || (Math.abs(z + 4) < 2 && Math.abs(x) < 9)) continue;
        rock.position.set(x, 0, z);
        game.scene.add(rock);
        game.world.rocks.push(rock);
    }

    const guide = createNPC("Guide Arlow", 0xf5c542);
    guide.position.set(6, 0, -6);
    game.scene.add(guide);
    game.world.npcs.push(guide);

    const anvil = createAnvil();
    anvil.position.set(-2, 0, -4);
    game.scene.add(anvil);
}

function createCharacterMesh(color, scale = 1, appearanceOverrides = {}) {
    const group = new THREE.Group();
    group.userData = { parts: {} };
    group.userData.scale = scale;

    const appearance = {
        hairStyle: appearanceOverrides.hairStyle || defaultAppearance.hairStyle,
        hairColor: normalizeHex(appearanceOverrides.hairColor || defaultAppearance.hairColor),
        torsoColor: normalizeHex(appearanceOverrides.torsoColor || color),
        legColor: normalizeHex(appearanceOverrides.legColor || defaultAppearance.legColor)
    };

    const torsoMat = new THREE.MeshStandardMaterial({ color: appearance.torsoColor });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcda5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: appearance.legColor });

    const torsoGeo = new THREE.BoxGeometry(0.5 * scale, 0.7 * scale, 0.3 * scale);
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.castShadow = true;
    torso.position.y = 0.9 * scale;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.3 * scale), skinMat);
    head.position.y = 0.55 * scale;
    torso.add(head);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.35 * scale, 0.3 * scale, 0);
    const armGeo = new THREE.BoxGeometry(0.15 * scale, 0.6 * scale, 0.15 * scale);
    const leftArm = new THREE.Mesh(armGeo, torsoMat);
    leftArm.position.y = -0.3 * scale;
    leftArmGroup.add(leftArm);
    torso.add(leftArmGroup);

    const rightArmGroup = leftArmGroup.clone();
    rightArmGroup.position.x = -0.35 * scale;
    torso.add(rightArmGroup);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.15 * scale, -0.35 * scale, 0);
    const legGeo = new THREE.BoxGeometry(0.18 * scale, 0.7 * scale, 0.18 * scale);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -0.35 * scale;
    leftLegGroup.add(leftLeg);
    torso.add(leftLegGroup);

    const rightLegGroup = leftLegGroup.clone();
    rightLegGroup.position.x = -0.15 * scale;
    torso.add(rightLegGroup);

    group.userData.parts.head = head;
    group.userData.parts.torso = torso;
    group.userData.parts.leftArm = leftArmGroup;
    group.userData.parts.rightArm = rightArmGroup;
    group.userData.parts.leftLeg = leftLegGroup;
    group.userData.parts.rightLeg = rightLegGroup;
    group.userData.parts.torsoMaterial = torsoMat;
    group.userData.parts.legMaterial = pantsMat;

    applyHair(group.userData.parts, appearance.hairStyle, appearance.hairColor, scale);
    group.userData.customization = appearance;

    return group;
}

function createPlayer() {
    const mesh = createCharacterMesh(defaultAppearance.torsoColor, 1, { ...defaultAppearance });
    mesh.position.set(0, 0, 0);
    game.scene.add(mesh);
    game.player = {
        mesh,
        speed: 6,
        target: null,
        interaction: null,
        state: "idle",
        animationTime: 0
    };
}

function updateCamera(delta) {
    const controls = game.controls;
    const rotationSpeed = 2.4;
    if (controls.rotateLeft) controls.angle += rotationSpeed * delta;
    if (controls.rotateRight) controls.angle -= rotationSpeed * delta;
    const offsetX = Math.sin(controls.angle) * controls.radius;
    const offsetZ = Math.cos(controls.angle) * controls.radius;
    const playerPos = game.player.mesh.position;
    game.camera.position.set(playerPos.x + offsetX, playerPos.y + 9, playerPos.z + offsetZ);
    game.camera.lookAt(playerPos.clone().setY(playerPos.y + 1));
}

function animateCharacter(mesh, state, time) {
    const parts = mesh.userData.parts;
    if (!parts) return;

    parts.leftArm.rotation.x = 0;
    parts.rightArm.rotation.x = 0;
    parts.leftLeg.rotation.x = 0;
    parts.rightLeg.rotation.x = 0;
    parts.torso.position.y = 0.9;

    if (state === "idle") {
        parts.torso.position.y = 0.9 + Math.sin(time * 2) * 0.02;
    } else if (state === "moving") {
        const speed = 10;
        parts.leftArm.rotation.x = Math.sin(time * speed) * 0.8;
        parts.rightArm.rotation.x = Math.sin(time * speed + Math.PI) * 0.8;
        parts.leftLeg.rotation.x = Math.sin(time * speed + Math.PI) * 1.1;
        parts.rightLeg.rotation.x = Math.sin(time * speed) * 1.1;
    } else if (state === "working") {
        const swing = Math.sin(time * 7) * 1.2;
        parts.leftArm.rotation.x = -Math.PI / 3 + swing;
        parts.rightArm.rotation.x = -Math.PI / 3 + swing;
    }
}

function updatePlayer(delta) {
    const player = game.player;
    player.animationTime += delta;
    if (player.target) {
        const current = player.mesh.position;
        const direction = new THREE.Vector3().subVectors(player.target, current);
        direction.y = 0;
        const distance = direction.length();
        const stopDistance = player.interaction ? 1.1 : 0.05;
        if (distance <= stopDistance) {
            player.target = null;
            player.state = player.interaction ? "working" : "idle";
            if (player.interaction) {
                if (player.interaction.userData.type === "resource") {
                    harvestResource(player.interaction);
                } else if (player.interaction.userData.type === "npc") {
                    speakToNPC(player.interaction);
                } else if (player.interaction.userData.type === "smithing") {
                    trainSmithing();
                }
                player.interaction = null;
            }
        } else {
            direction.normalize();
            current.add(direction.multiplyScalar(player.speed * delta));
            player.mesh.lookAt(player.target.x, current.y, player.target.z);
            player.state = "moving";
        }
    } else if (player.state === "moving") {
        player.state = "idle";
    }

    animateCharacter(player.mesh, player.state, player.animationTime);
    updateCamera(delta);
}

function harvestResource(resource) {
    const { resourceType, label, xp } = resource.userData;
    if (!resource.visible) {
        addMessage("That seems to be depleted.", "system");
        game.player.state = "idle";
        return;
    }
    game.player.state = "working";
    addMessage(`You start gathering from the ${label}.`, "action");
    const duration = resourceType === "wood" ? 2500 : 3500;
    setTimeout(() => {
        game.player.state = "idle";
        if (!resource.visible) return;
        resource.visible = false;
        addMessage(`You obtain some ${resourceType === "wood" ? "logs" : "ore"}.`, "system");
        if (resourceType === "wood") {
            addInventoryItem("Logs", "#5c3a1e");
        } else {
            addInventoryItem("Ore", "#a46740");
        }
        addXP(resourceType === "wood" ? "woodcutting" : "mining", xp);
        const respawnTime = resourceType === "wood" ? 6000 : 9000;
        setTimeout(() => {
            resource.visible = true;
        }, respawnTime);
    }, duration);
}

function updateWater(delta) {
    if (!game.waterMaterial || !game.waterMaterial.map) return;
    game.waterTime += delta;
    const map = game.waterMaterial.map;
    map.offset.x = (map.offset.x + delta * 0.08) % 1;
    map.offset.y = (map.offset.y - delta * 0.2) % 1;
    game.waterMaterial.opacity = 0.78 + Math.sin(game.waterTime * 1.5) * 0.05;
}

function createAnvil() {
    const base = new THREE.Group();
    base.name = "anvil";
    base.userData = { type: "smithing", label: "Anvil" };

    const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0x2a1b10, roughness: 0.9 })
    );
    stand.position.y = 0.3;
    stand.castShadow = true;
    stand.receiveShadow = true;
    base.add(stand);

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.25, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x5a5a5a, metalness: 0.9, roughness: 0.35 })
    );
    body.position.y = 0.75;
    body.castShadow = true;
    body.receiveShadow = true;
    base.add(body);

    const horn = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x6d6d6d, metalness: 0.8, roughness: 0.3 })
    );
    horn.rotation.z = Math.PI / 2;
    horn.position.set(0.6, 0.85, 0);
    horn.castShadow = true;
    base.add(horn);

    return base;
}

function trainSmithing() {
    const oreCount = countInventoryItems("Ore");
    if (!oreCount) {
        addMessage("You need ore in your inventory to smith.", "system");
        game.player.state = "idle";
        return;
    }

    game.player.state = "working";
    addMessage("You heat the ore on the anvil...", "action");
    setTimeout(() => {
        removeInventoryItem("Ore");
        addInventoryItem("Bar", "#c5b358");
        addMessage("You smith a bronze bar.", "system");
        addXP("smithing", 45);
        game.player.state = "idle";
    }, 3000);
}

function speakToNPC(npc) {
    addMessage(`You talk to ${npc.userData.name}.`, "action");
    const line = npc.userData.dialog[Math.floor(Math.random() * npc.userData.dialog.length)];
    setTimeout(() => addMessage(`${npc.userData.name}: "${line}"`, "system"), 400);
    game.player.state = "idle";
}

function onPointerDown(event) {
    if (event.target.closest(".rs-panel") || event.target.classList.contains("rs-button")) return;
    game.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    game.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    game.raycaster.setFromCamera(game.pointer, game.camera);
    const intersects = game.raycaster.intersectObjects(game.scene.children, true);
    if (intersects.length === 0) return;

    let chosen = null;
    let point = null;
    for (const hit of intersects) {
        let node = hit.object;
        while (node) {
            if (node.userData && (node.userData.type === "resource" || node.userData.type === "npc" || node.userData.type === "smithing")) {
                chosen = node;
                point = hit.point;
                break;
            }
            node = node.parent;
        }
        if (chosen) break;
    }

    if (!chosen) {
        const groundHit = intersects.find((hit) => hit.object.name === "ground");
        if (groundHit) {
            chosen = groundHit.object;
            point = groundHit.point;
        }
    }

    if (!chosen || !point) return;

    if (chosen.name === "ground") {
        game.player.target = new THREE.Vector3(point.x, 0, point.z);
        game.player.interaction = null;
        addMessage("You walk to that tile.", "action");
    } else if (chosen.userData.type === "resource") {
        game.player.target = new THREE.Vector3(point.x, 0, point.z);
        game.player.interaction = chosen;
        addMessage("You approach the resource.", "action");
    } else if (chosen.userData.type === "npc") {
        game.player.target = new THREE.Vector3(point.x, 0, point.z);
        game.player.interaction = chosen;
        addMessage("You approach the villager.", "action");
    } else if (chosen.userData.type === "smithing") {
        game.player.target = new THREE.Vector3(point.x, 0, point.z);
        game.player.interaction = chosen;
        addMessage("You walk over to the anvil.", "action");
    }
}

function animate() {
    requestAnimationFrame(animate);
    const delta = game.clock.getDelta();
    if (game.player) updatePlayer(delta);
    updateWater(delta);
    game.renderer.render(game.scene, game.camera);
}

function customizePlayer() {
    const hideModal = () => customizationModal.classList.add("hidden");
    const showModal = () => {
        if (!game.player) return;
        const state = { ...defaultAppearance, ...(game.player.mesh.userData.customization || {}) };
        hairStyleField.value = state.hairStyle;
        hairColorField.value = state.hairColor;
        torsoColorField.value = state.torsoColor;
        legColorField.value = state.legColor;
        customizationModal.classList.remove("hidden");
    };

    customizeButton.addEventListener("click", showModal);
    customizationClose?.addEventListener("click", hideModal);
    customizationCancel?.addEventListener("click", hideModal);
    customizationModal?.addEventListener("click", (event) => {
        if (event.target === customizationModal) hideModal();
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !customizationModal.classList.contains("hidden")) {
            hideModal();
        }
    });

    customizationForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        applyPlayerAppearance({
            hairStyle: hairStyleField.value,
            hairColor: hairColorField.value,
            torsoColor: torsoColorField.value,
            legColor: legColorField.value
        });
        hideModal();
    });
}

function setupInput() {
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            game.controls.rotateLeft = true;
            event.preventDefault();
        } else if (event.key === "ArrowRight") {
            game.controls.rotateRight = true;
            event.preventDefault();
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") game.controls.rotateLeft = false;
        if (event.key === "ArrowRight") game.controls.rotateRight = false;
    });
    window.addEventListener("resize", () => {
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function boot() {
    createInventorySlots();
    createSkillRows();
    initScene();
    populateWorld();
    createPlayer();
    customizePlayer();
    setupInput();
    animate();
}

boot();

