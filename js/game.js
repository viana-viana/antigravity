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
        this.lives = 3;
        this.gameState = 'MENU';

        this.levelDuration = 40;
        this.levelTimer = 0;

        this.waveTimer = 0;
        this.currentWave = 0;

        this.lastTime = 0;
        this.playerInvulnerable = 0;

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

        if (this.playerInvulnerable > 0) {
            this.playerInvulnerable -= dt;
        }

        this.player.update(dt);

        // Level Logic
        if (this.gameState === 'PLAYING') {
            this.levelTimer += dt;
            this.waveTimer -= dt;

            // Structured Waves
            if (this.waveTimer <= 0) {
                this.spawnWave();
                this.waveTimer = 4; // New wave every 4 seconds
            }

            if (this.levelTimer >= this.levelDuration) {
                this.gameState = 'BOSS_WARNING';
                this.enemies = [];
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
        this.checkCollisions();

        // Cleanup
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.enemyProjectiles = this.enemyProjectiles.filter(p => !p.markedForDeletion);
    }

    spawnWave() {
        const pattern = Math.floor(Math.random() * 3);
        const yStart = 5 + Math.random() * (this.height - 20);

        if (pattern === 0) {
            // Line
            for (let i = 0; i < 3; i++) {
                this.enemies.push(new Enemy(this, this.width + i * 15, yStart, 'basic'));
            }
        } else if (pattern === 1) {
            // V Formation
            this.enemies.push(new Enemy(this, this.width, yStart, 'squid'));
            this.enemies.push(new Enemy(this, this.width + 10, yStart - 10, 'squid'));
            this.enemies.push(new Enemy(this, this.width + 10, yStart + 10, 'squid'));
        } else {
            // Heavy
            this.enemies.push(new Enemy(this, this.width, yStart, 'skull'));
            this.enemies.push(new Enemy(this, this.width + 15, yStart, 'skull'));
        }
    }

    checkCollisions() {
        // Projectiles hitting enemies
        this.projectiles.forEach(p => {
            this.enemies.forEach(e => {
                if (!p.markedForDeletion && !e.markedForDeletion && p.collidesWith(e)) {
                    p.markedForDeletion = true;
                    e.hp--;
                    if (e.hp <= 0) {
                        e.markedForDeletion = true;
                        this.score += (e.type === 'skull' ? 300 : 100);
                    }
                }
            });

            if (this.boss && !p.markedForDeletion && p.collidesWith(this.boss)) {
                p.markedForDeletion = true;
                this.boss.hp--;
            }
        });

        if (this.playerInvulnerable > 0) return;

        // Player hitting enemies
        let hit = false;
        this.enemies.forEach(e => {
            if (!e.markedForDeletion && this.player.collidesWith(e)) {
                e.markedForDeletion = true;
                hit = true;
            }
        });

        this.enemyProjectiles.forEach(p => {
            if (!p.markedForDeletion && this.player.collidesWith(p)) {
                p.markedForDeletion = true;
                hit = true;
            }
        });

        if (this.boss && this.player.collidesWith(this.boss)) {
            hit = true;
        }

        if (hit) {
            this.lives--;
            this.playerInvulnerable = 2; // 2 seconds invulnerability
            if (this.lives <= 0) {
                this.gameState = 'GAMEOVER';
            }
        }
    }

    draw() {
        this.renderer.clear();

        if (this.gameState === 'MENU') {
            this.renderer.drawText("SPACE IMPACT", 15, 15);
            this.renderer.drawText("PRESS ENTER", 20, 30);
            return;
        }

        if (this.gameState === 'GAMEOVER') {
            this.renderer.drawText("GAME OVER", 25, 15);
            this.renderer.drawText(`SCORE: ${this.score}`, 20, 25);
            this.renderer.drawText("PRESS ENTER", 20, 35);
            return;
        }

        if (this.gameState === 'LEVEL_COMPLETE') {
            this.renderer.drawText("LEVEL CLEARED!", 10, 15);
            this.renderer.drawText(`SCORE: ${this.score}`, 20, 25);
            this.renderer.drawText("PRESS ENTER", 20, 35);
            return;
        }

        if (this.gameState === 'BOSS_WARNING') {
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                this.renderer.drawText("WARNING!", 25, 20);
            }
        }

        // Draw Entities
        if (this.playerInvulnerable <= 0 || Math.floor(Date.now() / 100) % 2 === 0) {
            this.player.draw(this.renderer);
        }

        this.enemies.forEach(e => e.draw(this.renderer));
        this.projectiles.forEach(p => p.draw(this.renderer));
        this.enemyProjectiles.forEach(p => p.draw(this.renderer));

        if (this.boss) {
            this.boss.draw(this.renderer);
        }

        // UI HUD
        this.renderer.drawText(`${this.score}`, 1, 8);
        // Draw Lives (Hearts)
        for (let i = 0; i < this.lives; i++) {
            this.renderer.drawRect(70 + (i * 5), 2, 3, 3); // Simple square hearts
        }
    }

    reset() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.boss = null;
        this.score = 0;
        this.lives = 3;
        this.levelTimer = 0;
        this.waveTimer = 0;
        this.playerInvulnerable = 0;
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
