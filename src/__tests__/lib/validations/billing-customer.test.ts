import { describe, expect, it } from 'vitest';
import {
  isValidBrazilCellphone,
  isValidCnpj,
  isValidCpf,
  isValidTaxId,
  normalizeCellphone,
  normalizeTaxId,
} from '@/lib/validations/billing-customer';

describe('billing customer validations', () => {
  it('validates cpf and cnpj correctly', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCnpj('45.723.174/0001-10')).toBe(true);
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false);
    expect(isValidTaxId('529.982.247-25')).toBe(true);
    expect(isValidTaxId('45.723.174/0001-10')).toBe(true);
    expect(isValidTaxId('123')).toBe(false);
  });

  it('validates and normalizes brazilian cellphone', () => {
    expect(isValidBrazilCellphone('(11) 99999-9999')).toBe(true);
    expect(isValidBrazilCellphone('+55 (11) 99999-9999')).toBe(true);
    expect(isValidBrazilCellphone('9999')).toBe(false);
    expect(normalizeCellphone('+55 (11) 99999-9999')).toBe('11999999999');
  });

  it('normalizes tax id to digits', () => {
    expect(normalizeTaxId('529.982.247-25')).toBe('52998224725');
    expect(normalizeTaxId('45.723.174/0001-10')).toBe('45723174000110');
  });
});
