import { afterEach, describe, expect, it } from 'vitest';
import { getBillingProduct } from '@/lib/billing/plans';

const MONTHLY_ENV = 'BILLING_PRO_MONTHLY_BRL';
const ANNUAL_ENV = 'BILLING_PRO_ANNUAL_BRL';

const originalMonthly = process.env[MONTHLY_ENV];
const originalAnnual = process.env[ANNUAL_ENV];

describe('billing product config env', () => {
  afterEach(() => {
    if (originalMonthly === undefined) {
      delete process.env[MONTHLY_ENV];
    } else {
      process.env[MONTHLY_ENV] = originalMonthly;
    }

    if (originalAnnual === undefined) {
      delete process.env[ANNUAL_ENV];
    } else {
      process.env[ANNUAL_ENV] = originalAnnual;
    }
  });

  it('reads monthly and annual prices from env vars', () => {
    process.env[MONTHLY_ENV] = '29.9';
    process.env[ANNUAL_ENV] = '299';

    const monthly = getBillingProduct('pro_monthly_card');
    const annual = getBillingProduct('pro_annual_pix');

    expect(monthly.amount).toBe(29.9);
    expect(annual.amount).toBe(299);
  });

  it('throws when monthly price env is missing', () => {
    delete process.env[MONTHLY_ENV];
    process.env[ANNUAL_ENV] = '299';

    expect(() => getBillingProduct('pro_monthly_card')).toThrowError(
      `Missing ${MONTHLY_ENV}. Check .env.example for required keys.`
    );
  });

  it('throws when annual price env is invalid', () => {
    process.env[MONTHLY_ENV] = '29.9';
    process.env[ANNUAL_ENV] = 'invalid';

    expect(() => getBillingProduct('pro_annual_pix')).toThrowError(
      `${ANNUAL_ENV} must be a valid positive number in BRL.`
    );
  });
});
