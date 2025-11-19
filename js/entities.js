export class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
    }

    update(dt) { }

    draw(renderer) {
        renderer.drawRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

export class Player extends Entity {
    constructor(game) {
        super(5, 20, 8, 5); // Approximate size
        this.game = game;
        this.speed = 30;
        this.cooldown = 0;

        // Simple ship sprite
        this.sprite = [
            [0, 0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0, 0]
        ];
        this.width = 8;
        this.height = 5;
    }

    update(dt) {
        if (this.game.input.isDown('ArrowUp')) this.y -= this.speed * dt;
        if (this.game.input.isDown('ArrowDown')) this.y += this.speed * dt;
        if (this.game.input.isDown('ArrowLeft')) this.x -= this.speed * dt;
        if (this.game.input.isDown('ArrowRight')) this.x += this.speed * dt;

        // Bounds checking
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));

        // Shooting
        if (this.cooldown > 0) this.cooldown -= dt;
        if (this.game.input.isDown('Space') && this.cooldown <= 0) {
            this.game.projectiles.push(new Projectile(this.x + this.width, this.y + 2));
            this.cooldown = 0.3;
        }
    }

    draw(renderer) {
        renderer.drawSprite(this.x, this.y, this.sprite);
    }
}

export class Projectile extends Entity {
    constructor(x, y) {
        super(x, y, 3, 1);
        this.speed = 80;
    }

    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 100) this.markedForDeletion = true;
    }

    draw(renderer) {
        renderer.drawRect(this.x, this.y, this.width, this.height);
    }
}

export class Enemy extends Entity {
    constructor(game, x, y) {
        super(x, y, 6, 5);
        this.game = game;
        this.speed = 15;
        this.hp = 1;

        // Simple enemy sprite
        this.sprite = [
            [0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0]
        ];
        this.width = 6;
        this.height = 5;
    }

    update(dt) {
        this.x -= this.speed * dt;
        if (this.x < -10) this.markedForDeletion = true;
    }

    draw(renderer) {
        renderer.drawSprite(this.x, this.y, this.sprite);
    }
}
