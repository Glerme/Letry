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

export const formatCellphoneInput = (value: string): string => {
  const normalized = normalizeCellphone(value).slice(0, 11);

  if (normalized.length === 0) return '';
  if (normalized.length <= 2) return `(${normalized}`;

  const ddd = normalized.slice(0, 2);
  const rest = normalized.slice(2);

  if (normalized.length <= 6) return `(${ddd}) ${rest}`;
  if (normalized.length <= 10) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
};

export const formatTaxIdInput = (value: string): string => {
  const digits = normalizeTaxId(value).slice(0, 14);

  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
};
