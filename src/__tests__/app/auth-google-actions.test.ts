import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginWithGoogleAction } from '@/app/(auth)/login/page';
import { registerWithGoogleAction } from '@/app/(auth)/register/page';
import { AUTH_ERROR_FLAG } from '@/lib/auth/errors';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { createClient } from '@/lib/supabase/server';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/lib/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

const buildSupabaseMock = ({
  oauthUrl,
  error = null,
}: {
  oauthUrl: string | null;
  error?: { message: string } | null;
}) => {
  const signInWithOAuth = vi.fn(async () => ({
    data: { url: oauthUrl },
    error,
  }));

  return {
    auth: {
      signInWithOAuth,
    },
    __mocks: {
      signInWithOAuth,
    },
  };
};

describe('Google OAuth auth actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = 'https://letry.example';
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      retryAfterSeconds: 0,
    });
  });

  it('redirects login action to provider url when OAuth succeeds', async () => {
    const supabase = buildSupabaseMock({
      oauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?state=1',
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    await expect(loginWithGoogleAction()).rejects.toThrow(
      'NEXT_REDIRECT:https://accounts.google.com/o/oauth2/v2/auth?state=1'
    );
    expect(supabase.__mocks.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'https://letry.example/auth/callback?next=/dashboard',
      },
    });
  });

  it('redirects login action to auth error when OAuth fails', async () => {
    const supabase = buildSupabaseMock({
      oauthUrl: null,
      error: { message: 'oauth failed' },
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    await expect(loginWithGoogleAction()).rejects.toThrow(
      `NEXT_REDIRECT:/login?error=${AUTH_ERROR_FLAG}`
    );
  });

  it('redirects register action to provider url when OAuth succeeds', async () => {
    const supabase = buildSupabaseMock({
      oauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?state=2',
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    await expect(registerWithGoogleAction()).rejects.toThrow(
      'NEXT_REDIRECT:https://accounts.google.com/o/oauth2/v2/auth?state=2'
    );
    expect(supabase.__mocks.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'https://letry.example/auth/callback?next=/dashboard',
      },
    });
  });

  it('redirects register action to auth error when OAuth fails', async () => {
    const supabase = buildSupabaseMock({
      oauthUrl: null,
      error: { message: 'oauth failed' },
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    await expect(registerWithGoogleAction()).rejects.toThrow(
      `NEXT_REDIRECT:/register?error=${AUTH_ERROR_FLAG}`
    );
  });
});
