import type { Animation, AnimationConfig, AnimationState } from './types';

const makeBlankGrid = (rows: number, cols: number): boolean[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(false));

export const scrollAnimation: Animation = {
  name: 'scroll',

  init(config: AnimationConfig): AnimationState {
    const rows = config.textBitmap.length || 7;
    return {
      grid: makeBlankGrid(rows, config.visibleCols),
      running: true,
      offset: 0,
    };
  },

  tick(state: AnimationState, config: AnimationConfig): AnimationState {
    const { textBitmap, visibleCols } = config;
    const rows = textBitmap.length;
    const totalCols = textBitmap[0]?.length ?? 0;
    const offset = (state.offset ?? 0) + 1;

    // When offset exceeds total width + visibleCols, loop back
    const maxOffset = totalCols + visibleCols;
    const nextOffset = offset >= maxOffset ? 0 : offset;

    const grid: boolean[][] = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: visibleCols }, (__, col) => {
        const srcCol = col + nextOffset - visibleCols;
        if (srcCol < 0 || srcCol >= totalCols) return false;
        return textBitmap[row][srcCol] ?? false;
      })
    );

    return { grid, running: true, offset: nextOffset };
  },
};
