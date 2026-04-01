'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface UpgradeButtonProps {
  className?: string;
  plan?: 'pro_monthly_card' | 'pro_annual_pix';
  fullWidth?: boolean;
  label?: string;
}

export const UpgradeButton = ({
  className,
  plan = 'pro_annual_pix',
  fullWidth = false,
  label = 'Fazer upgrade para Pro',
}: UpgradeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          returnTo: '/dashboard?billing=success',
        }),
      });

      const data = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !data.checkoutUrl) {
        setError(data.error ?? 'Não foi possível iniciar o checkout.');
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Erro de conexão ao iniciar checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button onClick={handleUpgrade} loading={loading} className={fullWidth ? 'w-full' : ''}>
        {label}
      </Button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
