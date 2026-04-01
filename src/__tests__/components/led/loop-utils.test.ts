import { describe, it, expect } from 'vitest';
import {
  buildStaticGrid,
  getFlipCycleDurationMs,
  getScrollCycleTicks,
  shouldFreezeOnTick,
} from '@/components/led/loop-utils';
import type { AnimationType } from '@/lib/utils/constants';

describe('loop-utils', () => {
  it('buildStaticGrid preserves text columns and pads to visible cols', () => {
    const grid = buildStaticGrid(
      [
        [true, false, true],
        [false, true, false],
      ],
      5,
    );

    expect(grid).toEqual([
      [true, false, true, false, false],
      [false, true, false, false, false],
    ]);
  });

  it('getScrollCycleTicks returns full scroll cycle length', () => {
    const ticks = getScrollCycleTicks(20, 30);
    expect(ticks).toBe(50);
  });

  it('shouldFreezeOnTick matches once-mode freeze boundaries', () => {
    expect(shouldFreezeOnTick('fade', 8, 20, 30)).toBe(true);
    expect(shouldFreezeOnTick('fade', 7, 20, 30)).toBe(false);
    expect(shouldFreezeOnTick('scroll', 50, 20, 30)).toBe(true);
    expect(shouldFreezeOnTick('scroll', 49, 20, 30)).toBe(false);
  });

  it('getFlipCycleDurationMs scales with text length and speed', () => {
    const shortNormal = getFlipCycleDurationMs('ABC', 'normal');
    const longNormal = getFlipCycleDurationMs('ABCDEFGHI', 'normal');

    expect(shortNormal).toBeGreaterThan(0);
    expect(longNormal).toBeGreaterThan(shortNormal);
  });

  it('only treats scroll/fade as tick-freeze animations', () => {
    const animations: AnimationType[] = ['scroll', 'fade', 'split-flap', 'flip'];
    const freezeTypes = animations.filter((anim) => shouldFreezeOnTick(anim, 8, 20, 30));

    expect(freezeTypes).toContain('fade');
    expect(freezeTypes).not.toContain('split-flap');
    expect(freezeTypes).not.toContain('flip');
  });
});
