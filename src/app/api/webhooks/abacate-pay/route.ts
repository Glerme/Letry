import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { getBillingProduct } from '@/lib/billing/plans';
import { verifyWebhookSignature } from '@/lib/billing/abacate-pay';
import type { BillingPlanCode, PlanTier, SubscriptionStatus } from '@/lib/billing/types';

const webhookSchema = z.object({
  event: z.string().optional(),
  data: z.object({
    checkout: z
      .object({
        id: z.string(),
        status: z.string().optional(),
        externalId: z.string().nullable().optional(),
      })
      .optional(),
  }).optional(),
});

const parseReference = (
  externalReference: string | null,
  fallbackPlan: string | undefined
): { userId: string; planCode: BillingPlanCode } | null => {
  if (!externalReference) return null;
  const [userId, planCodeRaw] = externalReference.split(':');
  const planCode = (planCodeRaw ?? fallbackPlan) as BillingPlanCode | undefined;

  if (!userId) return null;
  if (
    planCode !== 'pro_monthly_pix' &&
    planCode !== 'pro_monthly_card' &&
    planCode !== 'pro_annual_pix' &&
    planCode !== 'pro_annual_card'
  ) {
    return null;
  }

  return { userId, planCode };
};

const buildSubscriptionState = (
  event: string,
  checkoutStatus: string,
  planCode: BillingPlanCode
): { tier: PlanTier; subscriptionStatus: SubscriptionStatus; currentPeriodEnd: string | null } => {
  const normalizedEvent = event.toLowerCase();
  const normalizedStatus = checkoutStatus.toUpperCase();

  if (normalizedEvent === 'checkout.completed' || normalizedStatus === 'PAID') {
    const product = getBillingProduct(planCode);
    const periodEnd = new Date(Date.now() + product.periodDays * 24 * 60 * 60 * 1000);

    return {
      tier: 'pro',
      subscriptionStatus: 'active',
      currentPeriodEnd: periodEnd.toISOString(),
    };
  }

  if (normalizedStatus === 'PENDING') {
    return {
      tier: 'free',
      subscriptionStatus: 'pending',
      currentPeriodEnd: null,
    };
  }

  return {
    tier: 'free',
    subscriptionStatus: 'canceled',
    currentPeriodEnd: null,
  };
};

export const POST = async (request: Request) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-webhook-signature') ?? request.headers.get('x-signature');

  const webhookSecret = process.env.ABACATEPAY_WEBHOOK_QUERY_SECRET;
  if (webhookSecret) {
    const secretInUrl = new URL(request.url).searchParams.get('webhookSecret');
    if (secretInUrl !== webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret inválido' }, { status: 401 });
    }
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  const jsonBody = (() => {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  })();

  const parsedBody = webhookSchema.safeParse(jsonBody);
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const eventType = parsedBody.data.event ?? '';
  const checkout = parsedBody.data.data?.checkout;

  if (eventType && !eventType.startsWith('checkout.')) {
    return NextResponse.json({ ok: true });
  }
  if (!checkout) {
    return NextResponse.json({ error: 'Payload de checkout inválido' }, { status: 400 });
  }

  try {
    const reference = parseReference(checkout.externalId ?? null, undefined);

    if (!reference) {
      return NextResponse.json({ error: 'Referência de cobrança inválida' }, { status: 400 });
    }

    const state = buildSubscriptionState(eventType, checkout.status ?? 'PENDING', reference.planCode);
    const supabase = createServiceClient();

    const { error } = await supabase.from('user_subscriptions').upsert(
      {
        user_id: reference.userId,
        plan_tier: state.tier,
        status: state.subscriptionStatus,
        provider: 'abacate_pay',
        provider_reference: checkout.id,
        current_period_end: state.currentPeriodEnd,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Error upserting user subscription from webhook:', error.message);
      return NextResponse.json({ error: 'Erro ao sincronizar assinatura' }, { status: 500 });
    }

    try {
      revalidatePath('/dashboard');
      revalidatePath('/create');
    } catch { /* no-op outside Next.js runtime */ }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Abacate Pay webhook:', error);
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 });
  }
};
