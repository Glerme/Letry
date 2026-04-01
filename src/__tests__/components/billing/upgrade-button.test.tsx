import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UpgradeButton } from '@/components/billing/upgrade-button';

const openCustomerForm = () => {
  render(<UpgradeButton />);
  fireEvent.click(screen.getByRole('button', { name: /Fazer upgrade para Pro/i }));
  fireEvent.click(screen.getByRole('button', { name: /Mensal no Pix/i }));
};

describe('UpgradeButton customer fields', () => {
  it('applies brazilian cellphone mask and max length', () => {
    openCustomerForm();

    const cellphoneInput = screen.getByLabelText('Telefone') as HTMLInputElement;
    fireEvent.change(cellphoneInput, { target: { value: '+55 (11) 99999-999999999' } });

    expect(cellphoneInput.value).toBe('(11) 99999-9999');
  });

  it('applies cpf mask and max length for tax id input', () => {
    openCustomerForm();

    const taxIdInput = screen.getByLabelText('CPF ou CNPJ') as HTMLInputElement;
    fireEvent.change(taxIdInput, { target: { value: '52998224725' } });
    expect(taxIdInput.value).toBe('529.982.247-25');

    fireEvent.change(taxIdInput, { target: { value: '4572317400011099999999' } });
    expect(taxIdInput.value).toBe('45.723.174/0001-10');
  });
});
