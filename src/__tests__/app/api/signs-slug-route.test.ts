import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/signs/[slug]/route';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('GET /api/signs/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: false,
      retryAfterSeconds: 15,
    });

    const response = await GET(new Request('http://localhost/api/signs/demo'), {
      params: Promise.resolve({ slug: 'demo' }),
    });

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('15');
    expect(await response.json()).toEqual({
      error: 'Muitas requisições. Tente novamente.',
    });
    expect(createClient).not.toHaveBeenCalled();
  });
});
