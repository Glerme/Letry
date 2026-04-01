import { describe, expect, it } from 'vitest';
import { authSchema } from '@/lib/validations/auth';

describe('authSchema', () => {
  it('accepts valid auth input', () => {
    const result = authSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = authSchema.safeParse({
      email: 'invalid-email',
      password: '123456',
    });

    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = authSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });

    expect(result.success).toBe(false);
  });
});
