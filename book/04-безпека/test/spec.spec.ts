/**
 * Розділ 4. Безпека — JWT, регіони (E2EE прибрано з проєкту).
 */
import { test, expect } from '@playwright/test'

// ANCHOR: security_tests
test.describe('04-bezpeka: Безпека', () => {
  test('Start Meeting перенаправляє на кімнату без hash у URL', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Meeting' }).click()
    await expect(page).toHaveURL(/\/rooms\/[^/]+/)
    expect(page.url()).not.toMatch(/#/)
  })

  test('на вкладці Demo немає опції E2EE', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel(/enable end-to-end encryption/i)).toHaveCount(0)
  })

  test('на вкладці Custom немає опції E2EE', async ({ page }) => {
    await page.goto('/?tab=custom')
    await expect(page.getByLabel(/enable end-to-end encryption/i)).toHaveCount(0)
  })
})
// ANCHOR_END: security_tests
