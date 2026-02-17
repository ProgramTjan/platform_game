// Game Configuration
export const CONFIG = {
    // Canvas (internal resolution - CSS scales to 1200x900 display)
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 450,

    // Game
    TARGET_FPS: 60,

    // Player
    PLAYER_WIDTH: 16,
    PLAYER_HEIGHT: 24,
    PLAYER_SPEED: 3,
    PLAYER_ACCELERATION: 0.3,
    PLAYER_FRICTION: 0.8,
    PLAYER_JUMP_POWER: 9,
    PLAYER_MAX_VELOCITY_X: 4,
    PLAYER_MAX_VELOCITY_Y: 10,
    PLAYER_INITIAL_LIVES: 3,

    // Physics
    GRAVITY: 0.35,

    // Enemies
    ENEMY_WIDTH: 16,
    ENEMY_HEIGHT: 16,
    ENEMY_SPEED: 1.5,
    ENEMY_PATROL_DISTANCE: 100,
    ENEMY_DAMAGE: 10,

    // Platforms
    PLATFORM_WIDTH: 32,
    PLATFORM_HEIGHT: 16,

    // Collectibles
    COIN_WIDTH: 8,
    COIN_HEIGHT: 8,
    COIN_VALUE: 10,

    // Camera
    CAMERA_PADDING: 120,

    // Parallax
    PARALLAX: {
        CLOUD_FACTOR: 0.05,
        MOUNTAIN_FACTOR: 0.15,
        HILLS_FACTOR: 0.4,
        CLOUD_AUTO_SPEED: 8,
    },

    // Colors
    COLORS: {
        BACKGROUND: '#87CEEB',
        PLAYER: '#ff0000',
        PLATFORM: '#8B4513',
        GRASS_TOP: '#00AA00',
        ENEMY_GOOMBA: '#8B6F47',
        ENEMY_KOOPA: '#00AA00',
        COIN: '#FFD700',
        SPIKE: '#FF0000',
        DOOR: '#8B4513',
        PARTICLE: '#FFD700',
        MOUNTAIN: '#3a4a6b',
        MOUNTAIN_HIGHLIGHT: '#5a6a8b',
        HILLS_FAR: '#2d5a1e',
        HILLS_NEAR: '#3d7a2e',
        CLOUD: 'rgba(255, 255, 255, 0.7)',
        CLOUD_SHADOW: 'rgba(200, 200, 210, 0.4)',
    },

    // Tilemap (16x16 grid)
    TILE_SIZE: 16,

    // Level
    LEVEL_WIDTH: 25,  // 25 * 32px tiles = 800px
    LEVEL_HEIGHT: 20, // 20 * 30px tiles = 600px
};
