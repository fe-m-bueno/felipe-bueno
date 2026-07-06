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

  describe('content source placeholder', () => {
    it('documents that local about content has moved to Contentful', () => {
      expect(about.en.description).toContain('Contentful');
      expect(about.pt.description).toContain('Contentful');
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
    it('English tldr is a non-empty array', () => {
      expect(Array.isArray(about.en.tldr)).toBe(true);
      expect(about.en.tldr.length).toBeGreaterThan(0);
    });

    it('Portuguese tldr is a non-empty array', () => {
      expect(Array.isArray(about.pt.tldr)).toBe(true);
      expect(about.pt.tldr.length).toBeGreaterThan(0);
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
