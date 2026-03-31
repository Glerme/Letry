// src/components/ui/color-picker.tsx
'use client';

import { type InputHTMLAttributes } from 'react';

interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const ColorPicker = ({ label, error, className = '', id, ...props }: ColorPickerProps) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
    )}
    <div className="flex items-center gap-2">
      <input
        type="color"
        id={id}
        className={`h-9 w-12 cursor-pointer rounded border border-zinc-700 bg-zinc-900 p-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
        {...props}
      />
      <span className="text-sm text-zinc-400">{String(props.value ?? '')}</span>
    </div>
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);
