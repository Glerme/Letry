'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { BillingPlanCode } from '@/lib/billing/types';

interface UpgradeButtonProps {
  className?: string;
  fullWidth?: boolean;
  label?: string;
}

export const UpgradeButton = ({
  className,
  fullWidth = false,
  label = 'Fazer upgrade para Pro',
}: UpgradeButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanCode | null>(null);
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
    if (!selectedPlan) {
      setError('Escolha uma forma de pagamento.');
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
          plan: selectedPlan,
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

      setIsDialogOpen(false);
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Erro de conexão ao iniciar checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedPlan(null);
    setError(null);
    setIsDialogOpen(true);
  };
  const isPixPlan = selectedPlan?.includes('_pix') ?? false;
  const isChoosingPlan = selectedPlan === null;
  const checkoutButtonLabel = isPixPlan ? 'Gerar PIX' : 'Continuar';

  const paymentOptions: Array<{
    plan: BillingPlanCode;
    label: string;
    description: string;
  }> = [
    { plan: 'pro_monthly_pix', label: 'Mensal no Pix', description: 'R$ mensal via Pix' },
    { plan: 'pro_monthly_card', label: 'Mensal no Cartão', description: 'R$ mensal no cartão' },
    { plan: 'pro_annual_pix', label: 'Anual no Pix', description: 'R$ anual via Pix' },
    { plan: 'pro_annual_card', label: 'Anual no Cartão', description: 'R$ anual no cartão' },
  ];

  const handleSelectPlan = (plan: BillingPlanCode) => {
    setSelectedPlan(plan);
    setError(null);
  };

  return (
    <div className={className}>
      <Button onClick={handleOpenDialog} loading={loading} className={fullWidth ? 'w-full' : ''}>
        {label}
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={isChoosingPlan ? 'Escolha a forma de pagamento' : isPixPlan ? 'Pagar com PIX' : 'Pagar com cartão'}
      >
        <div className="space-y-3">
          {isChoosingPlan ? (
            <>
              <p className="text-sm text-zinc-300">Escolha o ciclo e método para continuar.</p>
              <div className="grid gap-2">
                {paymentOptions.map((option) => (
                  <button
                    key={option.plan}
                    type="button"
                    onClick={() => handleSelectPlan(option.plan)}
                    className="w-full rounded-md border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] px-3 py-2 text-left transition-colors hover:border-[var(--cp-cyan)]"
                  >
                    <p className="text-sm font-medium text-white">{option.label}</p>
                    <p className="text-xs text-zinc-300">{option.description}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-300">Preencha os dados para continuar no checkout seguro.</p>
              <Input
                id={`${selectedPlan}-name`}
                label="Nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome completo"
              />
              <Input
                id={`${selectedPlan}-email`}
                type="email"
                label="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
              />
              <Input
                id={`${selectedPlan}-cellphone`}
                label="Telefone"
                value={cellphone}
                onChange={(event) => setCellphone(event.target.value)}
                placeholder="(11) 99999-9999"
              />
              <Input
                id={`${selectedPlan}-taxid`}
                label="CPF ou CNPJ"
                value={taxId}
                onChange={(event) => setTaxId(event.target.value)}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
            </>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            {!isChoosingPlan && (
              <Button variant="ghost" onClick={() => setSelectedPlan(null)} disabled={loading}>
                Voltar
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            {!isChoosingPlan && (
              <Button onClick={handleUpgrade} loading={loading}>
                {checkoutButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
