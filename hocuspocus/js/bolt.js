export class Bolt {
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
