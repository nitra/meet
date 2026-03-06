import { defineConfig, devices } from '@playwright/test';

/**
 * Конфігурація Playwright для e2e книги.
 * Запуск: pnpm exec playwright test
 * Розділ: pnpm exec playwright test book/01-вступ
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './book',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
