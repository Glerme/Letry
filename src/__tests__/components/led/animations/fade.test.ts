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

  it('after FADE_IN_TICKS ticks, resets frame to 0 (loops)', () => {
    let state = fadeAnimation.init(config);
    // Run exactly FADE_IN_TICKS ticks
    for (let i = 0; i < 8; i++) {
      state = fadeAnimation.tick(state, config);
    }
    // Should have looped (frame reset to 0)
    expect(state.frame).toBe(0);
    expect(state.running).toBe(true);
    expect(state.grid).toHaveLength(2);
  });
});
