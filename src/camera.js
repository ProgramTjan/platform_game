import { CONFIG } from './config.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
    }

    follow(player, canvas) {
        // Horizontaal volgen
        const targetX = player.x - CONFIG.CAMERA_PADDING;
        const smoothing = 0.1;
        this.x += (targetX - this.x) * smoothing;
        this.x = Math.max(0, this.x);

        // Verticaal volgen - centreer speler verticaal met voorkeur voor grond
        const targetY = player.y - this.height * 0.6;
        this.y += (targetY - this.y) * smoothing;
        // Begrens camera: niet boven het level, niet onder de grond (grond=600, canvas=450)
        this.y = Math.max(0, Math.min(this.y, 200));
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y,
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y,
        };
    }

    isVisible(x, y, width, height) {
        return !(
            x + width < this.x ||
            x > this.x + this.width ||
            y + height < this.y ||
            y > this.y + this.height
        );
    }
}
