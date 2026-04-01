import type { AnimationType } from '@/lib/utils/constants';
import type { BillingPlanCode, PlanTier, SubscriptionStatus, UserSubscription } from './types';

const PRO_ACTIVE_STATUSES: SubscriptionStatus[] = ['active'];
const FREE_ALLOWED_ANIMATIONS: AnimationType[] = ['scroll'];
const FREE_SIGN_LIMIT = 1;

export interface PlanLimits {
  signLimit: number | null;
  allowedAnimations: AnimationType[] | null;
  showDisplayOverlay: boolean;
}

export interface EffectivePlan {
  tier: PlanTier;
  limits: PlanLimits;
}

export interface BillingProductConfig {
  code: BillingPlanCode;
  title: string;
  amount: number;
  paymentMethod: 'card' | 'pix';
  periodDays: number;
}

const getEnvPriceInBrl = (envName: 'BILLING_PRO_MONTHLY_BRL' | 'BILLING_PRO_ANNUAL_BRL'): number => {
  const rawValue = process.env[envName];
  if (!rawValue) {
    throw new Error(`Missing ${envName}. Check .env.example for required keys.`);
  }

  const amount = Number(rawValue);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${envName} must be a valid positive number in BRL.`);
  }

  return amount;
};

const getBillingProducts = (): Record<BillingPlanCode, BillingProductConfig> => ({
  pro_monthly_pix: {
    code: 'pro_monthly_pix',
    title: 'Letry Pro Mensal (Pix)',
    amount: getEnvPriceInBrl('BILLING_PRO_MONTHLY_BRL'),
    paymentMethod: 'pix',
    periodDays: 30,
  },
  pro_monthly_card: {
    code: 'pro_monthly_card',
    title: 'Letry Pro Mensal (Cartão)',
    amount: getEnvPriceInBrl('BILLING_PRO_MONTHLY_BRL'),
    paymentMethod: 'card',
    periodDays: 30,
  },
  pro_annual_pix: {
    code: 'pro_annual_pix',
    title: 'Letry Pro Anual (Pix)',
    amount: getEnvPriceInBrl('BILLING_PRO_ANNUAL_BRL'),
    paymentMethod: 'pix',
    periodDays: 365,
  },
  pro_annual_card: {
    code: 'pro_annual_card',
    title: 'Letry Pro Anual (Cartão)',
    amount: getEnvPriceInBrl('BILLING_PRO_ANNUAL_BRL'),
    paymentMethod: 'card',
    periodDays: 365,
  },
});

const FREE_LIMITS: PlanLimits = {
  signLimit: FREE_SIGN_LIMIT,
  allowedAnimations: FREE_ALLOWED_ANIMATIONS,
  showDisplayOverlay: true,
};

const PRO_LIMITS: PlanLimits = {
  signLimit: null,
  allowedAnimations: null,
  showDisplayOverlay: false,
};

export const getBillingProduct = (code: BillingPlanCode): BillingProductConfig => getBillingProducts()[code];

export const getPlanLimits = (tier: PlanTier): PlanLimits => {
  if (tier === 'pro') return PRO_LIMITS;
  return FREE_LIMITS;
};

const isActivePro = (subscription: UserSubscription): boolean => {
  if (subscription.plan_tier !== 'pro') return false;
  if (!PRO_ACTIVE_STATUSES.includes(subscription.status)) return false;

  if (!subscription.current_period_end) return false;

  return new Date(subscription.current_period_end).getTime() > Date.now();
};

export const getEffectivePlan = async (userId: string): Promise<EffectivePlan> => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id, plan_tier, status, provider, provider_reference, current_period_end')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const tier: PlanTier = data && isActivePro(data as UserSubscription) ? 'pro' : 'free';

  return {
    tier,
    limits: getPlanLimits(tier),
  };
};

export const isAnimationAllowedForPlan = (plan: EffectivePlan, animation: AnimationType): boolean => {
  if (!plan.limits.allowedAnimations) return true;
  return plan.limits.allowedAnimations.includes(animation);
};

export const canCreateMoreSigns = (plan: EffectivePlan, existingSignCount: number): boolean => {
  if (plan.limits.signLimit === null) return true;
  return existingSignCount < plan.limits.signLimit;
};
