import type { AnimationType, SpeedType } from '@/lib/utils/constants';

export const FADE_IN_TICKS = 8;
export const FLIP_SCRAMBLE_STEPS = 10;

export const FLIP_TIMINGS: Record<SpeedType, { half: number; stepGap: number; stagger: number }> = {
  slow: { half: 120, stepGap: 60, stagger: 130 },
  normal: { half: 70, stepGap: 25, stagger: 75 },
  fast: { half: 40, stepGap: 10, stagger: 40 },
};

export const buildStaticGrid = (textBitmap: boolean[][], visibleCols: number): boolean[][] => {
  const rows = textBitmap.length;
  const totalCols = textBitmap[0]?.length ?? 0;

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: visibleCols }, (_, col) =>
      col < totalCols ? (textBitmap[row][col] ?? false) : false
    )
  );
};

export const getScrollCycleTicks = (textCols: number, visibleCols: number): number => {
  return textCols + visibleCols;
};

export const shouldFreezeOnTick = (
  animation: AnimationType,
  tickCount: number,
  textCols: number,
  visibleCols: number,
): boolean => {
  if (animation === 'fade') {
    return tickCount >= FADE_IN_TICKS;
  }

  if (animation === 'scroll') {
    return tickCount >= getScrollCycleTicks(textCols, visibleCols);
  }

  return false;
};

export const getFlipCycleDurationMs = (text: string, speed: SpeedType): number => {
  const chars = Math.max((text || ' ').length, 1);
  const timings = FLIP_TIMINGS[speed];
  const maxSteps = FLIP_SCRAMBLE_STEPS + 3;
  const perStepMs = timings.half * 2 + timings.stepGap;
  const lastCharDelay = (chars - 1) * timings.stagger;

  return lastCharDelay + maxSteps * perStepMs + timings.half * 2 + 120;
};
