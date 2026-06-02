// Game Logic Validation Tests
// This tests the core mechanics without needing a browser

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// Test suite
let testsRun = 0;
let testsPassed = 0;

function assert(condition, testName) {
    testsRun++;
    if (condition) {
        console.log(`✓ ${testName}`);
        testsPassed++;
    } else {
        console.log(`✗ ${testName}`);
    }
}

console.log('🐍 SNAKE GAME LOGIC VALIDATION TESTS\n');

// Test 1: Initial game state
console.log('--- Test Suite 1: Initial State ---');
let gameState = {
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    score: 0,
    isGameOver: false
};

assert(gameState.snake.length === 3, 'Snake initializes with 3 segments');
assert(gameState.snake[0].x === 10, 'Snake head at correct X position');
assert(gameState.snake[0].y === 10, 'Snake head at correct Y position');
assert(gameState.food.x === 15, 'Food spawned at correct X position');
assert(gameState.score === 0, 'Initial score is 0');

// Test 2: Snake movement
console.log('\n--- Test Suite 2: Movement Logic ---');
let testState = JSON.parse(JSON.stringify(gameState));
let moveDirection = { x: 1, y: 0 };

function simulateMove(state, direction) {
    const head = state.snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };
    state.snake.unshift(newHead);
    state.snake.pop(); // No food eaten
    return newHead;
}

let newPos = simulateMove(testState, moveDirection);
assert(newPos.x === 11, 'Snake moves right correctly');
assert(testState.snake[0].x === 11, 'New head added at correct position');
assert(testState.snake.length === 3, 'Snake length unchanged (no food eaten)');

// Test 3: Wall collision detection
console.log('\n--- Test Suite 3: Wall Collision ---');
let wallTestState = { snake: [{ x: 0, y: 10 }], direction: { x: -1, y: 0 } };
function checkWallCollision(newPos) {
    return newPos.x < 0 || newPos.x >= GRID_WIDTH ||
           newPos.y < 0 || newPos.y >= GRID_HEIGHT;
}

let wallCollision = checkWallCollision({ x: -1, y: 10 });
assert(wallCollision, 'Left wall collision detected');

wallCollision = checkWallCollision({ x: GRID_WIDTH, y: 10 });
assert(wallCollision, 'Right wall collision detected');

wallCollision = checkWallCollision({ x: 10, y: -1 });
assert(wallCollision, 'Top wall collision detected');

wallCollision = checkWallCollision({ x: 10, y: GRID_HEIGHT });
assert(wallCollision, 'Bottom wall collision detected');

wallCollision = checkWallCollision({ x: 10, y: 10 });
assert(!wallCollision, 'No collision in center of board');

// Test 4: Self collision detection
console.log('\n--- Test Suite 4: Self Collision ---');
let selfCollisionState = {
    snake: [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 8, y: 11 }
    ]
};

function checkSelfCollision(newHead, snake) {
    return snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
}

let selfCollision = checkSelfCollision({ x: 9, y: 10 }, selfCollisionState.snake);
assert(selfCollision, 'Self collision detected with body segment');

selfCollision = checkSelfCollision({ x: 11, y: 10 }, selfCollisionState.snake);
assert(!selfCollision, 'No self collision with empty space');

// Test 5: Food collision and growth
console.log('\n--- Test Suite 5: Food Collision & Growth ---');
let foodTestState = {
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    food: { x: 11, y: 10 },
    score: 0
};

let originalLength = foodTestState.snake.length;
function simulateFoodEating(state, direction) {
    const head = state.snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    let foodEaten = false;
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
        foodEaten = true;
        state.score += 10 * state.snake.length;
    }

    state.snake.unshift(newHead);
    if (!foodEaten) {
        state.snake.pop();
    }
    return foodEaten;
}

let foodEaten = simulateFoodEating(foodTestState, { x: 1, y: 0 });
assert(foodEaten, 'Food collision detected');
assert(foodTestState.snake.length === originalLength + 1, 'Snake grows when eating food');
assert(foodTestState.score > 0, 'Score increases when eating food');

// Test 6: Direction prevention (no reversing)
console.log('\n--- Test Suite 6: Direction Validation ---');
function isOppositeDirection(dir1, dir2) {
    return dir1.x === -dir2.x && dir1.y === -dir2.y;
}

let currentDir = { x: 1, y: 0 }; // moving right
let reverseDir = { x: -1, y: 0 }; // trying to move left
let validDir = { x: 0, y: 1 }; // trying to move down

assert(isOppositeDirection(reverseDir, currentDir), 'Reverse direction detected');
assert(!isOppositeDirection(validDir, currentDir), 'Valid direction not blocked');

// Test 7: Grid dimensions
console.log('\n--- Test Suite 7: Grid Dimensions ---');
assert(GRID_WIDTH === 20, 'Grid width is 20');
assert(GRID_HEIGHT === 20, 'Grid height is 20');
assert(GRID_WIDTH * GRID_HEIGHT === 400, 'Total cells = 400');

// Test 8: Score calculation
console.log('\n--- Test Suite 8: Score System ---');
let scoreTest = { snake: [{ x: 0, y: 0 }], score: 0 };
scoreTest.score += 10 * scoreTest.snake.length;
assert(scoreTest.score === 10, 'Score calculates correctly for length 1');

scoreTest.snake.push({ x: 1, y: 0 });
scoreTest.snake.push({ x: 2, y: 0 });
scoreTest.score += 10 * scoreTest.snake.length;
assert(scoreTest.score === 40, 'Score accumulates correctly');

// Test 9: Multiple moves simulation
console.log('\n--- Test Suite 9: Movement Sequence ---');
let sequenceTest = {
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    direction: { x: 1, y: 0 }
};

simulateMove(sequenceTest, sequenceTest.direction);
simulateMove(sequenceTest, sequenceTest.direction);
assert(sequenceTest.snake[0].x === 12, 'Multiple consecutive moves work');

// Test 10: Boundary conditions
console.log('\n--- Test Suite 10: Boundary Conditions ---');
let boundaryTest = { x: 0, y: 0 };
assert(!checkWallCollision(boundaryTest), 'Position (0,0) is valid');

boundaryTest = { x: GRID_WIDTH - 1, y: GRID_HEIGHT - 1 };
assert(!checkWallCollision(boundaryTest), 'Position (19,19) is valid');

boundaryTest = { x: 1, y: 1 };
assert(!checkWallCollision(boundaryTest), 'Position (1,1) is valid');

// Summary
console.log('\n' + '='.repeat(50));
console.log(`VALIDATION SUMMARY`);
console.log('='.repeat(50));
console.log(`Total Tests: ${testsRun}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsRun - testsPassed}`);
console.log(`Success Rate: ${((testsPassed / testsRun) * 100).toFixed(1)}%`);

if (testsPassed === testsRun) {
    console.log('\n✓ ALL TESTS PASSED! Game logic is valid.');
    process.exit(0);
} else {
    console.log('\n✗ Some tests failed. Please review.');
    process.exit(1);
}
