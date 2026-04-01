import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { BILLING_PLANS, type BillingPlanCode } from '@/lib/billing/types';
import { createCheckout } from '@/lib/billing/abacate-pay';
import { getBillingProduct } from '@/lib/billing/plans';
import {
  isValidBrazilCellphone,
  isValidTaxId,
  normalizeCellphone,
  normalizeTaxId,
} from '@/lib/validations/billing-customer';

const customerSchema = z.object({
  name: z.string().min(3, 'Nome inválido'),
  email: z.string().email('E-mail inválido'),
  cellphone: z
    .string()
    .refine(isValidBrazilCellphone, 'Celular inválido')
    .transform(normalizeCellphone),
  taxId: z
    .string()
    .refine(isValidTaxId, 'CPF/CNPJ inválido')
    .transform(normalizeTaxId),
});

const checkoutSchema = z.object({
  plan: z.enum(BILLING_PLANS),
  returnTo: z
    .string()
    .startsWith('/', 'URL de retorno inválida')
    .default('/dashboard?billing=success'),
  customer: customerSchema.optional(),
});

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  if (!parsed.data.customer && !process.env.ABACATEPAY_CUSTOMER_ID) {
    return NextResponse.json(
      { error: 'Preencha seus dados para iniciar o checkout.' },
      { status: 400 }
    );
  }

  try {
    const product = getBillingProduct(parsed.data.plan as BillingPlanCode);
    const { checkoutUrl, providerReference } = await createCheckout(
      user.id,
      product,
      parsed.data.returnTo,
      parsed.data.customer ?? null
    );

    await supabase.from('user_subscriptions').upsert(
      {
        user_id: user.id,
        plan_tier: 'free',
        status: 'pending',
        provider: 'abacate_pay',
        provider_reference: providerReference,
        current_period_end: null,
      },
      { onConflict: 'user_id' }
    );

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown checkout error';
    console.error('Error creating Abacate Pay checkout:', details);
    return NextResponse.json({ error: 'Erro ao iniciar checkout', details }, { status: 500 });
  }
};
