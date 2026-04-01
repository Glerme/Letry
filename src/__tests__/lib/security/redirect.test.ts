import { describe, expect, it } from 'vitest';
import { sanitizeRedirectPath } from '@/lib/security/redirect';

describe('sanitizeRedirectPath', () => {
  it('accepts safe relative path', () => {
    const result = sanitizeRedirectPath('/dashboard', '/fallback');
    expect(result).toBe('/dashboard');
  });

  it('rejects protocol-relative path', () => {
    const result = sanitizeRedirectPath('//evil.com', '/fallback');
    expect(result).toBe('/fallback');
  });

  it('returns fallback when value is missing', () => {
    const result = sanitizeRedirectPath(null, '/fallback');
    expect(result).toBe('/fallback');
  });
});
