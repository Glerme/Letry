const onlyDigits = (value: string): string => value.replace(/\D/g, '');

const allDigitsEqual = (value: string): boolean => /^(\d)\1+$/.test(value);

const validateCpfCheckDigit = (cpf: string, factor: number): number => {
  const total = cpf
    .slice(0, factor - 1)
    .split('')
    .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0);

  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

export const isValidCpf = (value: string): boolean => {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (allDigitsEqual(cpf)) return false;

  const firstDigit = validateCpfCheckDigit(cpf, 10);
  const secondDigit = validateCpfCheckDigit(cpf, 11);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
};

export const isValidCnpj = (value: string): boolean => {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14) return false;
  if (allDigitsEqual(cnpj)) return false;

  const calculateDigit = (input: string, weights: number[]): number => {
    const total = input
      .split('')
      .reduce((sum, digit, index) => sum + Number(digit) * weights[index], 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(cnpj.slice(0, 12) + String(firstDigit), [
    6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ]);

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
};

export const isValidTaxId = (value: string): boolean => isValidCpf(value) || isValidCnpj(value);

export const isValidBrazilCellphone = (value: string): boolean => {
  const digits = onlyDigits(value);
  const normalized = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  return normalized.length === 10 || normalized.length === 11;
};

export const normalizeCellphone = (value: string): string => {
  const digits = onlyDigits(value);
  return digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
};

export const normalizeTaxId = (value: string): string => onlyDigits(value);
