import { CONFIG } from './config.js';
import { SpriteRenderer } from './sprites.js';

export class Collectible {
    constructor(x, y, type = 'coin') {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.type = type; // 'coin', 'key', 'powerup'
        this.collected = false;

        // Animation
        this.bounceTimer = 0;
        this.bounceAmount = 0;
        this.spinFrame = 0;
        this.spinTimer = 0;
    }

    update(dt) {
        if (this.collected) return;

        // Bounce animation
        this.bounceTimer += dt;
        this.bounceAmount = Math.sin(this.bounceTimer * 6) * 2;

        // Spin animation
        this.spinTimer += dt;
        if (this.spinTimer > 0.15) {
            this.spinFrame = (this.spinFrame + 1) % 4;
            this.spinTimer = 0;
        }
    }

    isCollidingWith(player) {
        if (this.collected) return false;

        const cRect = this.getRect();
        const pRect = player.getRect();

        return !(
            cRect.x + cRect.width < pRect.x ||
            cRect.x > pRect.x + pRect.width ||
            cRect.y + cRect.height < pRect.y ||
            cRect.y > pRect.y + pRect.height
        );
    }

    render(renderer, camera) {
        if (this.collected) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + this.bounceAmount;

        if (!camera.isVisible(this.x, this.y, this.width, this.height)) {
            return;
        }

        if (this.type === 'coin') {
            // Draw coin using sprite renderer
            SpriteRenderer.drawCoin(renderer.ctx, screenX, screenY, this.width, this.height, this.spinFrame);
        } else if (this.type === 'key') {
            // Draw key (golden)
            renderer.ctx.fillStyle = '#FFD700';
            renderer.ctx.fillRect(screenX + 1, screenY + 3, 6, 2);
            renderer.ctx.fillRect(screenX + 1, screenY + 1, 2, 6);
        } else if (this.type === 'powerup') {
            // Draw power-up star
            renderer.ctx.fillStyle = '#FF00FF';
            renderer.ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
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

export class CollectibleManager {
    constructor(collectibleData) {
        this.collectibles = [];
        this.loadCollectibles(collectibleData);
    }

    loadCollectibles(collectibleData) {
        for (const c of collectibleData) {
            this.collectibles.push(new Collectible(c.x, c.y, c.type || 'coin'));
        }
    }

    update(dt) {
        for (const collectible of this.collectibles) {
            collectible.update(dt);
        }
    }

    checkPlayerCollision(player) {
        let coinsCollected = 0;

        for (const collectible of this.collectibles) {
            if (collectible.isCollidingWith(player)) {
                collectible.collected = true;

                if (collectible.type === 'coin') {
                    coinsCollected++;
                } else if (collectible.type === 'key') {
                    // Key unlocks the goal
                    player.hasKey = true;
                }
            }
        }

        return coinsCollected;
    }

    render(renderer, camera) {
        for (const collectible of this.collectibles) {
            collectible.render(renderer, camera);
        }
    }
}
