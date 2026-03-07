import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { handleConnectionDetails } from '../../src/routes/connection-details.js';

describe('handleConnectionDetails', () => {
  const savedEnv = { ...process.env };

  beforeAll(() => {
    process.env.LIVEKIT_API_KEY = 'key';
    process.env.LIVEKIT_API_SECRET = 'secret';
    process.env.LIVEKIT_URL = 'https://test.livekit.cloud';
  });

  afterAll(() => {
    process.env = savedEnv;
  });

  test('400 якщо немає roomName', async () => {
    const req = new Request('http://localhost/api/connection-details?participantName=Alice');
    const res = await handleConnectionDetails(req);
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('roomName');
  });

  test('400 якщо roomName порожній', async () => {
    const req = new Request(
      'http://localhost/api/connection-details?roomName=&participantName=Alice',
    );
    const res = await handleConnectionDetails(req);
    expect(res.status).toBe(400);
  });

  test('400 якщо немає participantName', async () => {
    const req = new Request('http://localhost/api/connection-details?roomName=room1');
    const res = await handleConnectionDetails(req);
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('participantName');
  });

  test('200 і JSON з serverUrl, roomName, participantToken, participantName при валідних параметрах', async () => {
    const req = new Request(
      'http://localhost/api/connection-details?roomName=test-room&participantName=Bob',
    );
    const res = await handleConnectionDetails(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    const data = await res.json();
    expect(data).toHaveProperty('serverUrl', 'https://test.livekit.cloud');
    expect(data).toHaveProperty('roomName', 'test-room');
    expect(data).toHaveProperty('participantName', 'Bob');
    expect(data).toHaveProperty('participantToken');
    expect(typeof data.participantToken).toBe('string');
    expect(res.headers.get('Set-Cookie')).toContain('random-participant-postfix');
  });

  test('500 якщо LIVEKIT_URL не задано', async () => {
    const url = process.env.LIVEKIT_URL;
    delete process.env.LIVEKIT_URL;
    try {
      const req = new Request(
        'http://localhost/api/connection-details?roomName=r&participantName=p',
      );
      const res = await handleConnectionDetails(req);
      expect(res.status).toBe(500);
      expect(await res.text()).toContain('LIVEKIT_URL');
    } finally {
      process.env.LIVEKIT_URL = url;
    }
  });
});
