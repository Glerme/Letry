// src/components/ui/button.tsx
'use client';

import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'border border-[rgba(151,253,255,0.8)] bg-[linear-gradient(135deg,var(--cp-cyan),#95fbff)] text-[#0a1322] hover:brightness-110',
  secondary:
    'border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] text-zinc-100 hover:border-[rgba(70,246,255,0.75)]',
  ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800/70 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-cyan)] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {loading ? 'Carregando...' : children}
  </button>
);
