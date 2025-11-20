// --- GAME STATE ---
const game = {
    scene: null, camera: null, renderer: null,
    player: null, world: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2()
};

function init() {
    game.scene = new THREE.Scene();
    game.scene.background = new THREE.Color(0x87CEEB);
    game.scene.fog = new THREE.Fog(0x87CEEB, 15, 60);

    const aspect = window.innerWidth / window.innerHeight;
    game.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    game.camera.position.set(10, 10, 10);
    game.camera.lookAt(0, 0, 0);

    game.renderer = new THREE.WebGLRenderer({ antialias: true });
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    game.renderer.shadowMap.enabled = true;
    game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(game.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    game.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 30, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    game.scene.add(dirLight);

    game.world = createWorld(game.scene);
    createNPCs(game.scene, game.world);
    game.player = createPlayer(game.scene);
    setupInteraction(game);

    window.addEventListener('resize', () => {
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = game.clock.getDelta();
    if (game.player) updatePlayer(game.player, delta, game.camera);
    if (game.world) updateWorld(game.world, delta);
    game.renderer.render(game.scene, game.camera);
}

// Start
init();
