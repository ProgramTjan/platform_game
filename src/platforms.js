import { CONFIG } from './config.js';
import { SpriteRenderer } from './sprites.js';

export class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'normal', 'spike', 'oneway'
    }

    render(renderer, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Only render if visible
        if (!camera.isVisible(this.x, this.y, this.width, this.height)) {
            return;
        }

        // Use sprite renderer for platform tiles
        const numTiles = Math.ceil(this.width / 16);
        for (let i = 0; i < numTiles; i++) {
            const tileWidth = Math.min(16, this.width - (i * 16));
            const tileHeight = this.height;

            SpriteRenderer.drawPlatformTile(
                renderer.ctx,
                screenX + (i * 16),
                screenY,
                tileWidth,
                tileHeight,
                this.type
            );
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

export class PlatformManager {
    constructor(platformData) {
        this.platforms = [];
        this.loadPlatforms(platformData);
    }

    loadPlatforms(platformData) {
        for (const p of platformData) {
            this.platforms.push(
                new Platform(p.x, p.y, p.width, p.height, p.type || 'normal')
            );
        }
    }

    checkCollisions(player) {
        for (const platform of this.platforms) {
            if (this.isColliding(player, platform)) {
                this.handleCollision(player, platform);
            }
        }
    }

    isColliding(player, platform) {
        const pRect = player.getRect();
        const plRect = platform.getRect();

        return !(
            pRect.x + pRect.width < plRect.x ||
            pRect.x > plRect.x + plRect.width ||
            pRect.y + pRect.height < plRect.y ||
            pRect.y > plRect.y + plRect.height
        );
    }

    handleCollision(player, platform) {
        // Handle spike platforms (instant damage)
        if (platform.type === 'spike') {
            player.takeDamage(10);
            return;
        }

        const pRect = player.getRect();
        const plRect = platform.getRect();

        // Determine collision side
        const overlapLeft = pRect.x + pRect.width - plRect.x;
        const overlapRight = plRect.x + plRect.width - pRect.x;
        const overlapTop = pRect.y + pRect.height - plRect.y;
        const overlapBottom = plRect.y + plRect.height - pRect.y;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop) {
            // Collision from above (landing on platform)
            player.y = plRect.y - pRect.height;
            player.velocityY = 0;
            player.setGrounded(true);
        } else if (minOverlap === overlapBottom) {
            // Collision from below (hit head)
            player.y = plRect.y + plRect.height;
            player.velocityY = 0;
        } else if (minOverlap === overlapLeft) {
            // Collision from left
            player.x = plRect.x - pRect.width;
            player.velocityX = 0;
        } else if (minOverlap === overlapRight) {
            // Collision from right
            player.x = plRect.x + plRect.width;
            player.velocityX = 0;
        }
    }

    render(renderer, camera) {
        for (const platform of this.platforms) {
            platform.render(renderer, camera);
        }
    }
}
