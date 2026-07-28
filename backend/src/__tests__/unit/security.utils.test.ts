/// <reference path="../../global.d.ts" />
import { sanitizeInput, maskAccountNumber, validateCurrencyCode } from '../utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove script tags and content', () => {
      const malicious = '<script>alert("xss")</script>safe text';
      expect(sanitizeInput(malicious)).toBe('safe text');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeInput('<p>Hello</p> <b>World</b>')).toBe('Hello World');
    });

    it('should remove control characters', () => {
      const withControl = 'hello\u0000\u001Fworld';
      expect(sanitizeInput(withControl)).toBe('helloworld');
    });

    it('should return non-string inputs as-is', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('maskAccountNumber', () => {
    it('should mask a standard 16-digit card number', () => {
      expect(maskAccountNumber('4111-1111-1111-1234')).toBe('****-****-****-1234');
      expect(maskAccountNumber('4111111111111234')).toBe('****-****-****-1234');
    });

    it('should mask with spaces as separators', () => {
      expect(maskAccountNumber('4111 1111 1111 1234')).toBe('****-****-****-1234');
    });

    it('should handle numbers shorter than or equal to 4 digits', () => {
      expect(maskAccountNumber('1234')).toBe('****');
      expect(maskAccountNumber('12')).toBe('****');
    });

    it('should handle IBAN-style numbers', () => {
      expect(maskAccountNumber('GB29 NWBK 6016 1331 9268 19')).toBe('****-****-****-6819');
    });

    it('should return null for null input', () => {
      expect(maskAccountNumber(null)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(maskAccountNumber('')).toBeNull();
    });
  });

  describe('validateCurrencyCode', () => {
    it('should accept valid ISO 4217 codes', () => {
      expect(validateCurrencyCode('USD')).toBe(true);
      expect(validateCurrencyCode('EUR')).toBe(true);
      expect(validateCurrencyCode('GBP')).toBe(true);
      expect(validateCurrencyCode('JPY')).toBe(true);
      expect(validateCurrencyCode('CNY')).toBe(true);
    });

    it('should reject lowercase codes', () => {
      expect(validateCurrencyCode('usd')).toBe(false);
    });

    it('should reject codes with wrong length', () => {
      expect(validateCurrencyCode('US')).toBe(false);
      expect(validateCurrencyCode('USDA')).toBe(false);
      expect(validateCurrencyCode('')).toBe(false);
    });

    it('should reject codes with numbers or symbols', () => {
      expect(validateCurrencyCode('U$D')).toBe(false);
      expect(validateCurrencyCode('U1D')).toBe(false);
    });
  });
});
