import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/utils/emailValidation';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it('accepts a standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('accepts email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('accepts email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('accepts email with dots in local part', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });

    it('accepts email with numbers', () => {
      expect(validateEmail('user123@example123.com')).toBe(true);
    });

    it('accepts email with hyphen in domain', () => {
      expect(validateEmail('user@my-domain.com')).toBe(true);
    });

    it('accepts short TLD', () => {
      expect(validateEmail('user@example.io')).toBe(true);
    });

    it('accepts longer TLD', () => {
      expect(validateEmail('user@example.online')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('rejects email with no @ symbol', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('rejects email with no local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('rejects email with no domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('rejects email with no TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('rejects email with space in local part', () => {
      expect(validateEmail('user name@example.com')).toBe(false);
    });

    it('rejects email with space in domain', () => {
      expect(validateEmail('user@exam ple.com')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('rejects email with multiple @ signs', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
    });

    it('rejects plain text', () => {
      expect(validateEmail('not-an-email')).toBe(false);
    });

    it('rejects email with leading space', () => {
      expect(validateEmail(' user@example.com')).toBe(false);
    });

    it('rejects email with trailing space', () => {
      expect(validateEmail('user@example.com ')).toBe(false);
    });
  });
});
