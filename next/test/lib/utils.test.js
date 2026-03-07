import { describe, expect, test } from 'bun:test';
import { getCookieExpirationTime, parseCookies, randomString } from '../../src/lib/utils.js';

describe('utils', () => {
  describe('randomString', () => {
    test('повертає рядок заданої довжини', () => {
      expect(randomString(0)).toBe('');
      expect(randomString(4).length).toBe(4);
      expect(randomString(10).length).toBe(10);
    });

    test('містить лише дозволені символи (a-z, 0-9)', () => {
      const allowed = /^[a-z0-9]+$/;
      for (let i = 0; i < 5; i++) {
        expect(randomString(8)).toMatch(allowed);
      }
    });
  });

  describe('getCookieExpirationTime', () => {
    test('повертає валідний UTC рядок дати', () => {
      const result = getCookieExpirationTime();
      expect(typeof result).toBe('string');
      const parsed = new Date(result);
      expect(Number.isNaN(parsed.getTime())).toBe(false);
    });

    test('час пізніший за поточний (приблизно +2 години)', () => {
      const before = Date.now();
      const result = getCookieExpirationTime();
      const after = Date.now();
      const parsed = new Date(result).getTime();
      const twoHoursMs = 2 * 60 * 60 * 1000;
      expect(parsed).toBeGreaterThanOrEqual(before + twoHoursMs - 1000);
      expect(parsed).toBeLessThanOrEqual(after + twoHoursMs + 1000);
    });
  });

  describe('parseCookies', () => {
    test('повертає порожній об’єкт для undefined/null/порожнього рядка', () => {
      expect(parseCookies(undefined)).toEqual({});
      expect(parseCookies('')).toEqual({});
    });

    test('парсить один cookie', () => {
      expect(parseCookies('foo=bar')).toEqual({ foo: 'bar' });
    });

    test('парсить кілька cookies', () => {
      expect(parseCookies('a=1; b=2; c=3')).toEqual({ a: '1', b: '2', c: '3' });
    });

    test('значення з знаком дорівнює не розбиває', () => {
      expect(parseCookies('session=abc=xyz')).toEqual({ session: 'abc=xyz' });
    });

    test('ігнорує пробіли навколо', () => {
      expect(parseCookies('  key = value  ')).toEqual({ key: 'value' });
    });
  });
});
