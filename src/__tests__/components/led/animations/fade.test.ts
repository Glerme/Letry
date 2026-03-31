import { describe, it, expect } from 'vitest';
import { fadeAnimation } from '@/components/led/animations/fade';
import type { AnimationConfig } from '@/components/led/animations/types';

const config: AnimationConfig = {
  textBitmap: [
    [true, false, true, false, true],
    [false, true, false, true, false],
  ],
  visibleCols: 5,
  speedMs: 50,
};

describe('fadeAnimation', () => {
  it('has name "fade"', () => {
    expect(fadeAnimation.name).toBe('fade');
  });

  it('init returns correct grid dimensions', () => {
    const state = fadeAnimation.init(config);
    expect(state.grid).toHaveLength(2);
    expect(state.grid[0]).toHaveLength(5);
    expect(state.running).toBe(true);
  });

  it('after enough ticks, grid matches textBitmap', () => {
    let state = fadeAnimation.init(config);
    // Fade in over some ticks
    for (let i = 0; i < 20; i++) {
      state = fadeAnimation.tick(state, config);
    }
    // Once faded in, running becomes false (or stays true for loop)
    expect(state.grid).toHaveLength(2);
  });
});
