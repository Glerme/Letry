// src/components/led/led-dot.tsx
'use client';

interface LEDDotProps {
  on: boolean;
  color: string;
}

export const LEDDot = ({ on, color }: LEDDotProps) => (
  <div
    style={{
      width: 'var(--dot-size, 8px)',
      height: 'var(--dot-size, 8px)',
      borderRadius: '50%',
      backgroundColor: on ? color : 'rgba(255,255,255,0.05)',
      opacity: on ? 1 : 0.15,
      boxShadow: on ? `0 0 var(--glow-size, 4px) ${color}` : 'none',
      transition: 'opacity 100ms, box-shadow 100ms',
    }}
  />
);
