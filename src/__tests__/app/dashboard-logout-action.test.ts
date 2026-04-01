import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logoutAction } from '@/app/(app)/dashboard/page';
import { createClient } from '@/lib/supabase/server';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('dashboard logout action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs out user and redirects to login', async () => {
    const signOutMock = vi.fn(async () => ({ error: null }));
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut: signOutMock },
    } as never);

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT:/login');
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});
