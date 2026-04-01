// src/components/ui/color-picker.tsx
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          ref={ref}
          className={`h-9 w-12 cursor-pointer rounded border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] p-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--cp-cyan)] ${className}`}
          {...props}
        />
        <span className="text-sm text-zinc-400">{String(props.value ?? '')}</span>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
);
ColorPicker.displayName = 'ColorPicker';
