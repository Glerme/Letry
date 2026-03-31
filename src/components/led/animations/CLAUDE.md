# components/led/animations

Animation system for the LED display. Each animation is a pure state machine.

## types.ts
- `AnimationState` — current grid + running flag + internal counters
- `AnimationConfig` — textBitmap, visibleCols, speedMs
- `Animation` — interface: name, init(), tick()

## Animations
- `scroll` — scrolls text left-to-right in a loop, starts blank
- `fade` — probabilistic fade-in to final text, then loops from frame 0
- `split-flap` — reveals columns left-to-right with a flip effect, stops when done

## Usage
```typescript
import { animations } from '@/components/led/animations';
const anim = animations[animationType];
let state = anim.init(config);
// on each tick:
state = anim.tick(state, config);
setGrid(state.grid);
```

## index.ts
Exports `animations` record mapping AnimationType → Animation.
