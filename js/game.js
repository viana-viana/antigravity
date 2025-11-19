import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { Player, Enemy, Projectile } from './entities.js';

class Game {
    constructor() {
        this.renderer = new Renderer('gameCanvas');
        this.input = new InputHandler();
        this.width = this.renderer.width;
        this.height = this.renderer.height;

        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];

        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;

        this.enemyTimer = 0;
        this.enemyInterval = 2;

        this.lastTime = 0;

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (!this.gameStarted) {
            if (this.input.isDown('Enter')) {
                this.gameStarted = true;
                this.reset();
            }
            return;
        }

        if (this.gameOver) {
            if (this.input.isDown('Enter')) {
                this.reset();
            }
            return;
        }

        this.player.update(dt);

        // Spawning enemies
        this.enemyTimer -= dt;
        if (this.enemyTimer <= 0) {
            const y = Math.random() * (this.height - 10);
            this.enemies.push(new Enemy(this, this.width, y));
            this.enemyInterval = Math.max(0.5, this.enemyInterval * 0.99); // Get harder
            this.enemyTimer = this.enemyInterval;
        }

        // Update entities
        this.projectiles.forEach(p => p.update(dt));
        this.enemies.forEach(e => e.update(dt));

        // Collision detection
        // Projectiles hitting enemies
        this.projectiles.forEach(p => {
            this.enemies.forEach(e => {
                if (!p.markedForDeletion && !e.markedForDeletion && p.collidesWith(e)) {
                    p.markedForDeletion = true;
                    e.hp--;
                    if (e.hp <= 0) {
                        e.markedForDeletion = true;
                        this.score += 100;
                    }
                }
            });
        });

        // Player hitting enemies
        this.enemies.forEach(e => {
            if (!e.markedForDeletion && this.player.collidesWith(e)) {
                this.gameOver = true;
            }
        });

        // Cleanup
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
    }

    draw() {
        this.renderer.clear();

        if (!this.gameStarted) {
            this.renderer.drawText("SPACE IMPACT", 15, 20);
            this.renderer.drawText("PRESS ENTER", 20, 35);
            return;
        }

        if (this.gameOver) {
            this.renderer.drawText("GAME OVER", 25, 20);
            this.renderer.drawText(`SCORE: ${this.score}`, 20, 30);
            this.renderer.drawText("PRESS ENTER", 20, 40);
            return;
        }

        this.player.draw(this.renderer);
        this.enemies.forEach(e => e.draw(this.renderer));
        this.projectiles.forEach(p => p.draw(this.renderer));

        // UI
        // this.renderer.drawText(`${this.score}`, 1, 8);
    }

    reset() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.score = 0;
        this.gameOver = false;
        this.enemyInterval = 2;
        this.enemyTimer = 0;
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop);
    }
}

new Game();
