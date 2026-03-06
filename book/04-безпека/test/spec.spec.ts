/**
 * Розділ 4. Безпека та шифрування — E2EE, passphrase, hash у URL.
 */
import { test, expect } from '@playwright/test';

// ANCHOR: security_tests
test.describe('04-bezpeka: Безпека та шифрування', () => {
  test('на вкладці Demo є опція Enable end-to-end encryption', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel(/enable end-to-end encryption/i)).toBeVisible();
  });

  test('при ввімкненні E2EE з\'являється поле Passphrase', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/enable end-to-end encryption/i).check();
    await expect(page.getByLabel(/passphrase/i).or(page.locator('#passphrase'))).toBeVisible();
  });

  test('Start Meeting з увімкненим E2EE додає hash до URL', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/enable end-to-end encryption/i).check();
    await page.getByRole('button', { name: 'Start Meeting' }).click();
    await expect(page).toHaveURL(/#.+/);
  });

  test('Start Meeting без E2EE не додає hash до URL', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Meeting' }).click();
    expect(page.url()).not.toMatch(/#/);
  });

  test('вкладка Custom також має опцію E2EE', async ({ page }) => {
    await page.goto('/?tab=custom');
    await expect(page.getByLabel(/enable end-to-end encryption/i)).toBeVisible();
  });
});
// ANCHOR_END: security_tests
