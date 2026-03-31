// src/components/led/led-grid.tsx
'use client';

import { LEDDot } from './led-dot';

interface LEDGridProps {
  grid: boolean[][];
  color: string;
}

export const LEDGrid = ({ grid, color }: LEDGridProps) => {
  if (grid.length === 0) return null;
  const cols = grid[0].length;

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: 'var(--dot-gap, 2px)',
        gridTemplateColumns: `repeat(${cols}, var(--dot-size, 8px))`,
        gridTemplateRows: `repeat(${grid.length}, var(--dot-size, 8px))`,
      }}
    >
      {grid.flatMap((row, rowIdx) =>
        row.map((on, colIdx) => (
          <LEDDot key={`${rowIdx}-${colIdx}`} on={on} color={color} />
        ))
      )}
    </div>
  );
};
