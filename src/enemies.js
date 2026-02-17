import { CONFIG } from './config.js';
import { SpriteRenderer } from './sprites.js';

export class Enemy {
    constructor(x, y, type = 'goomba') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = CONFIG.ENEMY_WIDTH;
        this.height = CONFIG.ENEMY_HEIGHT;
        this.health = 1;
        this.contactDamage = 10;
        this.stompDamageTaken = 1;
        this.spriteType = type === 'koopa' ? 'koopa' : 'goomba';
        this.chaseRange = 120;
        this.chaseHeightTolerance = 60;
        this.canJump = false;
        this.jumpInterval = 0;
        this.jumpPower = 0;
        this.jumpTimer = 0;
        this.baseSpeed = CONFIG.ENEMY_SPEED;
        this.state = 'patrol';
        this.applyTypeStats();

        // Physics
        this.velocityX = this.baseSpeed;
        this.velocityY = 0;
        this.isGrounded = false;

        // AI
        this.patrolLeft = x - CONFIG.ENEMY_PATROL_DISTANCE;
        this.patrolRight = x + CONFIG.ENEMY_PATROL_DISTANCE;
        this.direction = 1; // 1 = right, -1 = left

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
    }
    
    applyTypeStats() {
        if (this.type === 'goomba') {
            this.health = 1;
            this.baseSpeed = 1.3;
            this.contactDamage = 10;
            this.stompDamageTaken = 1;
            this.spriteType = 'goomba';
        } else if (this.type === 'koopa') {
            this.health = 2;
            this.baseSpeed = 1.1;
            this.contactDamage = 10;
            this.stompDamageTaken = 1;
            this.spriteType = 'koopa';
        } else if (this.type === 'runner') {
            this.health = 1;
            this.baseSpeed = 2.2;
            this.contactDamage = 10;
            this.stompDamageTaken = 1;
            this.chaseRange = 170;
            this.spriteType = 'goomba';
        } else if (this.type === 'tank') {
            this.health = 3;
            this.baseSpeed = 0.9;
            this.contactDamage = 15;
            this.stompDamageTaken = 1;
            this.chaseRange = 90;
            this.spriteType = 'koopa';
        } else if (this.type === 'jumper') {
            this.health = 2;
            this.baseSpeed = 1.4;
            this.contactDamage = 12;
            this.stompDamageTaken = 1;
            this.canJump = true;
            this.jumpInterval = 1.2;
            this.jumpPower = 7.5;
            this.spriteType = 'goomba';
        } else if (this.type === 'boss') {
            this.width = CONFIG.ENEMY_WIDTH * 2;
            this.height = CONFIG.ENEMY_HEIGHT * 2;
            this.health = 6;
            this.baseSpeed = 1.0;
            this.contactDamage = 20;
            this.stompDamageTaken = 1;
            this.canJump = true;
            this.jumpInterval = 0.9;
            this.jumpPower = 8.5;
            this.chaseRange = 240;
            this.chaseHeightTolerance = 90;
            this.spriteType = 'koopa';
        }
    }

    update(dt, player, platforms) {
        // Gravity
        if (!this.isGrounded) {
            this.velocityY += CONFIG.GRAVITY;
            this.velocityY = Math.min(this.velocityY, CONFIG.PLAYER_MAX_VELOCITY_Y);
        }

        // Chasing behavior when player is nearby
        if (player) {
            const dx = player.x - this.x;
            const dy = Math.abs(player.y - this.y);
            if (Math.abs(dx) < this.chaseRange && dy < this.chaseHeightTolerance) {
                this.direction = dx >= 0 ? 1 : -1;
                this.state = 'chase';
            } else {
                this.state = 'patrol';
            }
        }
        
        const speedMultiplier = this.state === 'chase' ? 1.25 : 1;
        this.velocityX = this.direction * this.baseSpeed * speedMultiplier;
        
        // Jumpers and boss enemies periodically hop
        if (this.canJump && this.isGrounded) {
            this.jumpTimer += dt;
            if (this.jumpTimer >= this.jumpInterval) {
                this.velocityY = -this.jumpPower;
                this.isGrounded = false;
                this.jumpTimer = 0;
            }
        }
        
        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Reset grounded — wordt gezet door platform collision
        this.isGrounded = false;

        // Platform collision
        for (const platform of platforms) {
            if (platform.type === 'spike') continue;
            this.resolvePlatformCollision(platform);
        }

        // Draai om bij patrouillegrens (alleen als op de grond)
        if (this.isGrounded) {
            if (this.direction === 1 && this.x > this.patrolRight) {
                this.direction = -1;
            } else if (this.direction === -1 && this.x < this.patrolLeft) {
                this.direction = 1;
            }

            // Draai ook om als de vloer voor ons wegvalt (klif detectie)
            const edgeCheckX = this.direction === 1
                ? this.x + this.width + 1
                : this.x - 1;
            const edgeCheckY = this.y + this.height + 2;

            let floorAhead = false;
            for (const platform of platforms) {
                const p = platform.getRect();
                if (edgeCheckX >= p.x && edgeCheckX <= p.x + p.width &&
                    edgeCheckY >= p.y && edgeCheckY <= p.y + p.height) {
                    floorAhead = true;
                    break;
                }
            }
            if (!floorAhead) {
                this.direction *= -1;
            }
        }

        // Animation
        this.animationTimer += dt;
        if (this.animationTimer > 0.2) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
    }

    resolvePlatformCollision(platform) {
        const p = platform.getRect();

        // AABB check
        if (this.x + this.width <= p.x || this.x >= p.x + p.width ||
            this.y + this.height <= p.y || this.y >= p.y + p.height) {
            return;
        }

        const overlapTop    = (this.y + this.height) - p.y;
        const overlapBottom = (p.y + p.height) - this.y;
        const overlapLeft   = (this.x + this.width) - p.x;
        const overlapRight  = (p.x + p.width) - this.x;

        const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

        if (minOverlap === overlapTop) {
            // Landt op platform
            this.y = p.y - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
        } else if (minOverlap === overlapBottom) {
            this.y = p.y + p.height;
            this.velocityY = 0;
        } else if (minOverlap === overlapLeft) {
            // Muur aan de rechterkant — draai om
            this.x = p.x - this.width;
            this.velocityX = 0;
            this.direction = -1;
        } else if (minOverlap === overlapRight) {
            // Muur aan de linkerkant — draai om
            this.x = p.x + p.width;
            this.velocityX = 0;
            this.direction = 1;
        }
    }

    isCollidingWith(player) {
        const eRect = this.getRect();
        const pRect = player.getRect();

        return !(
            eRect.x + eRect.width < pRect.x ||
            eRect.x > pRect.x + pRect.width ||
            eRect.y + eRect.height < pRect.y ||
            eRect.y > pRect.y + pRect.height
        );
    }

    render(renderer, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (!camera.isVisible(this.x, this.y, this.width, this.height)) {
            return;
        }

        // Draw enemy using sprite renderer
        if (this.spriteType === 'goomba') {
            SpriteRenderer.drawGoomba(renderer.ctx, screenX, screenY, this.width, this.height, this.animationFrame);
        } else if (this.spriteType === 'koopa') {
            SpriteRenderer.drawKoopa(renderer.ctx, screenX, screenY, this.width, this.height, this.animationFrame);
        }
        
        // Simple indicator for custom enemy types
        if (this.type !== 'goomba' && this.type !== 'koopa') {
            const ctx = renderer.ctx;
            ctx.fillStyle = this.type === 'boss' ? '#FF4444' : '#FFD700';
            ctx.fillRect(screenX, screenY - 4, Math.max(8, this.width * 0.5), 3);
        }
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
}

export class EnemyManager {
    constructor(enemyData) {
        this.enemies = [];
        this.loadEnemies(enemyData);
    }

    loadEnemies(enemyData) {
        for (const e of enemyData) {
            this.enemies.push(new Enemy(e.x, e.y, e.type || 'goomba'));
        }
    }

    update(dt, player, platforms) {
        for (const enemy of this.enemies) {
            enemy.update(dt, player, platforms || []);
        }
    }

    checkPlayerCollision(player) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.isCollidingWith(player)) {
                // Check if player jumped on enemy (coming from above)
                if (player.velocityY > 0 && player.y + player.height - 8 < enemy.y + 8) {
                    // Player stomp damages enemy and bounces.
                    enemy.health -= enemy.stompDamageTaken;
                    player.velocityY = -5; // Bounce
                    if (enemy.health <= 0) {
                        this.enemies.splice(i, 1);
                    }
                } else {
                    // Enemy hit player from side
                    player.takeDamage(enemy.contactDamage || 10);
                }
            }
        }
    }

    render(renderer, camera) {
        for (const enemy of this.enemies) {
            enemy.render(renderer, camera);
        }
    }
}
