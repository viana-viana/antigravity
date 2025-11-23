const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const loadingDiv = document.getElementById('loading');

// Game State
let width, height;
let lastTime = 0;
const gameSpeed = 300; // Pixels per second scrolling speed

// Input
const input = {
    x: 0,
    active: false
};

// Assets
const assetNames = ['bird', 'cloud', 'biome_country', 'biome_city', 'biome_snow', 'biome_beach', 'biome_fields'];
const assets = {};

let assetsLoaded = 0;
const totalAssets = assetNames.length;

function onAssetLoad() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        loadingDiv.style.display = 'none';
        startGame();
    }
}

// Load assets
assetNames.forEach(name => {
    assets[name] = new Image();
    assets[name].src = `assets/${name}.png`;
    assets[name].onload = onAssetLoad;
    assets[name].onerror = () => {
        console.warn(`Failed to load ${name}, using placeholder`);
        assetsLoaded++;
        if (assetsLoaded === totalAssets) {
            loadingDiv.style.display = 'none';
            startGame();
        }
    };
});

// Game Objects
const bird = {
    x: 0,
    y: 0,
    targetX: 0,
    width: 64,
    height: 64,
    tilt: 0
};

// Biome System
const biomes = ['biome_country', 'biome_city', 'biome_snow', 'biome_beach', 'biome_fields'];
let currentBiomeIndex = 0;
const groundSegments = []; // Array of { image, y, height }

const clouds = [];

// Resize handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Initial bird position
    if (!input.active) {
        bird.x = width / 2;
        bird.y = height * 0.7;
        input.x = width / 2;
    }
}

window.addEventListener('resize', resize);
resize();

// Input handling
function updateInput(e) {
    input.active = true;
    if (e.type.includes('touch')) {
        input.x = e.touches[0].clientX;
    } else {
        input.x = e.clientX;
    }
}

window.addEventListener('mousemove', updateInput);
window.addEventListener('touchstart', updateInput);
window.addEventListener('touchmove', (e) => { e.preventDefault(); updateInput(e); }, { passive: false });

// Game Loop
function startGame() {
    addGroundSegment(biomes[0], 0);
    requestAnimationFrame(loop);
}

function addGroundSegment(biomeName, startY) {
    const img = assets[biomeName];
    const imgWidth = img.width || 100;
    const imgHeight = img.height || 100;

    const scale = width / imgWidth;
    const scaledHeight = imgHeight * scale;

    let y = startY;
    if (y === undefined) {
        const last = groundSegments[groundSegments.length - 1];
        y = last.y - scaledHeight;
    }

    groundSegments.push({
        image: img,
        name: biomeName,
        y: y,
        height: scaledHeight
    });
}

function loop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(loop);
}

function update(dt) {
    // Scroll Ground
    groundSegments.forEach(seg => {
        seg.y += gameSpeed * dt;
    });

    // Remove segments
    if (groundSegments.length > 0 && groundSegments[0].y > height) {
        groundSegments.shift();
    }

    // Add new segments
    const lastSeg = groundSegments[groundSegments.length - 1];
    if (lastSeg.y > -100) {
        // Count how many of the current biome are at the end
        let count = 0;
        for (let i = groundSegments.length - 1; i >= 0; i--) {
            if (groundSegments[i].name === biomes[currentBiomeIndex]) {
                count++;
            } else {
                break;
            }
        }

        // Switch biome after 1 segment for faster testing
        if (count >= 1) {
            currentBiomeIndex = (currentBiomeIndex + 1) % biomes.length;
        }

        addGroundSegment(biomes[currentBiomeIndex]);
    }

    // Bird Movement
    const lerpSpeed = 5;
    bird.targetX = input.active ? input.x : width / 2;
    bird.x += (bird.targetX - bird.x) * lerpSpeed * dt;

    const dx = bird.targetX - bird.x;
    bird.tilt = -dx * 0.05;
    const maxTilt = 0.5;
    bird.tilt = Math.max(-maxTilt, Math.min(maxTilt, bird.tilt));

    // Clouds
    if (Math.random() < 0.5 * dt) {
        clouds.push({
            x: Math.random() * width,
            y: -100,
            speed: gameSpeed * (1.2 + Math.random() * 0.5),
            scale: 0.5 + Math.random() * 1.0,
            opacity: 0.4 + Math.random() * 0.4
        });
    }

    for (let i = clouds.length - 1; i >= 0; i--) {
        const c = clouds[i];
        c.y += c.speed * dt;
        if (c.y > height + 100) {
            clouds.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Ground Segments
    groundSegments.forEach(seg => {
        if (seg.image.complete && seg.image.naturalWidth !== 0) {
            // Apply Biome Tinting
            ctx.save();
            if (seg.name === 'biome_snow') {
                ctx.filter = 'brightness(1.5) hue-rotate(180deg) saturate(0.5)'; // Make it white/blueish
            } else if (seg.name === 'biome_beach') {
                ctx.filter = 'sepia(1) brightness(1.1)'; // Make it sandy
            } else if (seg.name === 'biome_fields') {
                ctx.filter = 'saturate(2) hue-rotate(-20deg)'; // Make it lush green
            } else if (seg.name === 'biome_city') {
                // Fallback: Tint the country texture to look like a "concrete jungle" or night city
                ctx.filter = 'grayscale(1.0) contrast(1.5) brightness(0.8)';
            }

            let drawImg = seg.image;
            // Use country texture for city if we are faking it
            if (seg.name === 'biome_city' && assets['biome_country'] && assets['biome_country'].complete) {
                drawImg = assets['biome_country'];
            }

            ctx.drawImage(drawImg, 0, seg.y, width, seg.height);
            ctx.restore();
        } else {
            ctx.fillStyle = '#444';
            ctx.fillRect(0, seg.y, width, seg.height);
            ctx.fillStyle = 'white';
            ctx.fillText(seg.name, 10, seg.y + 50);
        }
    });

    // Draw Bird Shadow
    ctx.save();
    ctx.translate(bird.x + 20, bird.y + 20);
    ctx.rotate(bird.tilt);
    ctx.globalAlpha = 0.3;
    if (assets.bird.complete) {
        ctx.drawImage(assets.bird, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    }
    ctx.restore();

    // Draw Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.tilt);
    if (assets.bird.complete) {
        ctx.drawImage(assets.bird, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    }
    ctx.restore();

    // Draw Clouds
    clouds.forEach(c => {
        ctx.save();
        ctx.globalAlpha = c.opacity;
        ctx.translate(c.x, c.y);
        if (assets.cloud.complete) {
            const w = assets.cloud.width * c.scale;
            const h = assets.cloud.height * c.scale;
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(assets.cloud, -w / 2, -h / 2, w, h);
        }
        ctx.restore();
    });

    // Debug Text
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = '20px Arial';
    ctx.strokeText('Biome: ' + biomes[currentBiomeIndex], 20, 40);
    ctx.fillText('Biome: ' + biomes[currentBiomeIndex], 20, 40);
}
