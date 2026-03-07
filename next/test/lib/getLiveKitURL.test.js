import { describe, expect, test } from 'bun:test';
import { getLiveKitURL } from '../../src/lib/getLiveKitURL.js';

describe('getLiveKitURL', () => {
  test('без region повертає URL без змін', () => {
    const url = 'https://myproject.livekit.cloud';
    const result = getLiveKitURL(url);
    expect(result === url || result === url + '/').toBe(true);
    const resultEmpty = getLiveKitURL(url, '');
    expect(resultEmpty === url || resultEmpty === url + '/').toBe(true);
  });

  test('з region для livekit.cloud вставляє region у hostname', () => {
    const url = 'https://myproject.livekit.cloud';
    const result = getLiveKitURL(url, 'eu');
    expect(result).toContain('myproject.eu.');
    expect(result).toContain('livekit.cloud');
  });

  test('з region для staging livekit.cloud зберігає staging', () => {
    const url = 'https://myproject.staging.livekit.cloud';
    const result = getLiveKitURL(url, 'us');
    expect(result).toContain('myproject.us.staging.livekit.cloud');
  });

  test('не livekit.cloud URL не змінюється при передачі region', () => {
    const url = 'https://custom.example.com';
    const result = getLiveKitURL(url, 'eu');
    expect(result === url || result === url + '/').toBe(true);
  });
});
