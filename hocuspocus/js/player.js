import { Bolt } from './bolt.js';

export class Player {
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
