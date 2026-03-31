// src/components/led/led-display.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { LEDGrid } from './led-grid';
import { getCharBitmap, CHAR_WIDTH, CHAR_HEIGHT } from './font-bitmap';
import { animations } from './animations';
import type { AnimationConfig, AnimationState } from './animations/types';
import type { AnimationType, SpeedType } from '@/lib/utils/constants';
import { SPEED_MS } from '@/lib/utils/constants';

interface LEDDisplayProps {
  text: string;
  animation: AnimationType;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
}

const textToBitmap = (text: string): boolean[][] => {
  if (!text) return Array.from({ length: CHAR_HEIGHT }, () => []);
  const chars = text.toUpperCase().split('').map(getCharBitmap);
  // 1-column gap between characters
  const totalCols = chars.length * (CHAR_WIDTH + 1) - 1;
  const bitmap: boolean[][] = Array.from({ length: CHAR_HEIGHT }, () =>
    Array(totalCols).fill(false)
  );
  chars.forEach((charBits, charIdx) => {
    const startCol = charIdx * (CHAR_WIDTH + 1);
    for (let row = 0; row < CHAR_HEIGHT; row++) {
      for (let col = 0; col < CHAR_WIDTH; col++) {
        const bit = (charBits[row] >> (CHAR_WIDTH - 1 - col)) & 1;
        bitmap[row][startCol + col] = bit === 1;
      }
    }
  });
  return bitmap;
};

const buildConfig = (
  text: string,
  animationType: AnimationType,
  speed: SpeedType,
): AnimationConfig => {
  const textBitmap = textToBitmap(text);
  const textCols = textBitmap[0]?.length ?? 0;
  const visibleCols =
    animationType === 'scroll'
      ? Math.max(textCols, 30)
      : Math.min(textCols, 60);
  return { textBitmap, visibleCols, speedMs: SPEED_MS[speed] };
};

export const LEDDisplay = ({
  text,
  animation: animationType,
  ledColor,
  bgColor,
  speed,
}: LEDDisplayProps) => {
  // Lazy initializer computes the first frame without calling setState inside an effect
  const [grid, setGrid] = useState<boolean[][]>(() => {
    const config = buildConfig(text, animationType, speed);
    return animations[animationType].init(config).grid;
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep a mutable ref to animation state so the interval closure stays current
  const animStateRef = useRef<AnimationState | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const anim = animations[animationType];
    const config = buildConfig(text, animationType, speed);
    animStateRef.current = anim.init(config);
    // Show first frame — allowed here because it mirrors the lazy initializer
    setGrid(animStateRef.current.grid.map((row) => [...row]));

    intervalRef.current = setInterval(() => {
      if (!animStateRef.current) return;
      animStateRef.current = anim.tick(animStateRef.current, config);
      setGrid(animStateRef.current.grid.map((row) => [...row]));

      // Stop when animation signals it is done
      if (!animStateRef.current.running) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, config.speedMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, animationType, speed]);

  return (
    <div
      className="flex items-center justify-center overflow-hidden p-4 rounded-lg min-h-[120px]"
      style={{ backgroundColor: bgColor }}
    >
      <LEDGrid grid={grid} color={ledColor} />
    </div>
  );
};
