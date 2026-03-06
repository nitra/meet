/**
 * Розділ 7. Користувацький досвід — PreJoin, меню налаштувань, теми.
 */
import { test, expect } from '@playwright/test';

// ANCHOR: ux_tests
test.describe('07-koristuvach: Користувацький досвід', () => {
  test('PreJoin відображається перед входом у кімнату', async ({ page }) => {
    await page.goto('/rooms/ux-test-room');
    const main = page.locator('main');
    await expect(main).toBeVisible({ timeout: 15_000 });
    const joinButton = page.getByRole('button', { name: /join|enter|увійти/i }).first();
    await expect(joinButton).toBeVisible({ timeout: 10_000 });
  });

  test('додаток використовує data-lk-theme="default"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-lk-theme="default"]').first()).toBeVisible();
  });

  test('головна має footer з посиланнями', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: /LiveKit Cloud/i })).toBeVisible();
  });
});
// ANCHOR_END: ux_tests
