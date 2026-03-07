/**
 * Розділ 3. Медіа та пристрої — PreJoin (ім'я, відео, аудіо), налаштування.
 */
import { test, expect } from '@playwright/test';

// ANCHOR: media_tests
test.describe('03-media: Медіа та пристрої', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rooms/media-test-room');
  });

  test('PreJoin містить поле для імені учасника', async ({ page }) => {
    const nameInput = page
      .getByRole('textbox', { name: /name|ім'я|username/i })
      .or(page.locator('input[type="text"]').first());
    await expect(nameInput.first()).toBeVisible({ timeout: 15_000 });
  });

  test('PreJoin містить кнопку/перемикач для входу (Join)', async ({ page }) => {
    const joinBtn = page.getByRole('button', { name: /join|enter|увійти/i }).first();
    await expect(joinBtn).toBeVisible({ timeout: 15_000 });
  });

  test('екран PreJoin використовує data-lk-theme', async ({ page }) => {
    await expect(page.locator('main[data-lk-theme="default"]')).toBeVisible();
  });

  test('на сторінці кімнати є основний контент (медіа/конференція)', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
  });
});
// ANCHOR_END: media_tests
