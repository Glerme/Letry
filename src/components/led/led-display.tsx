// src/components/led/led-display.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { LEDGrid } from './led-grid';
import { FlipDisplay } from './flip-display';
import { getCharBitmap, CHAR_WIDTH, CHAR_HEIGHT } from './font-bitmap';
import { animations } from './animations';
import type { AnimationConfig, AnimationState } from './animations/types';
import { buildStaticGrid, shouldFreezeOnTick } from './loop-utils';
import type { AnimationType, LoopModeType, SpeedType } from '@/lib/utils/constants';
import { SPEED_MS } from '@/lib/utils/constants';

interface LEDDisplayProps {
  text: string;
  animation: AnimationType;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
  loopMode: LoopModeType;
  restartSeconds: number | null;
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
  loopMode,
  restartSeconds,
}: LEDDisplayProps) => {
  const isFlip = animationType === 'flip';

  // Lazy initializer — skipped for 'flip' which has its own renderer
  const [grid, setGrid] = useState<boolean[][]>(() => {
    if (isFlip) return [];
    const config = buildConfig(text, animationType, speed);
    return animations[animationType].init(config).grid;
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animStateRef = useRef<AnimationState | null>(null);
  const tickCountRef = useRef(0);

  useEffect(() => {
    if (isFlip) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (restartRef.current) clearInterval(restartRef.current);

    const anim = animations[animationType];
    const config = buildConfig(text, animationType, speed);

    const clearTick = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const resetAnimation = () => {
      animStateRef.current = anim.init(config);
      tickCountRef.current = 0;
      setGrid(animStateRef.current.grid.map((row) => [...row]));
    };

    const startTick = () => {
      clearTick();
      intervalRef.current = setInterval(() => {
        if (!animStateRef.current) return;
        tickCountRef.current += 1;
        const nextState = anim.tick(animStateRef.current, config);
        animStateRef.current = nextState;
        setGrid(nextState.grid.map((row) => [...row]));

        const textCols = config.textBitmap[0]?.length ?? 0;
        if (
          loopMode === 'once' &&
          shouldFreezeOnTick(animationType, tickCountRef.current, textCols, config.visibleCols)
        ) {
          setGrid(buildStaticGrid(config.textBitmap, config.visibleCols));
          clearTick();
          return;
        }

        if (!nextState.running) {
          if (loopMode === 'once') {
            clearTick();
            return;
          }

          if (loopMode === 'infinite') {
            resetAnimation();
            return;
          }

          clearTick();
        }
      }, config.speedMs);
    };

    resetAnimation();
    startTick();

    if (loopMode === 'restart' && restartSeconds !== null) {
      restartRef.current = setInterval(() => {
        resetAnimation();
        startTick();
      }, restartSeconds * 1000);
    }

    return () => {
      clearTick();
      if (restartRef.current) {
        clearInterval(restartRef.current);
        restartRef.current = null;
      }
    };
  }, [text, animationType, speed, isFlip, loopMode, restartSeconds]);

  if (isFlip) {
    return (
      <FlipDisplay
        text={text}
        ledColor={ledColor}
        bgColor={bgColor}
        speed={speed}
        loopMode={loopMode}
        restartSeconds={restartSeconds}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden p-4 rounded-lg min-h-[120px]"
      style={{ backgroundColor: bgColor }}
    >
      <LEDGrid grid={grid} color={ledColor} />
    </div>
  );
};
