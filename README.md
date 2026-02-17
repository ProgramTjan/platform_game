# 🍄 Mario Platformer

A classic 2D platformer game with retro pixel art aesthetic, built with vanilla JavaScript and HTML5 Canvas.

## Features

- ✅ **Player Movement** - Smooth left/right movement with acceleration
- ✅ **Jumping Physics** - Gravity-based jumping with momentum
- ✅ **Platform Collision** - AABB collision detection
- ✅ **Enemies** - Goombas and Koopas with patrol AI
- ✅ **Collectibles** - Coins to collect for points
- ✅ **Camera System** - Follows player dynamically
- ✅ **Multiple Levels** - 2 playable levels with progression
- ✅ **Hazards** - Spike traps cause damage
- ✅ **HUD** - Lives, Score, Level display

## Controls

| Key | Action |
|-----|--------|
| **← →** or **A/D** | Move left/right |
| **SPACE** | Jump |
| **ESC** | Pause/Menu |

## How to Play

1. Open `index.html` in a web browser
   - Or use a local server: `npx serve .`

2. Click **START GAME** to begin

3. Complete Level 1 and 2 to win!

### Gameplay Tips

- 🎯 Jump on enemies to defeat them
- 💚 Collect coins for points
- ⚠️ Avoid spike traps - they hurt!
- 📈 Complete levels to progress
- ❤️ You start with 3 lives

## Project Structure

```
mario-platformer/
├── index.html              # Main HTML
├── style.css              # Styling
├── README.md              # This file
└── src/
    ├── game.js            # Main game loop & orchestration
    ├── config.js          # Game constants
    ├── player.js          # Player class & movement
    ├── enemies.js         # Enemy AI & behavior
    ├── platforms.js       # Platform collision system
    ├── collectibles.js    # Coins & items
    ├── level.js           # Level definitions
    ├── renderer.js        # Canvas rendering
    ├── camera.js          # Camera system
    ├── input.js           # Input handling
    └── hud.js             # UI elements
```

## Development Notes

### Collision Detection
Uses AABB (Axis-Aligned Bounding Box) collision detection with overlap resolution to prevent clipping.

### Physics
Simple gravity system with configurable acceleration and max velocity.

### Rendering
Pure 2D Canvas API with simple geometric shapes (no sprite sheets yet).

## Future Enhancements

- [ ] Sprite sheets for character animation
- [ ] Moving/falling platforms
- [ ] More enemy types
- [ ] Power-ups (speed, invulnerability)
- [ ] Sound effects
- [ ] More levels (5+)
- [ ] Boss fights
- [ ] Mobile touch controls

## License

Free to use and modify!
