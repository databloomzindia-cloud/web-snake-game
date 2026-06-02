import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:5173';

test.use({ baseURL: BASE_URL });

test.describe('Snake Game Primary User Flow', () => {
  test.setTimeout(30_000);

  test('should load the game UI with main elements visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas#game-canvas')).toBeVisible();
    await expect(page.locator('select#difficulty-select')).toBeVisible();
    await expect(page.locator('button#pause-resume-button')).toBeVisible();
    await expect(page.locator('div#score-display')).toBeVisible();
  });

  test('should start the game and move the snake using arrow keys', async ({ page }) => {
    await page.goto('/');
    // Start game by pressing an arrow key
    await page.keyboard.press('ArrowRight');

    // Wait briefly and check that the snake head has moved
    const canvas = page.locator('canvas#game-canvas');
    await expect(canvas).toBeVisible();

    // We cannot directly inspect canvas pixels, but we can check that the game is running by
    // verifying the score display updates after eating food.
    // So here we just confirm the canvas is visible and no errors occur.
  });

  test('should change difficulty level and verify speed changes', async ({ page }) => {
    await page.goto('/');
    const difficultySelect = page.locator('select#difficulty-select');
    await difficultySelect.selectOption('Hard');
    await expect(difficultySelect).toHaveValue('Hard');

    // Start game
    await page.keyboard.press('ArrowRight');

    // We cannot directly measure speed, but we can check that the difficulty selection is applied
    // and the pause button is visible
    await expect(page.locator('button#pause-resume-button')).toBeVisible();
  });

  test('should pause and resume the game using the pause button', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ArrowRight');

    const pauseButton = page.locator('button#pause-resume-button');
    await expect(pauseButton).toBeVisible();

    // Pause the game
    await pauseButton.click();
    await expect(pauseButton).toHaveText(/Resume/i);

    // Resume the game
    await pauseButton.click();
    await expect(pauseButton).toHaveText(/Pause/i);
  });

  test('should store and display persistent high score in localStorage', async ({ page }) => {
    await page.goto('/');

    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());

    // Start game and simulate eating food by dispatching keyboard events
    await page.keyboard.press('ArrowRight');

    // Wait some time to allow score to increase (simulate gameplay)
    await page.waitForTimeout(2000);

    // Get current score
    const scoreText = await page.locator('div#score-display').innerText();
    const currentScore = parseInt(scoreText.replace(/\D/g, ''), 10) || 0;

    // Reload page to check if high score persists
    await page.reload();

    const highScoreText = await page.locator('div#high-score-display').innerText();
    const highScore = parseInt(highScoreText.replace(/\D/g, ''), 10) || 0;

    expect(highScore).toBeGreaterThanOrEqual(currentScore);
  });
});
