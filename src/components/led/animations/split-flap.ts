import type { Animation, AnimationConfig, AnimationState } from './types';
import { CHAR_WIDTH } from '../font-bitmap';

// Frames of random pixel noise shown per character before it settles
const SCRAMBLE_FRAMES = 12;
// Frames of delay between each character starting its scramble (stagger)
const STAGGER_FRAMES = 4;
// Column stride per character: 5px wide + 1px gap
const CHAR_STEP = CHAR_WIDTH + 1;

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

    const numChars = Math.ceil(visibleCols / CHAR_STEP);
    const lastSettleFrame = (numChars - 1) * STAGGER_FRAMES + SCRAMBLE_FRAMES;

    if (frame > lastSettleFrame) {
      const finalGrid: boolean[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: visibleCols }, (__, col) =>
          col < totalCols ? (textBitmap[row][col] ?? false) : false
        )
      );
      return { grid: finalGrid, running: false, frame };
    }

    const grid: boolean[][] = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: visibleCols }, (__, col) => {
        const charIdx = Math.floor(col / CHAR_STEP);
        const startFrame = charIdx * STAGGER_FRAMES;
        const settleFrame = startFrame + SCRAMBLE_FRAMES;

        if (frame < startFrame) return false;

        if (frame >= settleFrame) {
          return col < totalCols ? (textBitmap[row][col] ?? false) : false;
        }

        // Scrambling — random pixel noise
        return Math.random() > 0.5;
      })
    );

    return { grid, running: true, frame };
  },
};
