import type { Animation, AnimationConfig, AnimationState } from './types';

export const splitFlapAnimation: Animation = {
  name: 'split-flap',

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

    // Each "frame group" reveals one column
    const FLIPS_PER_COL = 4;
    const currentCol = Math.floor(frame / FLIPS_PER_COL);

    if (currentCol >= visibleCols) {
      // All columns revealed — show final state
      const finalGrid: boolean[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: visibleCols }, (__, col) => {
          const srcCol = col < totalCols ? col : -1;
          return srcCol >= 0 ? (textBitmap[row][srcCol] ?? false) : false;
        })
      );
      return { grid: finalGrid, running: false, frame };
    }

    const grid: boolean[][] = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: visibleCols }, (__, col) => {
        const srcCol = col < totalCols ? col : -1;
        const target = srcCol >= 0 ? (textBitmap[row][srcCol] ?? false) : false;

        if (col < currentCol) {
          // Already settled columns — show final
          return target;
        }
        if (col === currentCol) {
          // Flipping: show random state regardless of target
          return Math.random() > 0.5;
        }
        // Not yet revealed
        return false;
      })
    );

    return { grid, running: true, frame };
  },
};
