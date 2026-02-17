import { CONFIG } from './config.js';

// Simple seeded random number generator (mulberry32)
function seededRandom(seed) {
    let s = seed | 0;
    return function () {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export class ParallaxBackground {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Pre-computed layer data (set per level)
        this.clouds = [];
        this.mountainPoints = [];
        this.hillPoints = [];
        this.trees = [];
    }

    setLevel(levelNumber) {
        const rng = seededRandom(levelNumber * 7 + 42);
        this._generateClouds(rng);
        this._generateMountains(rng);
        this._generateHills(rng);
    }

    _generateClouds(rng) {
        this.clouds = [];
        const count = 6 + Math.floor(rng() * 4);
        for (let i = 0; i < count; i++) {
            const bubbleCount = 3 + Math.floor(rng() * 3);
            const bubbles = [];
            for (let b = 0; b < bubbleCount; b++) {
                bubbles.push({
                    dx: (rng() - 0.5) * 30,
                    dy: (rng() - 0.5) * 12,
                    r: 10 + rng() * 14,
                });
            }
            this.clouds.push({
                baseX: rng() * 1400 - 200,
                y: 20 + rng() * 120,
                scale: 0.5 + rng() * 0.6,
                speed: 3 + rng() * 8,
                bubbles,
            });
        }
    }

    _generateMountains(rng) {
        // Generate ridge line points covering a wide area
        this.mountainPoints = [];
        const span = 3000; // wide enough for camera scroll
        const step = 30;
        for (let x = -100; x < span; x += step) {
            const y1 = Math.sin(x * 0.003) * 60;
            const y2 = Math.sin(x * 0.007 + 2) * 35;
            const y3 = Math.sin(x * 0.015 + 5) * 20;
            const peak = rng() * 10;
            this.mountainPoints.push({
                x,
                y: 340 - y1 - y2 - y3 - peak,
            });
        }
    }

    _generateHills(rng) {
        this.hillPoints = [];
        this.trees = [];
        const span = 2000;
        const step = 20;
        for (let x = -100; x < span; x += step) {
            const y1 = Math.sin(x * 0.005) * 40;
            const y2 = Math.sin(x * 0.012 + 3) * 25;
            const hillY = 440 - y1 - y2;
            this.hillPoints.push({ x, y: hillY });

            // Place trees at hilltops (where slope changes from up to down)
            if (this.hillPoints.length >= 3) {
                const prev = this.hillPoints[this.hillPoints.length - 3];
                const mid = this.hillPoints[this.hillPoints.length - 2];
                const curr = this.hillPoints[this.hillPoints.length - 1];
                if (mid.y < prev.y && mid.y < curr.y && rng() > 0.4) {
                    this.trees.push({
                        x: mid.x,
                        y: mid.y,
                        height: 15 + rng() * 20,
                        width: 10 + rng() * 8,
                    });
                }
            }
        }
    }

    render(camera, time) {
        const ctx = this.ctx;
        const cameraX = camera.x;
        const cameraY = camera.y;

        this._drawClouds(ctx, cameraX, cameraY, time);
        this._drawMountains(ctx, cameraX, cameraY);
        this._drawHills(ctx, cameraX, cameraY);
    }

    _drawClouds(ctx, cameraX, cameraY, time) {
        const factor = CONFIG.PARALLAX.CLOUD_FACTOR;

        ctx.save();
        for (const cloud of this.clouds) {
            const cx = cloud.baseX - cameraX * factor + time * cloud.speed;
            // Wrap clouds that drift too far right
            const wrappedX = ((cx + 300) % 1200) - 300;
            const cy = cloud.y - cameraY * factor;

            ctx.globalAlpha = 0.7;
            for (const b of cloud.bubbles) {
                const bx = wrappedX + b.dx * cloud.scale;
                const by = cy + b.dy * cloud.scale;
                const br = b.r * cloud.scale;

                // Cloud shadow
                ctx.fillStyle = CONFIG.COLORS.CLOUD_SHADOW;
                ctx.beginPath();
                ctx.arc(bx + 2, by + 3, br, 0, Math.PI * 2);
                ctx.fill();

                // Cloud body
                ctx.fillStyle = CONFIG.COLORS.CLOUD;
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _drawMountains(ctx, cameraX, cameraY) {
        const factor = CONFIG.PARALLAX.MOUNTAIN_FACTOR;
        const offsetX = cameraX * factor;
        const offsetY = cameraY * factor;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        ctx.save();

        // Back mountain layer (darker, further)
        ctx.fillStyle = CONFIG.COLORS.MOUNTAIN;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (const p of this.mountainPoints) {
            const sx = p.x - offsetX;
            if (sx < -100 || sx > canvasW + 100) continue;
            ctx.lineTo(sx, p.y + 20 - offsetY);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.closePath();
        ctx.fill();

        // Front mountain layer (lighter highlight)
        ctx.fillStyle = CONFIG.COLORS.MOUNTAIN_HIGHLIGHT;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (const p of this.mountainPoints) {
            const sx = p.x - offsetX + 15;
            if (sx < -100 || sx > canvasW + 100) continue;
            ctx.lineTo(sx, p.y + 35 - offsetY);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    _drawHills(ctx, cameraX, cameraY) {
        const factor = CONFIG.PARALLAX.HILLS_FACTOR;
        const offsetX = cameraX * factor;
        const offsetY = cameraY * factor;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        ctx.save();

        // Far hills (darker green)
        ctx.fillStyle = CONFIG.COLORS.HILLS_FAR;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (const p of this.hillPoints) {
            const sx = p.x - offsetX;
            if (sx < -100 || sx > canvasW + 100) continue;
            ctx.lineTo(sx, p.y - offsetY);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.closePath();
        ctx.fill();

        // Near hills highlight
        ctx.fillStyle = CONFIG.COLORS.HILLS_NEAR;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (const p of this.hillPoints) {
            const sx = p.x - offsetX + 10;
            if (sx < -100 || sx > canvasW + 100) continue;
            ctx.lineTo(sx, p.y + 15 - offsetY);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.closePath();
        ctx.fill();

        // Trees
        for (const tree of this.trees) {
            const tx = tree.x - offsetX;
            if (tx < -30 || tx > canvasW + 30) continue;
            const ty = tree.y - offsetY;

            // Trunk
            ctx.fillStyle = '#5C3A1E';
            ctx.fillRect(tx - 2, ty - tree.height * 0.4, 4, tree.height * 0.5);

            // Foliage (triangle)
            ctx.fillStyle = '#1B7A1B';
            ctx.beginPath();
            ctx.moveTo(tx, ty - tree.height);
            ctx.lineTo(tx - tree.width / 2, ty - tree.height * 0.3);
            ctx.lineTo(tx + tree.width / 2, ty - tree.height * 0.3);
            ctx.closePath();
            ctx.fill();

            // Second foliage layer (slightly wider, lower)
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.moveTo(tx, ty - tree.height * 0.75);
            ctx.lineTo(tx - tree.width * 0.6, ty - tree.height * 0.1);
            ctx.lineTo(tx + tree.width * 0.6, ty - tree.height * 0.1);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}
