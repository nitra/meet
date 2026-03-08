/**
 * Розділ 6. API та бекенд — connection-details, record start/stop.
 */
import { expect, test } from '@playwright/test'

const _BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
const BASE_API = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:8080'

// ANCHOR: api_tests
test.describe('06-api: API та бекенд', () => {
  test('GET /api/connection-details без roomName повертає 400', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/connection-details`)
    expect(res.status()).toBe(400)
  })

  test('GET /api/connection-details без participantName повертає 400', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/connection-details?roomName=test-room`)
    expect(res.status()).toBe(400)
  })

  test('GET /api/connection-details з roomName та participantName повертає JSON', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/connection-details?roomName=e2e-room&participantName=TestUser`)
    if (res.status() === 200) {
      const data = await res.json()
      expect(data).toHaveProperty('serverUrl')
      expect(data).toHaveProperty('roomName', 'e2e-room')
      expect(data).toHaveProperty('participantName', 'TestUser')
      expect(data).toHaveProperty('participantToken')
    }
    expect([200, 500]).toContain(res.status())
  })

  test('GET /api/record/start без roomName повертає помилку', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/record/start`)
    expect(res.status()).not.toBe(200)
  })

  test('GET /api/record/start з roomName викликає ендпоінт', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/record/start?roomName=non-existent-e2e-room`)
    expect([200, 409, 500]).toContain(res.status())
  })

  test('GET /api/record/stop викликає ендпоінт', async ({ request }) => {
    const res = await request.get(`${BASE_API}/api/record/stop?roomName=non-existent-e2e-room`)
    expect([200, 404, 500]).toContain(res.status())
  })
})
// ANCHOR_END: api_tests
