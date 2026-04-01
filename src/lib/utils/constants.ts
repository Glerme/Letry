export const ANIMATIONS = ['scroll', 'split-flap', 'fade', 'flip'] as const;
export type AnimationType = (typeof ANIMATIONS)[number];

export const SPEEDS = ['slow', 'normal', 'fast'] as const;
export type SpeedType = (typeof SPEEDS)[number];

export const SPEED_MS: Record<SpeedType, number> = {
  slow: 80,
  normal: 50,
  fast: 25,
};

export const DEFAULT_LED_COLOR = '#ff6600';
export const DEFAULT_BG_COLOR = '#111111';
export const DEFAULT_ANIMATION: AnimationType = 'scroll';
export const DEFAULT_SPEED: SpeedType = 'normal';

export const MAX_TEXT_LENGTH = 200;

export const PROTECTED_ROUTES = ['/create', '/dashboard'] as const;
