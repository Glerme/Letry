import { scrollAnimation } from './scroll';
import { fadeAnimation } from './fade';
import { splitFlapAnimation } from './split-flap';
import type { Animation } from './types';
import type { AnimationType } from '@/lib/utils/constants';

export type { Animation, AnimationState, AnimationConfig } from './types';

export const animations: Record<Exclude<AnimationType, 'flip'>, Animation> = {
  scroll: scrollAnimation,
  fade: fadeAnimation,
  'split-flap': splitFlapAnimation,
};
