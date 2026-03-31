import { describe, it, expect } from 'vitest';
import { generateSlug, SLUG_ALPHABET } from '@/lib/utils/slug';

describe('generateSlug', () => {
  it('generates a 7-character string', () => {
    const slug = generateSlug();
    expect(slug).toHaveLength(7);
  });

  it('uses only allowed characters', () => {
    const slug = generateSlug();
    for (const char of slug) {
      expect(SLUG_ALPHABET).toContain(char);
    }
  });

  it('generates unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateSlug()));
    expect(slugs.size).toBe(100);
  });
});
