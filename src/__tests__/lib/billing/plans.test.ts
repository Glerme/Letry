import { describe, expect, it } from 'vitest';
import { canCreateMoreSigns, getPlanLimits, isAnimationAllowedForPlan } from '@/lib/billing/plans';
import type { EffectivePlan } from '@/lib/billing/plans';

const freePlan: EffectivePlan = {
  tier: 'free',
  limits: getPlanLimits('free'),
};

const proPlan: EffectivePlan = {
  tier: 'pro',
  limits: getPlanLimits('pro'),
};

describe('billing plan rules', () => {
  it('allows only scroll animation on free plan', () => {
    expect(isAnimationAllowedForPlan(freePlan, 'scroll')).toBe(true);
    expect(isAnimationAllowedForPlan(freePlan, 'fade')).toBe(false);
    expect(isAnimationAllowedForPlan(freePlan, 'split-flap')).toBe(false);
  });

  it('allows all animations on pro plan', () => {
    expect(isAnimationAllowedForPlan(proPlan, 'scroll')).toBe(true);
    expect(isAnimationAllowedForPlan(proPlan, 'fade')).toBe(true);
    expect(isAnimationAllowedForPlan(proPlan, 'split-flap')).toBe(true);
    expect(isAnimationAllowedForPlan(proPlan, 'flip')).toBe(true);
  });

  it('enforces one active sign on free plan', () => {
    expect(canCreateMoreSigns(freePlan, 0)).toBe(true);
    expect(canCreateMoreSigns(freePlan, 1)).toBe(false);
  });

  it('does not enforce sign count on pro plan', () => {
    expect(canCreateMoreSigns(proPlan, 100)).toBe(true);
  });
});
