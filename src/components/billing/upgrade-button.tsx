'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface UpgradeButtonProps {
  className?: string;
  plan?: 'pro_monthly_pix' | 'pro_annual_pix';
  fullWidth?: boolean;
  label?: string;
}

export const UpgradeButton = ({
  className,
  plan = 'pro_annual_pix',
  fullWidth = false,
  label = 'Fazer upgrade para Pro',
}: UpgradeButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

      setIsDialogOpen(false);
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Erro de conexão ao iniciar checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setError(null);
    setIsDialogOpen(true);
  };

  return (
    <div className={className}>
      <Button onClick={handleOpenDialog} loading={loading} className={fullWidth ? 'w-full' : ''}>
        {label}
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={plan === 'pro_annual_pix' ? 'Pagar com PIX' : 'Pagar com cartão'}
      >
        <div className="space-y-3">
          <p className="text-sm text-zinc-300">Preencha os dados para continuar no checkout seguro.</p>
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
            label="Telefone"
            value={cellphone}
            onChange={(event) => setCellphone(event.target.value)}
            placeholder="(11) 99999-9999"
          />
          <Input
            id={`${plan}-taxid`}
            label="CPF ou CNPJ"
            value={taxId}
            onChange={(event) => setTaxId(event.target.value)}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleUpgrade} loading={loading}>
              {plan === 'pro_annual_pix' ? 'Gerar PIX' : 'Continuar'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
