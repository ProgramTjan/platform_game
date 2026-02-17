// Sprite renderer - draws detailed pixel art style characters with frame-based animations
export class SpriteRenderer {

    // ─── PLAYER (16x24) ───────────────────────────────────────────────
    static drawPlayer(ctx, x, y, width, height, facingRight = true, state = 'idle', animationFrame = 0) {
        ctx.save();

        // Flip for direction
        let drawX = x;
        let drawY = y;
        if (!facingRight) {
            ctx.translate(x + width, y);
            ctx.scale(-1, 1);
            drawX = 0;
            drawY = 0;
        }

        this._drawPlayerHat(ctx, drawX, drawY);
        this._drawPlayerFace(ctx, drawX, drawY);
        this._drawPlayerTorso(ctx, drawX, drawY);
        this._drawPlayerArms(ctx, drawX, drawY, state, animationFrame);
        this._drawPlayerLegs(ctx, drawX, drawY, state, animationFrame);

        ctx.restore();
    }

    static _drawPlayerHat(ctx, x, y) {
        // Hat brim (red, wide)
        ctx.fillStyle = '#E52521';
        ctx.fillRect(x + 1, y, 14, 3);
        // Hat top
        ctx.fillRect(x + 3, y - 2, 10, 3);
        // Hat highlight
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(x + 4, y - 1, 6, 1);
    }

    static _drawPlayerFace(ctx, x, y) {
        // Hair sides
        ctx.fillStyle = '#6B3304';
        ctx.fillRect(x + 1, y + 3, 3, 3);
        ctx.fillRect(x + 12, y + 3, 3, 3);

        // Face (skin)
        ctx.fillStyle = '#FFB87A';
        ctx.fillRect(x + 3, y + 3, 10, 5);

        // Eyes (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 5, y + 4, 3, 2);
        ctx.fillRect(x + 9, y + 4, 3, 2);

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 7, y + 4, 1, 2);
        ctx.fillRect(x + 11, y + 4, 1, 2);

        // Nose
        ctx.fillStyle = '#E8956B';
        ctx.fillRect(x + 8, y + 6, 2, 1);

