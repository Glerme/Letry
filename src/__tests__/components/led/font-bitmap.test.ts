import { describe, it, expect } from 'vitest';
import { getCharBitmap, CHAR_WIDTH, CHAR_HEIGHT } from '@/components/led/font-bitmap';

describe('font-bitmap', () => {
  it('exports correct dimensions', () => {
    expect(CHAR_WIDTH).toBe(5);
    expect(CHAR_HEIGHT).toBe(7);
  });

  it('returns an array of 7 numbers for any character', () => {
    const bitmap = getCharBitmap('A');
    expect(bitmap).toHaveLength(7);
    bitmap.forEach((row) => expect(typeof row).toBe('number'));
  });

  it('returns same fallback for unknown characters', () => {
    const unknown1 = getCharBitmap('€');
    const unknown2 = getCharBitmap('~');
    expect(unknown1).toEqual(unknown2);
  });

  it('A and B have different bitmaps', () => {
    expect(getCharBitmap('A')).not.toEqual(getCharBitmap('B'));
  });

  it('lowercase maps to uppercase', () => {
    expect(getCharBitmap('a')).toEqual(getCharBitmap('A'));
  });

  it('digits have unique bitmaps', () => {
    const bitmaps = ['0','1','2','3','4','5','6','7','8','9'].map(getCharBitmap);
    const unique = new Set(bitmaps.map(b => JSON.stringify(b)));
    expect(unique.size).toBe(10);
  });
});
