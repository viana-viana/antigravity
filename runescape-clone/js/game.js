import * as THREE from 'three';
import { createPlayer, updatePlayer } from './player.js';
import { createWorld, updateWorld } from './world.js';
import { createNPCs } from './npc.js';
import { setupInteraction } from './interaction.js';
import { initUI } from './ui.js';

// Global Game State
const game = {
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    world: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2()
};

function init() {
    // Scene Setup
    game.scene = new THREE.Scene();
    game.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    game.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

    // Camera Setup (Isometric-ish)
    const aspect = window.innerWidth / window.innerHeight;
    game.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    game.camera.position.set(10, 10, 10);
    game.camera.lookAt(0, 0, 0);

    // Renderer Setup
    game.renderer = new THREE.WebGLRenderer({ antialias: true });
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    game.renderer.shadowMap.enabled = true;
    document.body.appendChild(game.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    game.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    game.scene.add(dirLight);

    // Initialize Modules
    game.world = createWorld(game.scene);
    createNPCs(game.scene, game.world);
    game.player = createPlayer(game.scene);
    setupInteraction(game);
    initUI();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('changeColor', (e) => {
        if (game.player && game.player.mesh) {
            game.player.mesh.material.color.set(e.detail.color);
        }
    });

    // Start Loop
    animate();
}

function onWindowResize() {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = game.clock.getDelta();

    if (game.player) updatePlayer(game.player, delta, game.camera);
    if (game.world) updateWorld(game.world, delta);

    if (game.renderer && game.scene && game.camera) {
        game.renderer.render(game.scene, game.camera);
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.backgroundColor = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '9999';
    errorDiv.textContent = `Error: ${e.message} at ${e.filename}:${e.lineno}`;
    document.body.appendChild(errorDiv);
});

try {
    init();
} catch (err) {
    console.error(err);
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.backgroundColor = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '9999';
    errorDiv.textContent = `Init Error: ${err.message}`;
    document.body.appendChild(errorDiv);
}
