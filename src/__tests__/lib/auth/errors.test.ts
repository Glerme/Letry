import { describe, expect, it } from 'vitest';
import {
  AUTH_ERROR_FLAG,
  LOGIN_ERROR_MESSAGE,
  REGISTER_ERROR_MESSAGE,
  hasAuthError,
} from '@/lib/auth/errors';

describe('auth error helpers', () => {
  it('treats any query error as fixed UI error trigger', () => {
    expect(hasAuthError(AUTH_ERROR_FLAG)).toBe(true);
    expect(hasAuthError('anything')).toBe(true);
    expect(hasAuthError(undefined)).toBe(false);
  });

  it('exposes fixed messages', () => {
    expect(LOGIN_ERROR_MESSAGE).toBe('Credenciais inválidas');
    expect(REGISTER_ERROR_MESSAGE).toBe('Não foi possível criar a conta');
  });
});
