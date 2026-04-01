// src/components/ui/select.tsx
'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`rounded-md border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--cp-cyan)] disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
);

Select.displayName = 'Select';
