# components/led

LED display renderer. Pure client-side components that render animated LED signs.

## led-dot.tsx
`LEDDot({ on, color })` — single LED pixel.
Uses CSS custom properties: --dot-size (default 8px), --glow-size (default 4px).
When on: shows color with glow. When off: dim circle (0.15 opacity).

## led-grid.tsx
`LEDGrid({ grid, color })` — full grid of LEDDots.
`grid` is a 2D boolean array (rows × cols). Uses CSS grid with --dot-gap.

## led-display.tsx
`LEDDisplay({ text, animation, ledColor, bgColor, speed })` — main component.
- Converts text → 5×7 bitmap using font-bitmap.ts
- Runs chosen animation via setInterval (tick every speedMs ms)
- Updates React state on each tick
- Restarts animation whenever text/animation/speed changes

## font-bitmap.ts
5×7 bitmap font. See font-bitmap.ts for character coverage.

## animations/
Animation state machines. See animations/CLAUDE.md.

## CSS custom properties (set in globals.css)
- --dot-size: 8px
- --dot-gap: 2px
- --glow-size: 4px
