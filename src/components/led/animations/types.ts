export interface AnimationState {
  /** 2D grid: grid[row][col] = LED on/off */
  grid: boolean[][];
  /** Whether the animation is still running */
  running: boolean;
  /** Internal offset counter (for scroll) */
  offset?: number;
  /** Internal frame counter (for split-flap/fade) */
  frame?: number;
}

export interface AnimationConfig {
  /** Full text bitmap: CHAR_HEIGHT rows × total columns */
  textBitmap: boolean[][];
  /** Number of visible columns in display */
  visibleCols: number;
  /** Tick interval in ms */
  speedMs: number;
}

export interface Animation {
  name: string;
  init(config: AnimationConfig): AnimationState;
  tick(state: AnimationState, config: AnimationConfig): AnimationState;
}
