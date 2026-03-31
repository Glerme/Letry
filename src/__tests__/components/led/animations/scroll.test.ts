import { describe, it, expect } from 'vitest';
import { scrollAnimation } from '@/components/led/animations/scroll';
import type { AnimationConfig } from '@/components/led/animations/types';

const config: AnimationConfig = {
  textBitmap: [
    [true, false, true, false, true],
    [false, true, false, true, false],
  ],
  visibleCols: 5,
  speedMs: 50,
};

describe('scrollAnimation', () => {
  it('has name "scroll"', () => {
    expect(scrollAnimation.name).toBe('scroll');
  });

  it('init returns grid with correct dimensions', () => {
    const state = scrollAnimation.init(config);
    expect(state.grid).toHaveLength(2);
    expect(state.grid[0]).toHaveLength(5);
    expect(state.running).toBe(true);
  });

  it('init starts with all LEDs off (text scrolls in from right)', () => {
    const state = scrollAnimation.init(config);
    const allOff = state.grid.every((row) => row.every((cell) => !cell));
    expect(allOff).toBe(true);
  });

  it('tick returns grid with correct dimensions', () => {
    let state = scrollAnimation.init(config);
    state = scrollAnimation.tick(state, config);
    expect(state.grid[0]).toHaveLength(5);
    expect(state.running).toBe(true);
  });
});
