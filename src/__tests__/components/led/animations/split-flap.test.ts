import { describe, it, expect } from 'vitest';
import { splitFlapAnimation } from '@/components/led/animations/split-flap';
import type { AnimationConfig } from '@/components/led/animations/types';

const config: AnimationConfig = {
  textBitmap: [
    [true, false, true, false, true],
    [false, true, false, true, false],
  ],
  visibleCols: 5,
  speedMs: 50,
};

describe('splitFlapAnimation', () => {
  it('has name "split-flap"', () => {
    expect(splitFlapAnimation.name).toBe('split-flap');
  });

  it('init returns correct grid dimensions', () => {
    const state = splitFlapAnimation.init(config);
    expect(state.grid).toHaveLength(2);
    expect(state.grid[0]).toHaveLength(5);
    expect(state.running).toBe(true);
  });

  it('after enough ticks, eventually stops running', () => {
    let state = splitFlapAnimation.init(config);
    for (let i = 0; i < 100; i++) {
      if (!state.running) break;
      state = splitFlapAnimation.tick(state, config);
    }
    expect(state.running).toBe(false);
  });
});
