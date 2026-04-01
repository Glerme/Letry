import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/billing/checkout/route';
import { createClient } from '@/lib/supabase/server';
import { createCheckout } from '@/lib/billing/abacate-pay';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/billing/abacate-pay', () => ({
  createCheckout: vi.fn(),
}));

describe('POST /api/billing/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BILLING_PRO_MONTHLY_BRL = '19';
    process.env.BILLING_PRO_ANNUAL_BRL = '190';
    delete process.env.ABACATEPAY_CUSTOMER_ID;
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: null } })),
      },
    } as never);

    const response = await POST(
      new Request('http://localhost/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan: 'pro_monthly_card' }),
      })
    );

    expect(response.status).toBe(401);
  });

  it('returns 400 when customer payload is missing and no default customer id exists', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: 'user-1' } } })),
      },
    } as never);

    const response = await POST(
      new Request('http://localhost/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({
          plan: 'pro_monthly_card',
          returnTo: '/dashboard?billing=success',
        }),
      })
    );

    expect(response.status).toBe(400);
  });

  it('creates checkout when customer payload is provided', async () => {
    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: 'user-1' } } })),
      },
      from: vi.fn(() => ({ upsert })),
    } as never);
    vi.mocked(createCheckout).mockResolvedValue({
      checkoutUrl: 'https://pay.abacatepay.com/checkout_1',
      providerReference: 'bill_1',
    });

    const response = await POST(
      new Request('http://localhost/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({
          plan: 'pro_annual_pix',
          returnTo: '/dashboard?billing=success',
          customer: {
            name: 'Fulano de Tal',
            email: 'fulano@example.com',
            cellphone: '(11) 99999-0000',
            taxId: '123.456.789-00',
          },
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(createCheckout).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ code: 'pro_annual_pix' }),
      '/dashboard?billing=success',
      {
        name: 'Fulano de Tal',
        email: 'fulano@example.com',
        cellphone: '(11) 99999-0000',
        taxId: '123.456.789-00',
      }
    );
    expect(upsert).toHaveBeenCalledOnce();
  });
});
