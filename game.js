// Game Constants
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const TOTAL_CELLS = GRID_WIDTH * GRID_HEIGHT;

const DIFFICULTIES = {
    easy: { speed: 100, fps: 10 },
    normal: { speed: 80, fps: 12.5 },
    hard: { speed: 50, fps: 20 }
};

// Game State
let gameState = {
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    highScore: localStorage.getItem('snakeHighScore') || 0,
    isGameOver: false,
    isPaused: false,
    isStarted: false,
    difficulty: 'normal'
};

let gameLoopId = null;
let lastMoveTime = 0;
let moveDelay = DIFFICULTIES.normal.speed;

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const difficultySelect = document.getElementById('difficulty');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const newHighScoreMsg = document.getElementById('newHighScore');
const restartBtn = document.getElementById('restartBtn');

// Initialize
function init() {
    renderBoard();
    updateScoreDisplay();
    attachEventListeners();
    updateHighScoreDisplay();
}

// Event Listeners
function attachEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    difficultySelect.addEventListener('change', changeDifficulty);
    restartBtn.addEventListener('click', restartGame);
}

function handleKeyDown(e) {
    if (!gameState.isStarted) return;

    const key = e.key.toLowerCase();
    let newDirection = null;

    // Arrow keys
    if (e.key === 'ArrowUp') {
        newDirection = { x: 0, y: -1 };
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        newDirection = { x: 0, y: 1 };
        e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
        newDirection = { x: -1, y: 0 };
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        newDirection = { x: 1, y: 0 };
        e.preventDefault();
    }

    // WASD keys
    else if (key === 'w') {
        newDirection = { x: 0, y: -1 };
        e.preventDefault();
    } else if (key === 's') {
        newDirection = { x: 0, y: 1 };
        e.preventDefault();
    } else if (key === 'a') {
        newDirection = { x: -1, y: 0 };
        e.preventDefault();
    } else if (key === 'd') {
        newDirection = { x: 1, y: 0 };
        e.preventDefault();
    }

    // Spacebar to pause
    else if (e.code === 'Space') {
        togglePause();
        e.preventDefault();
    }

    // Prevent reversing into itself
    if (newDirection && !isOppositeDirection(newDirection, gameState.direction)) {
        gameState.nextDirection = newDirection;
    }
}

function isOppositeDirection(dir1, dir2) {
    return dir1.x === -dir2.x && dir1.y === -dir2.y;
}

function startGame() {
    if (gameState.isStarted) return;

    gameState.isStarted = true;
    gameState.isGameOver = false;
    gameState.isPaused = false;

    startBtn.textContent = 'RESTART';
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    difficultySelect.disabled = true;

    lastMoveTime = Date.now();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function togglePause() {
    if (!gameState.isStarted || gameState.isGameOver) return;

    gameState.isPaused = !gameState.isPaused;
    pauseBtn.textContent = gameState.isPaused ? 'RESUME' : 'PAUSE';

    if (!gameState.isPaused) {
        lastMoveTime = Date.now();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function changeDifficulty(e) {
    const difficulty = e.target.value;
    gameState.difficulty = difficulty;
    moveDelay = DIFFICULTIES[difficulty].speed;
}

function restartGame() {
    gameState = {
        snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
        food: { x: 15, y: 15 },
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        score: 0,
        highScore: gameState.highScore,
        isGameOver: false,
        isPaused: false,
        isStarted: false,
        difficulty: gameState.difficulty
    };

    gameOverModal.classList.add('hidden');
    startBtn.textContent = 'START GAME';
    pauseBtn.textContent = 'PAUSE';
    pauseBtn.disabled = true;
    difficultySelect.disabled = false;

    updateScoreDisplay();
    renderBoard();

    startGame();
}

// Game Loop
function gameLoop() {
    const now = Date.now();
    const timeSinceLastMove = now - lastMoveTime;

    if (timeSinceLastMove >= moveDelay && !gameState.isPaused) {
        update();
        render();
        lastMoveTime = now;
    }

    if (!gameState.isGameOver) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Game Logic
function update() {
    // Update direction
    gameState.direction = gameState.nextDirection;

    // Calculate new head position
    const head = gameState.snake[0];
    const newHead = {
        x: head.x + gameState.direction.x,
        y: head.y + gameState.direction.y
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
        endGame();
        return;
    }

    // Check self collision
    if (gameState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    // Add new head
    gameState.snake.unshift(newHead);

    // Check food collision
    if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
        gameState.score += 10 * gameState.snake.length;
        spawnFood();
    } else {
        // Remove tail if no food eaten
        gameState.snake.pop();
    }

    updateScoreDisplay();
}

function spawnFood() {
    let newFood;
    let isValidPosition = false;

    while (!isValidPosition) {
        newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };

        isValidPosition = !gameState.snake.some(
            segment => segment.x === newFood.x && segment.y === newFood.y
        );
    }

    gameState.food = newFood;
}

function endGame() {
    gameState.isGameOver = true;
    gameState.isStarted = false;

    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
        updateHighScoreDisplay();
    }

    // Show game over modal
    showGameOverModal();
}

function showGameOverModal() {
    finalScoreDisplay.textContent = `Final Score: ${gameState.score}`;

    if (gameState.score > parseInt(localStorage.getItem('snakeHighScore') || 0)) {
        newHighScoreMsg.classList.remove('hidden');
    } else {
        newHighScoreMsg.classList.add('hidden');
    }

    gameOverModal.classList.remove('hidden');
}

// Rendering
function render() {
    clearBoard();

    // Render food
    renderFood();

    // Render snake
    renderSnake();
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        gameBoard.appendChild(cell);
    }
}

function clearBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('snake-segment', 'head', 'food');
    });
}

function renderFood() {
    const cellIndex = gameState.food.y * GRID_WIDTH + gameState.food.x;
    const cell = document.getElementById(`cell-${cellIndex}`);
    if (cell) {
        cell.classList.add('food');
    }
}

function renderSnake() {
    gameState.snake.forEach((segment, index) => {
        const cellIndex = segment.y * GRID_WIDTH + segment.x;
        const cell = document.getElementById(`cell-${cellIndex}`);
        if (cell) {
            cell.classList.add('snake-segment');
            if (index === 0) {
                cell.classList.add('head');
            }
        }
    });
}

function updateScoreDisplay() {
    scoreDisplay.textContent = gameState.score;
}

function updateHighScoreDisplay() {
    highScoreDisplay.textContent = gameState.highScore;
}

// Start the game
document.addEventListener('DOMContentLoaded', init);
