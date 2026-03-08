/**
 * Розділ 1. Вступ — головна сторінка, стек, структура додатку.
 * Перевірка: головна (/), кнопка Start Meeting, посилання, тема.
 */
import { test, expect } from '@playwright/test'

// ANCHOR: intro_tests
test.describe('01-вступ: Вступ', () => {
  test('головна сторінка завантажується та показує заголовок', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Open source video conferencing/i })).toBeVisible()
  })

  test('на головній є кнопка Start Meeting', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Start Meeting' })).toBeVisible()
  })

  test('головна використовує тему LiveKit (data-lk-theme)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main[data-lk-theme="default"]')).toBeVisible()
  })

  test('є посилання на LiveKit Components та LiveKit Cloud', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /LiveKit\s*Components/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /LiveKit\s*Cloud/i }).first()).toBeVisible()
  })
})
// ANCHOR_END: intro_tests
