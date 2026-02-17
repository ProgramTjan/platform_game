import { CONFIG } from './config.js';
import { Player } from './player.js';
import { PlatformManager } from './platforms.js';
import { EnemyManager } from './enemies.js';
import { CollectibleManager } from './collectibles.js';
import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { Camera } from './camera.js';
import { LevelManager } from './level.js';
import { HUD } from './hud.js';
import { ParallaxBackground } from './background.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.isVictory = false;
        this.currentLevel = 1;
        this.totalScore = 0;

        // Initialize systems
        this.input = new Input();
        this.renderer = new Renderer(this.ctx, this.canvas);
        this.camera = new Camera();
        this.hud = new HUD();
        this.background = new ParallaxBackground(this.canvas, this.ctx);
        this.elapsedTime = 0;

        // Game objects (will be initialized per level)
        this.player = null;
        this.platformManager = null;
        this.enemyManager = null;
        this.collectibleManager = null;
        this.levelManager = new LevelManager();
        this.currentLevelData = null;
        this.pipeCooldown = 0;
        this.pendingSecretReturnLevel = null;

        this.setupEventListeners();
        this.lastFrameTime = 0;
        this.deltaTime = 0;
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => this.start());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });
    }

    start() {
        this.isRunning = true;
        this.gameOver = false;
        this.isVictory = false;
        this.currentLevel = 1;
        this.totalScore = 0;
        this.loadLevel(this.currentLevel);
        this.hideMenu();
        this.gameLoop();
    }

    loadLevel(levelNumber) {
        // Load level data
        this.currentLevelData = this.levelManager.getLevel(levelNumber);

        // Initialize game objects
        this.player = new Player(this.currentLevelData.playerStartX, this.currentLevelData.playerStartY);
        this.platformManager = new PlatformManager(this.currentLevelData.platforms);
        this.enemyManager = new EnemyManager(this.currentLevelData.enemies);
        this.collectibleManager = new CollectibleManager(this.currentLevelData.collectibles);

        // Setup background for this level
        this.background.setLevel(levelNumber);

        // Reset level-specific state
        this.isPaused = false;
        this.pipeCooldown = 0;
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
    }

    update(dt) {
        if (!this.isRunning || this.isPaused || this.gameOver || this.isVictory) return;

        // Track elapsed time for background animations
        this.elapsedTime += dt;
        this.pipeCooldown = Math.max(0, this.pipeCooldown - dt);

        // Update player
        this.player.handleInput(this.input);
        this.player.update(dt);

        // Platform collision
        this.platformManager.checkCollisions(this.player);

        // Update enemies (platforms meegeven voor collision + klif detectie)
        this.enemyManager.update(dt, this.player, this.platformManager.platforms);

        // Check enemy-player collision
        this.enemyManager.checkPlayerCollision(this.player);

        // Update collectibles
        this.collectibleManager.update(dt);

        // Check collectible collection
        const collectedCoins = this.collectibleManager.checkPlayerCollision(this.player);
        this.totalScore += collectedCoins * CONFIG.COIN_VALUE;

        // Check warp pipes (real and fake)
        if (this.currentLevelData && this.handlePipeInteraction()) {
            return;
        }

        // Check win condition (reached door/goal)
        if (this.currentLevelData && this.checkGoalReached()) {
            this.nextLevel();
            return;
        }

        // Check lose condition (fell off map of geen levens meer)
        if (this.player.y > 650 || this.player.lives <= 0) {
            this.gameOver = true;
        }

        // Update camera
        this.camera.follow(this.player, this.canvas);
    }

    checkGoalReached() {
        if (!this.currentLevelData) return false;

        const goal = this.currentLevelData.goal;
        const pRect = this.player.getRect();

        // Check if player overlaps with goal
        return !(
            pRect.x + pRect.width < goal.x ||
            pRect.x > goal.x + goal.width ||
            pRect.y + pRect.height < goal.y ||
            pRect.y > goal.y + goal.height
        );
    }

    render() {
        // Clear canvas (sky gradient)
        this.renderer.clear();

        // Draw parallax background layers
        this.background.render(this.camera, this.elapsedTime);

        // Draw level
        this.platformManager.render(this.renderer, this.camera);
        this.collectibleManager.render(this.renderer, this.camera);
        this.enemyManager.render(this.renderer, this.camera);

        // Draw warp pipes
        for (const pipe of (this.currentLevelData?.pipes || [])) {
            const wx = pipe.x - this.camera.x;
            const wy = pipe.y - this.camera.y;
            const ww = pipe.width;
            const wh = pipe.height;
            const isFake = !!pipe.isFake;

            // Fake pipes look almost the same to mislead players.
            this.renderer.ctx.fillStyle = isFake ? '#0B6E0B' : '#0A730A';
            this.renderer.ctx.fillRect(wx + 2, wy + 8, ww - 4, wh - 8);

            this.renderer.ctx.fillStyle = isFake ? '#139313' : '#159915';
            this.renderer.ctx.fillRect(wx, wy, ww, 10);

            this.renderer.ctx.fillStyle = isFake ? '#23A823' : '#29B529';
            this.renderer.ctx.fillRect(wx + 4, wy + 2, 4, wh - 4);

            this.renderer.ctx.fillStyle = '#064E06';
            this.renderer.ctx.fillRect(wx + ww - 5, wy, 3, wh);

            this.renderer.ctx.fillStyle = '#FFFFFF';
            this.renderer.ctx.font = 'bold 10px Arial';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.fillText('↓', wx + ww / 2, wy + 7);
        }

        // Draw goal
        if (this.currentLevelData) {
            const goal = this.currentLevelData.goal;
            const screenX = goal.x - this.camera.x;
            const screenY = goal.y - this.camera.y;

            // Draw goal door/flag
            this.renderer.ctx.fillStyle = '#8B4513';
            this.renderer.ctx.fillRect(screenX, screenY, goal.width, goal.height);

            // Draw door details
            this.renderer.ctx.fillStyle = '#FFD700';
            this.renderer.ctx.fillRect(screenX + 5, screenY + 10, 5, 30);
            this.renderer.ctx.fillRect(screenX + 25, screenY + 10, 5, 30);

            // Draw flag on top
            this.renderer.ctx.fillStyle = '#FF0000';
            this.renderer.ctx.beginPath();
            this.renderer.ctx.moveTo(screenX + goal.width / 2, screenY - 5);
            this.renderer.ctx.lineTo(screenX + goal.width / 2 + 15, screenY - 15);
            this.renderer.ctx.lineTo(screenX + goal.width / 2, screenY - 10);
            this.renderer.ctx.fill();
        }

        // Draw player
        this.player.render(this.renderer, this.camera);

        // Draw HUD
        const isSecret = this.currentLevelData?.isSecret || false;
        this.hud.render(this.ctx, this.player.lives, this.totalScore, this.currentLevel, isSecret);

        // Draw pause message
        if (this.isPaused) {
            this.renderer.drawPauseMenu();
        }

        // Draw victory of game over
        if (this.isVictory) {
            this.renderer.drawVictory(this.totalScore);
        } else if (this.gameOver) {
            this.renderer.drawGameOver(this.totalScore);
        }
    }

    nextLevel() {
        // Secret level returns to the stored regular level.
        if (this.currentLevelData?.isSecret) {
            const returnLevel = this.pendingSecretReturnLevel || 2;
            this.pendingSecretReturnLevel = null;
            this.currentLevel = returnLevel;
            this.loadLevel(this.currentLevel);
            return;
        }
        
        this.currentLevel++;
        
        // Check if we've beaten all regular levels
        if (this.currentLevel > this.levelManager.getRegularLevelCount()) {
            this.isVictory = true;
            return;
        }

        this.loadLevel(this.currentLevel);
    }

    handlePipeInteraction() {
        if (this.pipeCooldown > 0) return false;
        const pRect = this.player.getRect();
        const isPressingDown = this.input.isKeyPressed('ArrowDown') || this.input.isKeyPressed('s');
        if (!isPressingDown) return false;
        
        for (const pipe of (this.currentLevelData?.pipes || [])) {
            const overlap = (
                pRect.x + pRect.width > pipe.x &&
                pRect.x < pipe.x + pipe.width &&
                pRect.y + pRect.height > pipe.y &&
                pRect.y < pipe.y + pipe.height
            );
            
            if (!overlap) continue;
            
            this.pipeCooldown = 0.5;
            if (pipe.isFake) {
                this.player.takeDamage(pipe.fakeDamage || 10);
                return true;
            }
            
            if (pipe.targetLevel) {
                if (pipe.targetLevel === this.levelManager.getSecretLevelNumber()) {
                    this.pendingSecretReturnLevel = pipe.returnToLevel || (this.currentLevel + 1);
                }
                this.currentLevel = pipe.targetLevel;
                this.loadLevel(this.currentLevel);
                return true;
            }
        }
        return false;
    }

    gameLoop = (currentTime) => {
        // Calculate delta time
        if (this.lastFrameTime) {
            this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
            // Cap delta time to prevent huge jumps
            if (this.deltaTime > 0.05) this.deltaTime = 0.05;
        }
        this.lastFrameTime = currentTime;

        // Update
        this.update(this.deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame(this.gameLoop);
    };

    hideMenu() {
        document.getElementById('menu').classList.add('hidden');
    }

    showMenu() {
        document.getElementById('menu').classList.remove('hidden');
    }
}

// Start the game
const game = new Game();
