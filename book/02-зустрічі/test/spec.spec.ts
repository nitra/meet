/**
 * Розділ 2. Зустрічі та кімнати — головна, кімната, PreJoin.
 */
import { test, expect } from '@playwright/test'

// ANCHOR: meetings_tests
test.describe('02-zustrilia: Зустрічі та кімнати', () => {
  test('головна показує кнопку Start Meeting', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Start Meeting' })).toBeVisible()
  })

  test('клік Start Meeting редіректить на /rooms/[roomName]', async ({ page }) => {
    await page.goto('/')
    const startBtn = page.getByRole('button', { name: 'Start Meeting' })
    await expect(startBtn).toBeVisible()
    await Promise.all([page.waitForURL(/\/rooms\/[^/]+$/, { timeout: 15_000 }), startBtn.click()])
    await expect(page).toHaveURL(/\/rooms\/[^/]+$/)
  })

  test("ім'я кімнати в URL унікальне при кожному Start Meeting", async ({ page }) => {
    await page.goto('/')
    await Promise.all([
      page.waitForURL(/\/rooms\/[^/]+$/, { timeout: 15_000 }),
      page.getByRole('button', { name: 'Start Meeting' }).click()
    ])
    const url1 = page.url()
    await page.goto('/')
    await Promise.all([
      page.waitForURL(/\/rooms\/[^/]+$/, { timeout: 15_000 }),
      page.getByRole('button', { name: 'Start Meeting' }).click()
    ])
    const url2 = page.url()
    expect(url1).not.toBe(url2)
  })

  test('сторінка кімнати показує PreJoin (до отримання connection details)', async ({ page }) => {
    await page.goto('/rooms/test-room-demo')
    await expect(page.locator('main[data-lk-theme="default"]')).toBeVisible()
    const joinButton = page.getByRole('button', { name: /join|enter|увійти/i }).first()
    await expect(joinButton).toBeVisible({ timeout: 15_000 })
  })
})
// ANCHOR_END: meetings_tests
