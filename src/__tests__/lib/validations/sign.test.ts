import { describe, it, expect } from 'vitest';
import { signIdSchema, signSchema } from '@/lib/validations/sign';
import { ANIMATIONS, SPEEDS } from '@/lib/utils/constants';

describe('signSchema', () => {
  const validInput = {
    text: 'Hello World',
    animation: 'scroll',
    led_color: '#ff6600',
    bg_color: '#111111',
    speed: 'normal',
  };

  it('accepts valid input', () => {
    const result = signSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects empty text', () => {
    const result = signSchema.safeParse({ ...validInput, text: '' });
    expect(result.success).toBe(false);
  });

  it('rejects text over 200 chars', () => {
    const result = signSchema.safeParse({ ...validInput, text: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid animation', () => {
    const result = signSchema.safeParse({ ...validInput, animation: 'blink' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid hex color', () => {
    const result = signSchema.safeParse({ ...validInput, led_color: 'red' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid speed', () => {
    const result = signSchema.safeParse({ ...validInput, speed: 'turbo' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid animations', () => {
    for (const anim of ANIMATIONS) {
      const result = signSchema.safeParse({ ...validInput, animation: anim });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid speeds', () => {
    for (const speed of SPEEDS) {
      const result = signSchema.safeParse({ ...validInput, speed });
      expect(result.success).toBe(true);
    }
  });

  it('accepts valid UUID id', () => {
    const result = signIdSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID id', () => {
    const result = signIdSchema.safeParse('not-a-uuid');
    expect(result.success).toBe(false);
  });
});
