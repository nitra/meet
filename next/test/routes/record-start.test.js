import { describe, expect, test } from 'bun:test';
import { handleRecordStart } from '../../src/routes/record-start.js';

describe('handleRecordStart', () => {
  test('403 якщо відсутній roomName', async () => {
    const req = new Request('http://localhost/api/record/start');
    const res = await handleRecordStart(req);
    expect(res.status).toBe(403);
    expect(await res.text()).toContain('roomName');
  });

  test('403 якщо roomName порожній', async () => {
    const req = new Request('http://localhost/api/record/start?roomName=');
    const res = await handleRecordStart(req);
    expect(res.status).toBe(403);
  });
});
