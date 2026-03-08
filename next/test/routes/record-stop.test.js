import { describe, expect, test } from 'bun:test'
import { handleRecordStop } from '../../src/routes/record-stop.js'

describe('handleRecordStop', () => {
  test('403 якщо відсутній roomName', async () => {
    const req = new Request('http://localhost/api/record/stop')
    const res = await handleRecordStop(req)
    expect(res.status).toBe(403)
    expect(await res.text()).toContain('roomName')
  })

  test('403 якщо roomName порожній', async () => {
    const req = new Request('http://localhost/api/record/stop?roomName=')
    const res = await handleRecordStop(req)
    expect(res.status).toBe(403)
  })
})
