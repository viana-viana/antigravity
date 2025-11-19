import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { Player, Enemy, Projectile, Boss, EnemyProjectile } from './entities.js';

class Game {
    constructor() {
        this.renderer = new Renderer('gameCanvas');
        this.input = new InputHandler();
        this.width = this.renderer.width;
        this.height = this.renderer.height;

        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.boss = null;

        this.score = 0;
        this.gameState = 'MENU'; // MENU, PLAYING, BOSS_WARNING, BOSS, LEVEL_COMPLETE, GAMEOVER

        this.levelDuration = 30; // Seconds of waves before boss
        this.levelTimer = 0;

        this.enemyTimer = 0;
        this.enemyInterval = 2;

        this.lastTime = 0;

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (this.gameState === 'MENU') {
            if (this.input.isDown('Enter')) {
                this.gameState = 'PLAYING';
                this.reset();
            }
            return;
        }

        if (this.gameState === 'GAMEOVER' || this.gameState === 'LEVEL_COMPLETE') {
            if (this.input.isDown('Enter')) {
                this.gameState = 'PLAYING';
                this.reset();
            }
            return;
        }

        this.player.update(dt);

        // Level Logic
        if (this.gameState === 'PLAYING') {
            this.levelTimer += dt;

            // Spawning enemies
            this.enemyTimer -= dt;
            if (this.enemyTimer <= 0) {
                const y = Math.random() * (this.height - 10);
                this.enemies.push(new Enemy(this, this.width, y));
                this.enemyInterval = Math.max(0.5, this.enemyInterval * 0.99);
                this.enemyTimer = this.enemyInterval;
            }

            if (this.levelTimer >= this.levelDuration) {
                this.gameState = 'BOSS_WARNING';
                this.enemies = []; // Clear small enemies
                this.enemyProjectiles = [];
                setTimeout(() => {
                    this.gameState = 'BOSS';
                    this.boss = new Boss(this, this.width + 20, this.height / 2 - 7);
                }, 3000);
            }
        } else if (this.gameState === 'BOSS') {
            if (this.boss) {
                this.boss.update(dt);
                if (this.boss.hp <= 0) {
                    this.score += 1000;
                    this.boss = null;
                    this.gameState = 'LEVEL_COMPLETE';
                }
            }
        }

        // Update entities
        this.projectiles.forEach(p => p.update(dt));
        this.enemies.forEach(e => e.update(dt));
        this.enemyProjectiles.forEach(p => p.update(dt));

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

            // Projectiles hitting Boss
            if (this.boss && !p.markedForDeletion && p.collidesWith(this.boss)) {
                p.markedForDeletion = true;
                this.boss.hp--;
            }
        });

        // Player hitting enemies
        this.enemies.forEach(e => {
            if (!e.markedForDeletion && this.player.collidesWith(e)) {
                this.gameState = 'GAMEOVER';
            }
        });

        // Player hitting enemy projectiles
        this.enemyProjectiles.forEach(p => {
            if (!p.markedForDeletion && this.player.collidesWith(p)) {
                this.gameState = 'GAMEOVER';
            }
        });

        // Player hitting Boss
        if (this.boss && this.player.collidesWith(this.boss)) {
            this.gameState = 'GAMEOVER';
        }

        // Cleanup
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.enemyProjectiles = this.enemyProjectiles.filter(p => !p.markedForDeletion);
    }

    draw() {
        this.renderer.clear();

        if (this.gameState === 'MENU') {
            this.renderer.drawText("SPACE IMPACT", 15, 20);
            this.renderer.drawText("PRESS ENTER", 20, 35);
            return;
        }

        if (this.gameState === 'GAMEOVER') {
            this.renderer.drawText("GAME OVER", 25, 20);
            this.renderer.drawText(`SCORE: ${this.score}`, 20, 30);
            this.renderer.drawText("PRESS ENTER", 20, 40);
            return;
        }

        if (this.gameState === 'LEVEL_COMPLETE') {
            this.renderer.drawText("LEVEL CLEARED!", 10, 20);
            this.renderer.drawText(`SCORE: ${this.score}`, 20, 30);
            this.renderer.drawText("PRESS ENTER", 20, 40);
            return;
        }

        if (this.gameState === 'BOSS_WARNING') {
            if (Math.floor(Date.now() / 500) % 2 === 0) { // Blink effect
                this.renderer.drawText("WARNING!", 25, 25);
            }
        }

        this.player.draw(this.renderer);
        this.enemies.forEach(e => e.draw(this.renderer));
        this.projectiles.forEach(p => p.draw(this.renderer));
        this.enemyProjectiles.forEach(p => p.draw(this.renderer));

        if (this.boss) {
            this.boss.draw(this.renderer);
        }

        // UI
        // this.renderer.drawText(`${this.score}`, 1, 8);
    }

    reset() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.boss = null;
        this.score = 0;
        this.enemyInterval = 2;
        this.enemyTimer = 0;
        this.levelTimer = 0;
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
