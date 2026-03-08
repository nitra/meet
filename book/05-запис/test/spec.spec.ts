/**
 * Розділ 5. Запис зустрічей — індикатор запису, меню Recording (якщо endpoint налаштовано).
 */
import { test, expect } from '@playwright/test'

// ANCHOR: recording_tests
test.describe('05-zapis: Запис зустрічей', () => {
  test('головна та кімната завантажуються (базова перевірка для контексту запису)', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Meeting' }).click()
    await expect(page).toHaveURL(/\/rooms\//)
  })

  test('сторінка кімнати готова до відображення UI запису', async ({ page }) => {
    await page.goto('/rooms/record-test-room')
    await expect(page.locator('main')).toBeVisible({ timeout: 15_000 })
  })
})
// ANCHOR_END: recording_tests
