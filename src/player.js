import { CONFIG } from './config.js';
import { SpriteRenderer } from './sprites.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER_WIDTH;
        this.height = CONFIG.PLAYER_HEIGHT;

        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
        this.isFalling = false;

        // State
        this.lives = CONFIG.PLAYER_INITIAL_LIVES;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.reachedGoal = false;

        // Direction
        this.facingRight = true;

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    handleInput(input) {
        // Horizontal movement
        let moveInput = 0;

        if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('a')) {
            moveInput = -1;
            this.facingRight = false;
        }
        if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('d')) {
            moveInput = 1;
            this.facingRight = true;
        }

        // Apply acceleration
        if (moveInput !== 0) {
            this.velocityX += moveInput * CONFIG.PLAYER_ACCELERATION;
            this.velocityX = Math.max(
                -CONFIG.PLAYER_MAX_VELOCITY_X,
                Math.min(CONFIG.PLAYER_MAX_VELOCITY_X, this.velocityX)
            );
        } else {
            // Friction when not moving
            this.velocityX *= CONFIG.PLAYER_FRICTION;
            if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        }

        // Jump
        if (input.isKeyPressed(' ') && this.isGrounded) {
            this.velocityY = -CONFIG.PLAYER_JUMP_POWER;
            this.isGrounded = false;
            input.consumeKey(' '); // Prevent holding jump
        }
    }

    update(dt) {
        // Apply gravity
        if (!this.isGrounded) {
            this.velocityY += CONFIG.GRAVITY;
            this.velocityY = Math.min(this.velocityY, CONFIG.PLAYER_MAX_VELOCITY_Y);
            this.isFalling = this.velocityY > 0;
        }

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Reset grounded state (will be set by collision detection)
        this.isGrounded = false;

        // Update animation
        this.updateAnimation(dt);

        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerableTimer -= dt;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    updateAnimation(dt) {
        // Faster animation when running faster
        const interval = Math.abs(this.velocityX) > 2 ? 0.06 : 0.1;
        this.animationTimer += dt;
        if (this.animationTimer > interval) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    getState() {
        if (!this.isGrounded && this.velocityY < 0) return 'jumping';
        if (!this.isGrounded && this.velocityY >= 0) return 'falling';
        if (Math.abs(this.velocityX) > 0.5) return 'walking';
        return 'idle';
    }

    takeDamage(amount = 10) {
        if (this.invulnerable) return;

        this.lives -= 1;
        this.invulnerable = true;
        this.invulnerableTimer = 1.5; // 1.5 seconds of invulnerability

        if (this.lives <= 0) {
            this.die();
        }
    }

    die() {
        this.lives = 0;
    }

    setGrounded(isGrounded) {
        this.isGrounded = isGrounded;
    }

    reachedGoalFlag() {
        this.reachedGoal = true;
    }

    render(renderer, camera) {
        // Only render if visible or invulnerable with blink effect
        if (this.invulnerable && Math.floor(this.invulnerableTimer * 10) % 2 === 0) {
            return; // Blink effect
        }

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Draw player using sprite renderer
        SpriteRenderer.drawPlayer(
            renderer.ctx,
            screenX,
            screenY,
            this.width,
            this.height,
            this.facingRight,
            this.getState(),
            this.animationFrame
        );
    }

    // Getters for bounding box
    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
}
