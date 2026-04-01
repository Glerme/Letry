'use client';

import { useState, type InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = ({
  label,
  error,
  className = '',
  id,
  ...props
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          className={`w-full rounded-md border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] px-3 py-2 pr-12 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--cp-cyan)] disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-zinc-300 transition-colors hover:text-white"
          aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {isVisible ? 'Ocultar' : 'Ver'}
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};
