'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSubscriptionStatus } from '@/app/(app)/dashboard/actions';
import type { PlanTier } from '@/lib/billing/types';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 15000;

interface BillingSuccessBannerProps {
  initialTier: PlanTier;
}

type BannerState = 'polling' | 'success' | 'timeout';

export const BillingSuccessBanner = ({ initialTier }: BillingSuccessBannerProps) => {
  const router = useRouter();
  const [state, setState] = useState<BannerState>(initialTier === 'pro' ? 'success' : 'polling');
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (state === 'success') {
      router.refresh();
      window.history.replaceState({}, '', '/dashboard');
      return;
    }
  }, [state, router]);

  useEffect(() => {
    if (initialTier === 'pro') return;

    const startedAt = Date.now();

    const poll = async () => {
      if (resolvedRef.current) return;

      const result = await checkSubscriptionStatus();

      if ('tier' in result && result.tier === 'pro') {
        resolvedRef.current = true;
        setState('success');
        return;
      }

      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        resolvedRef.current = true;
        setState('timeout');
        window.history.replaceState({}, '', '/dashboard');
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    };

    const timer = setTimeout(poll, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [initialTier]);

  if (state === 'success') {
    return (
      <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
        Pagamento confirmado! Seu plano agora é <strong>Pro</strong>.
      </div>
    );
  }

  if (state === 'timeout') {
    return (
      <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
        Seu pagamento está sendo processado. Atualize a página em alguns instantes.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] px-4 py-3 text-sm text-zinc-300">
      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      Confirmando seu pagamento…
    </div>
  );
};