        // Mustache
        ctx.fillStyle = '#6B3304';
        ctx.fillRect(x + 4, y + 7, 8, 1);
    }

    static _drawPlayerTorso(ctx, x, y) {
        // Red shirt
        ctx.fillStyle = '#E52521';
        ctx.fillRect(x + 3, y + 8, 10, 3);

        // Blue overalls
        ctx.fillStyle = '#2038EC';
        ctx.fillRect(x + 2, y + 11, 12, 5);

        // Overall straps
        ctx.fillStyle = '#2038EC';
        ctx.fillRect(x + 3, y + 9, 2, 2);
        ctx.fillRect(x + 11, y + 9, 2, 2);

        // Overall buttons (yellow)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 5, y + 12, 1, 1);
        ctx.fillRect(x + 10, y + 12, 1, 1);

        // Belt
        ctx.fillStyle = '#1A1A8E';
        ctx.fillRect(x + 2, y + 15, 12, 1);
    }

    static _drawPlayerArms(ctx, x, y, state, frame) {
        ctx.fillStyle = '#FFB87A';

        if (state === 'jumping') {
            // Arms raised
            ctx.fillRect(x, y + 6, 2, 4);
            ctx.fillRect(x + 14, y + 6, 2, 4);
        } else if (state === 'falling') {
            // Arms spread out
            ctx.fillRect(x - 1, y + 9, 3, 3);
            ctx.fillRect(x + 14, y + 9, 3, 3);
        } else if (state === 'walking') {
            // Arms swing with walk
            const swing = (frame % 2 === 0) ? 0 : 2;
            ctx.fillRect(x, y + 9 + swing, 2, 4);
            ctx.fillRect(x + 14, y + 9 + (2 - swing), 2, 4);
        } else {
            // Idle arms at sides
            ctx.fillRect(x, y + 9, 2, 5);
            ctx.fillRect(x + 14, y + 9, 2, 5);
        }
    }

    static _drawPlayerLegs(ctx, x, y, state, frame) {
        if (state === 'jumping') {
            // Legs tucked
            ctx.fillStyle = '#2038EC';
            ctx.fillRect(x + 3, y + 16, 4, 3);
            ctx.fillRect(x + 9, y + 16, 4, 3);
            // Shoes
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 2, y + 19, 5, 3);
            ctx.fillRect(x + 9, y + 19, 5, 3);
        } else if (state === 'falling') {
            // Legs dangling
            ctx.fillStyle = '#2038EC';
            ctx.fillRect(x + 3, y + 16, 4, 4);
            ctx.fillRect(x + 9, y + 16, 4, 4);
            // Shoes pointing down
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 3, y + 20, 4, 3);
            ctx.fillRect(x + 9, y + 20, 4, 3);
            ctx.fillStyle = '#6B3304';
            ctx.fillRect(x + 3, y + 22, 4, 1);
            ctx.fillRect(x + 9, y + 22, 4, 1);
        } else if (state === 'walking') {
            // 4-frame walk cycle
            const legFrames = [
                // Frame 0: left forward, right back
                { lx: 2, ly: 16, rx: 10, ry: 17 },
                // Frame 1: legs together (passing)
                { lx: 4, ly: 16, rx: 8, ry: 16 },
                // Frame 2: right forward, left back
                { lx: 4, ly: 17, rx: 8, ry: 16 },
                // Frame 3: legs together (other pass)
                { lx: 4, ly: 16, rx: 8, ry: 16 },
            ];
            const f = legFrames[frame % 4];

            // Left leg
            ctx.fillStyle = '#2038EC';
            ctx.fillRect(x + f.lx, y + f.ly, 4, 4);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + f.lx - 1, y + f.ly + 4, 5, 3);
            ctx.fillStyle = '#6B3304';
            ctx.fillRect(x + f.lx - 1, y + f.ly + 6, 5, 1);

            // Right leg
            ctx.fillStyle = '#2038EC';
            ctx.fillRect(x + f.rx, y + f.ry, 4, 4);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + f.rx, y + f.ry + 4, 5, 3);
            ctx.fillStyle = '#6B3304';
            ctx.fillRect(x + f.rx, y + f.ry + 6, 5, 1);
        } else {
            // Idle standing
            ctx.fillStyle = '#2038EC';
            ctx.fillRect(x + 3, y + 16, 4, 4);
            ctx.fillRect(x + 9, y + 16, 4, 4);
            // Shoes
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 2, y + 20, 5, 3);
            ctx.fillRect(x + 9, y + 20, 5, 3);
            // Shoe soles
            ctx.fillStyle = '#6B3304';
            ctx.fillRect(x + 2, y + 22, 5, 1);
            ctx.fillRect(x + 9, y + 22, 5, 1);
        }
    }

    // ─── GOOMBA (16x16) ──────────────────────────────────────────────
    static drawGoomba(ctx, x, y, width, height, animationFrame = 0) {
        // Mushroom cap (brown dome)
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + 5, 8, 6, 0, Math.PI, 0);
        ctx.fill();

        // Cap highlight
        ctx.fillStyle = '#C46B3A';
        ctx.fillRect(x + 3, y + 1, 3, 2);

        // Cap dark spots
        ctx.fillStyle = '#704020';
        ctx.fillRect(x + 2, y + 3, 2, 2);
        ctx.fillRect(x + 12, y + 3, 2, 2);

        // Face area (lighter brown)
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(x + 2, y + 5, 12, 5);

        // Angry eyebrows
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 3, y + 5, 3, 1);
        ctx.fillRect(x + 10, y + 5, 3, 1);
        // Inner brow (angled)
        ctx.fillRect(x + 5, y + 4, 1, 1);
        ctx.fillRect(x + 10, y + 4, 1, 1);

        // Eyes (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 3, y + 6, 3, 2);
        ctx.fillRect(x + 10, y + 6, 3, 2);

        // Pupils
        ctx.fillStyle = '#000000';
        if (animationFrame === 0) {
            ctx.fillRect(x + 5, y + 6, 1, 2);
            ctx.fillRect(x + 10, y + 6, 1, 2);
        } else {
            ctx.fillRect(x + 4, y + 6, 1, 2);
            ctx.fillRect(x + 11, y + 6, 1, 2);
        }

        // Frown
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 5, y + 9, 6, 1);
        ctx.fillRect(x + 4, y + 8, 1, 1);
        ctx.fillRect(x + 11, y + 8, 1, 1);

        // Body (tan)
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(x + 3, y + 10, 10, 2);

        // Feet (dark brown, animated)
        ctx.fillStyle = '#6B3304';
        if (animationFrame === 0) {
            // Left foot forward
            ctx.fillRect(x + 1, y + 12, 5, 3);
            ctx.fillRect(x + 10, y + 13, 5, 2);
            // Shoe detail
            ctx.fillStyle = '#4A2200';
            ctx.fillRect(x + 1, y + 14, 5, 1);
            ctx.fillRect(x + 10, y + 14, 5, 1);
        } else {
            // Right foot forward
            ctx.fillRect(x + 1, y + 13, 5, 2);
            ctx.fillRect(x + 10, y + 12, 5, 3);
            // Shoe detail
            ctx.fillStyle = '#4A2200';
            ctx.fillRect(x + 1, y + 14, 5, 1);
            ctx.fillRect(x + 10, y + 14, 5, 1);
        }
    }

    // ─── KOOPA (16x16) ───────────────────────────────────────────────
    static drawKoopa(ctx, x, y, width, height, animationFrame = 0) {
        const headBob = animationFrame === 0 ? 0 : 1;

        // Shell (green dome)
        ctx.fillStyle = '#22AA22';
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + 5, 7, 6, 0, Math.PI, 0);
        ctx.fill();
        // Shell body
        ctx.fillStyle = '#22AA22';
        ctx.fillRect(x + 1, y + 4, 14, 5);

        // Shell rim
        ctx.fillStyle = '#EECC44';
        ctx.fillRect(x + 1, y + 8, 14, 2);

        // Shell pattern (diamond)
        ctx.fillStyle = '#007700';
        ctx.fillRect(x + 4, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 2, 2, 2);
        ctx.fillRect(x + 7, y + 1, 2, 2);
        // Shell highlight
        ctx.fillStyle = '#44CC44';
        ctx.fillRect(x + 6, y + 4, 4, 2);

        // Head (peeking from below shell)
        ctx.fillStyle = '#FFCC66';
        ctx.fillRect(x + 4, y + 9 + headBob, 3, 3);

        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 4, y + 9 + headBob, 2, 2);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 4, y + 10 + headBob, 1, 1);

        // Beak/mouth
        ctx.fillStyle = '#CC8833';
        ctx.fillRect(x + 3, y + 11 + headBob, 2, 1);

        // Legs (animated)
        ctx.fillStyle = '#FFCC66';
        if (animationFrame === 0) {
            ctx.fillRect(x + 3, y + 12, 3, 2);
            ctx.fillRect(x + 10, y + 13, 3, 1);
        } else {
            ctx.fillRect(x + 3, y + 13, 3, 1);
            ctx.fillRect(x + 10, y + 12, 3, 2);
        }

        // Shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 2, y + 14, 4, 2);
        ctx.fillRect(x + 10, y + 14, 4, 2);
    }

    // ─── COIN (8x8, spinning) ────────────────────────────────────────
    static drawCoin(ctx, x, y, width, height, animationFrame = 0) {
        const cx = x + width / 2;
        const cy = y + height / 2;

        // Spin widths: full -> 3/4 -> edge -> 3/4
        const spinWidths = [width / 2 - 1, width / 2 - 2, 1, width / 2 - 2];
        const currentWidth = spinWidths[animationFrame % 4];

        // Outer coin
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(cx, cy, currentWidth, height / 2 - 1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#CC8800';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, currentWidth, height / 2 - 1, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner shine (only when wide enough)
        if (currentWidth > 1.5) {
            ctx.fillStyle = '#FFEE44';
            ctx.beginPath();
            ctx.ellipse(cx - 0.5, cy - 0.5, currentWidth * 0.5, height / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // "C" mark on front face
            if (animationFrame === 0) {
                ctx.fillStyle = '#CC8800';
                ctx.font = `bold ${Math.max(5, height - 3)}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', cx, cy + 0.5);
            }
        }

        // Bright highlight when edge-on
        if (animationFrame === 2) {
            ctx.fillStyle = '#FFFFAA';
            ctx.fillRect(cx - 0.5, cy - height / 3, 1, height * 0.6);
        }
    }

    // ─── PLATFORM TILES (16px) ───────────────────────────────────────
    static drawPlatformTile(ctx, x, y, width, height, type = 'normal') {
        if (type === 'grass') {
            this._drawGrassTile(ctx, x, y, width, height);
        } else if (type === 'spike') {
            this._drawSpikeTile(ctx, x, y, width, height);
        } else {
            this._drawBrickTile(ctx, x, y, width, height);
        }
    }

    static _drawGrassTile(ctx, x, y, width, height) {
        // Dirt base
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(x, y, width, height);

        // Dirt texture (darker spots)
        ctx.fillStyle = '#6B4E0A';
        for (let i = 2; i < width - 2; i += 5) {
            ctx.fillRect(x + i, y + 6, 2, 2);
            ctx.fillRect(x + i + 2, y + 10, 1, 1);
        }

        // Small pebbles
        ctx.fillStyle = '#9B7924';
        for (let i = 1; i < width - 1; i += 7) {
            ctx.fillRect(x + i, y + height - 4, 2, 1);
        }

        // Green grass top layer
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y, width, 4);

        // Bright grass highlights
        ctx.fillStyle = '#66BB6A';
        ctx.fillRect(x, y, width, 2);

        // Grass blade tufts
        ctx.fillStyle = '#388E3C';
        for (let i = 0; i < width; i += 4) {
            ctx.fillRect(x + i, y - 1, 1, 2);
            ctx.fillRect(x + i + 2, y, 1, 1);
        }

        // Transition from grass to dirt
        ctx.fillStyle = '#6B5F0A';
        for (let i = 0; i < width; i += 3) {
            ctx.fillRect(x + i, y + 4, 2, 1);
        }
    }

    static _drawSpikeTile(ctx, x, y, width, height) {
        // Base
        ctx.fillStyle = '#555555';
        ctx.fillRect(x, y + height - 4, width, 4);

        // Metal spikes
        for (let i = 0; i < width; i += 6) {
            // Spike body (silver gradient effect)
            ctx.fillStyle = '#AAAAAA';
            ctx.beginPath();
            ctx.moveTo(x + i, y + height - 4);
            ctx.lineTo(x + i + 3, y + 2);
            ctx.lineTo(x + i + 6, y + height - 4);
            ctx.fill();

            // Spike highlight (left edge)
            ctx.fillStyle = '#CCCCCC';
            ctx.beginPath();
            ctx.moveTo(x + i + 1, y + height - 4);
            ctx.lineTo(x + i + 3, y + 2);
            ctx.lineTo(x + i + 3, y + height - 4);
            ctx.fill();

            // Spike tip (red/dangerous)
            ctx.fillStyle = '#FF2200';
            ctx.beginPath();
            ctx.moveTo(x + i + 2, y + 5);
            ctx.lineTo(x + i + 3, y + 1);
            ctx.lineTo(x + i + 4, y + 5);
            ctx.fill();
        }

        // Dark outline on base
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y + height - 1, width, 1);
    }

    static _drawBrickTile(ctx, x, y, width, height) {
        // Brick base color
        ctx.fillStyle = '#C84C09';
        ctx.fillRect(x, y, width, height);

        // Mortar color
        ctx.fillStyle = '#8B7355';

        // Horizontal mortar lines
        ctx.fillRect(x, y, width, 1);
        if (height > 8) {
            ctx.fillRect(x, y + Math.floor(height / 2), width, 1);
        }
        ctx.fillRect(x, y + height - 1, width, 1);

        // Vertical mortar lines (offset for brick bond)
        const halfW = Math.floor(width / 2);
        ctx.fillRect(x + halfW, y, 1, Math.floor(height / 2));
        if (width > 8) {
            ctx.fillRect(x + Math.floor(width / 4), y + Math.floor(height / 2), 1, height - Math.floor(height / 2));
            ctx.fillRect(x + halfW + Math.floor(width / 4), y + Math.floor(height / 2), 1, height - Math.floor(height / 2));
        }

        // Brick highlights (top edge of each brick)
        ctx.fillStyle = '#D86A2A';
        ctx.fillRect(x + 1, y + 1, halfW - 2, 1);
        ctx.fillRect(x + halfW + 1, y + 1, halfW - 2, 1);
        if (height > 8) {
            const mid = Math.floor(height / 2) + 1;
            ctx.fillRect(x + 1, y + mid, Math.floor(width / 4) - 1, 1);
            ctx.fillRect(x + Math.floor(width / 4) + 1, y + mid, halfW - 1, 1);
        }

        // Brick shadows (bottom edge)
        ctx.fillStyle = '#A03A00';
        const brickBottom = Math.floor(height / 2) - 1;
        ctx.fillRect(x + 1, y + brickBottom, halfW - 2, 1);
        ctx.fillRect(x + halfW + 1, y + brickBottom, halfW - 2, 1);
    }
}
