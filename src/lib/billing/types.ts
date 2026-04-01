export const PLAN_TIERS = ['free', 'pro'] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];

export const SUBSCRIPTION_STATUSES = ['pending', 'active', 'past_due', 'canceled'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const BILLING_PLANS = ['pro_monthly_pix', 'pro_annual_pix'] as const;
export type BillingPlanCode = (typeof BILLING_PLANS)[number];

export interface UserSubscription {
  user_id: string;
  plan_tier: PlanTier;
  status: SubscriptionStatus;
  provider: string;
  provider_reference: string;
  current_period_end: string | null;
}
