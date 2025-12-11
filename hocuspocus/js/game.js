// --- Utils ---
function rectIntersect(r1, r2) {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// --- InputHandler ---
class InputHandler {
    constructor() {
        this.keys = {};

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isDown(code) {
        return !!this.keys[code];
    }
}

// --- Bolt ---
class Bolt {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 6;
        this.speed = 6;
        this.direction = direction; // 1 for right, -1 for left
        this.active = true;
        this.lifeTime = 60; // Frames to live
    }

    update() {
        this.x += this.speed * this.direction;
        this.lifeTime--;

        if (this.lifeTime <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#0ff'; // Cyan color for lightning
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);

        // Add a white core
        ctx.fillStyle = '#fff';
        ctx.fillRect(Math.round(this.x) + 2, Math.round(this.y) + 2, this.width - 4, this.height - 4);
    }
}

// --- Player ---
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24;
        this.vx = 0;
        this.vy = 0;
        this.speed = 2;
        this.jumpForce = -6; // Adjusted for 320x200 resolution
        this.gravity = 0.25;
        this.grounded = false;
        this.facingRight = true;

        this.bolts = [];
        this.shootCooldown = 0;
    }

    update(input, level) {
        // Horizontal Movement
        if (input.isDown('ArrowLeft')) {
            this.vx = -this.speed;
            this.facingRight = false;
        } else if (input.isDown('ArrowRight')) {
            this.vx = this.speed;
            this.facingRight = true;
        } else {
            this.vx = 0;
        }

        // Jumping
        if (input.isDown('KeyZ') && this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }

        // Shooting
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (input.isDown('KeyX') && this.shootCooldown <= 0) {
            this.shoot();
        }

        // Update Bolts
        this.bolts.forEach(bolt => bolt.update());
        this.bolts = this.bolts.filter(bolt => bolt.active);

        // Apply Gravity
        this.vy += this.gravity;

        // Apply Velocity
        this.x += this.vx;
        this.handleCollisions(level, 'x');

        this.y += this.vy;
        this.handleCollisions(level, 'y');

        // Screen bounds (temporary)
        if (this.y > 200) { // Reset if falls off
            this.y = 0;
            this.vy = 0;
        }
    }

    shoot() {
        const dir = this.facingRight ? 1 : -1;
        const startX = this.facingRight ? this.x + this.width : this.x - 12;
        const startY = this.y + 8;
        this.bolts.push(new Bolt(startX, startY, dir));
        this.shootCooldown = 20; // Frames between shots
    }

    handleCollisions(level, axis) {
        // Simple tile collision logic to be implemented
        // For now, just floor collision at y=160
        if (this.y + this.height > 160) {
            this.y = 160 - this.height;
            this.vy = 0;
            this.grounded = true;
        }
    }

    draw(ctx) {
        // Draw Bolts
        this.bolts.forEach(bolt => bolt.draw(ctx));

        // Draw Player
        ctx.fillStyle = 'red';
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);

        // Eyes to show direction
        ctx.fillStyle = 'white';
        const eyeOffset = this.facingRight ? 8 : 2;
        ctx.fillRect(Math.round(this.x) + eyeOffset, Math.round(this.y) + 4, 4, 4);

        // Wizard Hat (Triangle)
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y - 10);
        ctx.fill();
    }
}

// --- Level ---
class Level {
    constructor() {
        this.tiles = [];
        this.tileSize = 16;
        // Placeholder level data
    }

    update() {
        // Update level animations or entities
    }

    draw(ctx) {
        // Draw Background
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, 320, 200);

        // Draw Floor (Placeholder)
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 160, 320, 40);

        // Draw some platforms
        ctx.fillStyle = '#666';
        ctx.fillRect(100, 120, 60, 10);
        ctx.fillRect(200, 90, 60, 10);
    }

    checkCollision(rect) {
        // Return collision info
        return false;
    }
}

// --- Game Loop ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const input = new InputHandler();
const level = new Level();
const player = new Player(50, 100);

function gameLoop() {
    // Update
    player.update(input, level);
    level.update();

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    level.draw(ctx);
    player.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
