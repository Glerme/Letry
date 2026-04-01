'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCustomerFields = (): string | null => {
    if (name.trim().length < 3) return 'Informe seu nome completo.';
    if (!email.includes('@')) return 'Informe um e-mail válido.';
    if (cellphone.trim().length < 8) return 'Informe um celular válido.';
    if (taxId.trim().length < 11) return 'Informe um CPF/CNPJ válido.';
    return null;
  };

  const handleUpgrade = async () => {
    if (!showCustomerForm) {
      setShowCustomerForm(true);
      setError(null);
      return;
    }

    const validationError = validateCustomerFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          returnTo: '/dashboard?billing=success',
          customer: {
            name: name.trim(),
            email: email.trim(),
            cellphone: cellphone.trim(),
            taxId: taxId.trim(),
          },
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
        details?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        setError(data.error ?? data.details ?? 'Não foi possível iniciar o checkout.');
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
        {showCustomerForm ? 'Continuar para pagamento' : label}
      </Button>
      {showCustomerForm && (
        <div className="mt-3 space-y-2">
          <Input
            id={`${plan}-name`}
            label="Nome completo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome completo"
          />
          <Input
            id={`${plan}-email`}
            type="email"
            label="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
          />
          <Input
            id={`${plan}-cellphone`}
            label="Celular"
            value={cellphone}
            onChange={(event) => setCellphone(event.target.value)}
            placeholder="(11) 99999-9999"
          />
          <Input
            id={`${plan}-taxid`}
            label="CPF ou CNPJ"
            value={taxId}
            onChange={(event) => setTaxId(event.target.value)}
            placeholder="000.000.000-00"
          />
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
