import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/webhooks/abacate-pay/route';
import { createClient } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/billing/abacate-pay';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/billing/abacate-pay', () => ({
  verifyWebhookSignature: vi.fn(),
}));

describe('POST /api/webhooks/abacate-pay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BILLING_PRO_MONTHLY_BRL = '19';
    process.env.BILLING_PRO_ANNUAL_BRL = '190';
  });

  it('returns 401 when signature is invalid', async () => {
    vi.mocked(verifyWebhookSignature).mockReturnValue(false);

    const response = await POST(
      new Request('http://localhost/api/webhooks/abacate-pay', {
        method: 'POST',
        body: JSON.stringify({ event: 'checkout.completed', data: { checkout: { id: 'bill_1' } } }),
      })
    );

    expect(response.status).toBe(401);
  });

  it('activates pro plan for paid checkout', async () => {
    vi.mocked(verifyWebhookSignature).mockReturnValue(true);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const response = await POST(
      new Request('http://localhost/api/webhooks/abacate-pay', {
        method: 'POST',
        headers: {
          'x-webhook-signature': 'ok',
        },
        body: JSON.stringify({
          event: 'checkout.completed',
          data: {
            checkout: {
              id: 'bill_10',
              status: 'PAID',
              externalId: 'user-1:pro_annual_pix:123',
            },
          },
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(upsert).toHaveBeenCalledOnce();
    expect(upsert.mock.calls[0][0]).toMatchObject({
      user_id: 'user-1',
      plan_tier: 'pro',
      status: 'active',
      provider: 'abacate_pay',
    });
  });
});
