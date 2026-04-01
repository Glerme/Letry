import type { Animation, AnimationConfig, AnimationState } from './types';
import { FADE_IN_TICKS } from '../loop-utils';

export const fadeAnimation: Animation = {
  name: 'fade',

  init(config: AnimationConfig): AnimationState {
    const rows = config.textBitmap.length || 7;
    const cols = config.visibleCols;
    return {
      grid: Array.from({ length: rows }, () => Array(cols).fill(false)),
      running: true,
      frame: 0,
    };
  },

  tick(state: AnimationState, config: AnimationConfig): AnimationState {
    const { textBitmap, visibleCols } = config;
    const rows = textBitmap.length;
    const totalCols = textBitmap[0]?.length ?? 0;
    const frame = (state.frame ?? 0) + 1;

    // Early exit: after full fade-in, show exact bitmap and loop
    if (frame >= FADE_IN_TICKS) {
      const finalGrid: boolean[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: visibleCols }, (__, col) => {
          const srcCol = col < totalCols ? col : -1;
          return srcCol >= 0 ? (textBitmap[row][srcCol] ?? false) : false;
        })
      );
      return { grid: finalGrid, running: true, frame: 0 };
    }

    // Probabilistic fade-in
    const progress = Math.min(frame / FADE_IN_TICKS, 1);
    const grid: boolean[][] = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: visibleCols }, (__, col) => {
        const srcCol = col < totalCols ? col : -1;
        const target = srcCol >= 0 ? (textBitmap[row][srcCol] ?? false) : false;
        if (!target) return false;
        return Math.random() < progress;
      })
    );

    return { grid, running: true, frame };
  },
};
