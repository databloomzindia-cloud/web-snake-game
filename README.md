# 🐍 Classic Snake Game

A retro-style snake game built with vanilla HTML, CSS, and JavaScript. No dependencies, no build tools—just pure web standards!

## Features

✨ **Classic Gameplay**
- Control a growing snake that eats food on a grid
- Simple but challenging gameplay
- Game ends when you hit a wall or yourself

🎮 **Controls**
- **Arrow Keys** or **WASD** to move the snake
- **Spacebar** to pause/resume
- **Difficulty Selector** to adjust game speed

📊 **Scoring System**
- Earn points by eating food (score increases with snake length)
- Track your high score (saved in browser storage)
- Three difficulty levels: Easy, Normal, Hard

🎨 **Modern Retro Design**
- Neon color scheme inspired by classic arcade games
- Smooth animations and visual feedback
- Fully responsive design (works on desktop and mobile)

## How to Play

### Starting the Game
1. Open `index.html` in your web browser
2. Select your desired difficulty level (Easy, Normal, or Hard)
3. Click the "START GAME" button

### Game Controls
- **Arrow Keys** or **WASD** - Move the snake in that direction
- **Spacebar** - Pause/Resume the game
- **Click PAUSE button** - Pause/Resume gameplay

### Objective
- Eat the red food (★) to grow your snake and earn points
- Avoid hitting the walls at the edges of the game board
- Avoid hitting yourself (the snake's body)
- Get the highest score possible!

## Difficulty Levels

| Level | Speed | Best For |
|-------|-------|----------|
| **Easy** | Slow (100ms) | Learning the game |
| **Normal** | Medium (80ms) | Balanced challenge |
| **Hard** | Fast (50ms) | Advanced players |

You can change difficulty before starting a new game.

## Installation & Running

### No Installation Required!
This game is completely standalone and requires no installation or build process.

**Option 1: Local File**
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start playing!

**Option 2: With a Simple Server**
If you want to serve it locally with a web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Game Rules

1. ✅ You start with a 3-segment snake in the middle of the board
2. ✅ Food spawns randomly on the board (red square)
3. ✅ Eating food makes your snake grow by 1 segment
4. ✅ Your score increases each time you eat (points = 10 × snake length)
5. ❌ Hitting a wall ends the game
6. ❌ Hitting yourself ends the game
7. ✅ Your high score is automatically saved in browser storage

## Technical Details

### Architecture
- **HTML** - Game structure and UI elements
- **CSS** - Styling, layout, and animations (no CSS frameworks)
- **JavaScript** - Game logic, collision detection, rendering

### Game Loop
- The game runs at 60 FPS using `requestAnimationFrame`
- Actual snake movement speed is controlled separately by difficulty setting
- All game state is managed in a single `gameState` object

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript to be enabled
- Uses localStorage for high score persistence

### Key Game Components
- **Game Board**: 20×20 grid of cells
- **Snake**: Array of segment objects with x,y coordinates
- **Food**: Single food object that spawns randomly
- **Collision Detection**: Wall, self, and food collision checking
- **Score System**: Points awarded based on snake length

## File Structure

```
snake-game/
├── index.html       (Main HTML file - game structure)
├── style.css        (All CSS styling and animations)
├── game.js          (Complete game logic - ~450 lines)
└── README.md        (This file)
```

## Features Breakdown

### Game State Management
- Snake position and direction tracking
- Food spawning algorithm (ensures food doesn't spawn on snake)
- Score and high score tracking
- Pause/resume functionality
- Difficulty level management

### Input Handling
- Keyboard event detection (arrow keys and WASD)
- Direction queue to prevent impossible moves
- Prevents reversing directly into the snake

### Rendering
- Grid-based cell rendering
- Snake head highlight (brighter)
- Food pulsing animation
- Score board updates

### Difficulty System
- Easy: 100ms move delay (10 moves/second)
- Normal: 80ms move delay (12.5 moves/second)
- Hard: 50ms move delay (20 moves/second)

## Gameplay Tips

🎯 **Beginner Tips**
- Start on Easy difficulty to understand the controls
- The snake can't move through walls—plan your path
- Try to collect food in patterns to maximize score
- Use the pause button (spacebar) to think ahead

🏆 **Advanced Strategies**
- Create a "spiral" pattern to safely collect multiple foods
- Move along the edges first, then work toward the center
- On hard difficulty, plan several moves ahead
- Try to avoid letting your snake get trapped in a corner

## Performance

- **No external dependencies** - Pure JavaScript
- **Lightweight** - All files are under 100KB combined
- **Smooth 60 FPS** - Optimized game loop
- **Low latency input** - Immediate keyboard response

## Browser Storage

Your high score is automatically saved to your browser's `localStorage`:
- Data persists across browser sessions
- Stored locally (not sent to any server)
- Clear your browser data to reset high scores

## Future Enhancement Ideas

If you want to extend the game, here are some ideas:
- Add sound effects
- Implement mobile touch controls (swipe)
- Add obstacles that grow over time
- Implement a leaderboard system
- Add power-ups (fast/slow/invincible)
- Create different game modes
- Add animations for snake growth

## License

This project is open source and free to use, modify, and distribute.

## Credits

Built as a classic snake game implementation in vanilla JavaScript, inspired by the timeless arcade game.

---

**Enjoy the game! 🐍🎮**

Try to beat your high score!
