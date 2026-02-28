import { describe, it, expect } from 'vitest';
import { about } from '@/data/about';

describe('about data', () => {
  describe('structure', () => {
    it('exports both English and Portuguese locales', () => {
      expect(about.en).toBeDefined();
      expect(about.pt).toBeDefined();
    });

    it('each locale has required fields', () => {
      for (const locale of ['en', 'pt'] as const) {
        expect(about[locale].title).toBeDefined();
        expect(about[locale].description).toBeDefined();
        expect(about[locale].availability).toBeDefined();
        expect(about[locale].tldr).toBeDefined();
      }
    });
  });

  describe('age calculation', () => {
    it('embeds a reasonable age in the English description', () => {
      // Born August 30, 2001 — age should always be between 22 and 35
      const ageMatch = about.en.description.match(/I am (\d+) years old/);
      expect(ageMatch).not.toBeNull();
      const age = Number(ageMatch![1]);
      expect(age).toBeGreaterThanOrEqual(22);
      expect(age).toBeLessThanOrEqual(35);
    });

    it('embeds a reasonable age in the Portuguese description', () => {
      const ageMatch = about.pt.description.match(/Tenho (\d+) anos/);
      expect(ageMatch).not.toBeNull();
      const age = Number(ageMatch![1]);
      expect(age).toBeGreaterThanOrEqual(22);
      expect(age).toBeLessThanOrEqual(35);
    });

    it('English and Portuguese ages are consistent', () => {
      const enMatch = about.en.description.match(/I am (\d+) years old/);
      const ptMatch = about.pt.description.match(/Tenho (\d+) anos/);
      expect(Number(enMatch![1])).toBe(Number(ptMatch![1]));
    });

    it('English tldr first item contains the computed age', () => {
      const enMatch = about.en.description.match(/I am (\d+) years old/);
      const age = Number(enMatch![1]);
      expect(about.en.tldr[0]).toBe(`${age} years old`);
    });

    it('Portuguese tldr first item contains the computed age', () => {
      const ptMatch = about.pt.description.match(/Tenho (\d+) anos/);
      const age = Number(ptMatch![1]);
      expect(about.pt.tldr[0]).toBe(`${age} anos`);
    });
  });

  describe('availability', () => {
    it('English availability has required keys', () => {
      const { availability } = about.en;
      expect(availability.status).toBeDefined();
      expect(Array.isArray(availability.types)).toBe(true);
      expect(Array.isArray(availability.locations)).toBe(true);
      expect(availability.timezone).toBeDefined();
      expect(availability.overlap).toBeDefined();
    });

    it('Portuguese availability has required keys', () => {
      const { availability } = about.pt;
      expect(availability.status).toBeDefined();
      expect(Array.isArray(availability.types)).toBe(true);
      expect(Array.isArray(availability.locations)).toBe(true);
      expect(availability.timezone).toBeDefined();
      expect(availability.overlap).toBeDefined();
    });

    it('availability types list is non-empty', () => {
      expect(about.en.availability.types.length).toBeGreaterThan(0);
      expect(about.pt.availability.types.length).toBeGreaterThan(0);
    });
  });

  describe('tldr', () => {
    it('English tldr is an array with multiple entries', () => {
      expect(Array.isArray(about.en.tldr)).toBe(true);
      expect(about.en.tldr.length).toBeGreaterThan(1);
    });

    it('Portuguese tldr is an array with multiple entries', () => {
      expect(Array.isArray(about.pt.tldr)).toBe(true);
      expect(about.pt.tldr.length).toBeGreaterThan(1);
    });

    it('English and Portuguese tldr arrays have the same length', () => {
      expect(about.en.tldr.length).toBe(about.pt.tldr.length);
    });

    it('all tldr entries are non-empty strings', () => {
      for (const locale of ['en', 'pt'] as const) {
        for (const item of about[locale].tldr) {
          expect(typeof item).toBe('string');
          expect(item.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
