import { describe, it, expect } from 'vitest';
import { contactFormSchema } from '@/lib/validation';

const validData = {
  name: 'Felipe Bueno',
  email: 'user@example.com',
  message: 'This is a valid message that is long enough.',
};

describe('contactFormSchema', () => {
  describe('name field', () => {
    it('accepts a valid name', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects name shorter than 2 characters', () => {
      const result = contactFormSchema.safeParse({ ...validData, name: 'A' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it('rejects empty name', () => {
      const result = contactFormSchema.safeParse({ ...validData, name: '' });
      expect(result.success).toBe(false);
    });

    it('accepts name with exactly 2 characters', () => {
      const result = contactFormSchema.safeParse({ ...validData, name: 'Jo' });
      expect(result.success).toBe(true);
    });

    it('rejects name longer than 100 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('accepts name with exactly 100 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'A'.repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email field', () => {
    it('accepts a valid email', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects malformed email', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('rejects disposable email from mailinator.com', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        email: 'user@mailinator.com',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors.email;
        expect(errors?.some((e) => e.includes('Temporary emails'))).toBe(true);
      }
    });

    it('rejects disposable email from guerrillamail.com', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        email: 'user@guerrillamail.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects disposable email from yopmail.com', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        email: 'user@yopmail.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email with no domain', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        email: 'user@',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('message field', () => {
    it('accepts a valid message', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects message shorter than 10 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'Short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.message).toBeDefined();
      }
    });

    it('accepts message with exactly 10 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'A'.repeat(10),
      });
      expect(result.success).toBe(true);
    });

    it('rejects message longer than 1000 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'A'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it('accepts message with exactly 1000 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'A'.repeat(1000),
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty message', () => {
      const result = contactFormSchema.safeParse({ ...validData, message: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('honeypot field', () => {
    it('passes when honeypot is omitted', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('passes when honeypot is an empty string', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        honeypot: '',
      });
      expect(result.success).toBe(true);
    });

    it('fails schema validation when honeypot is non-empty (bot detected at schema level)', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        honeypot: 'bot-fill',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors.honeypot;
        expect(errors?.some((e) => e.includes('Spam detected'))).toBe(true);
      }
    });
  });

  describe('full form validation', () => {
    it('reports all field errors at once', () => {
      const result = contactFormSchema.safeParse({
        name: '',
        email: 'bad',
        message: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.email).toBeDefined();
        expect(errors.message).toBeDefined();
      }
    });
  });
});
