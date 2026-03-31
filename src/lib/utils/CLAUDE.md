# lib/utils

## constants.ts
Shared app-wide constants. All animation types, speeds, colors, and limits are defined here.
- `ANIMATIONS` — tuple of valid animation names: scroll, split-flap, fade
- `SPEEDS` — tuple of valid speed names: slow, normal, fast
- `SPEED_MS` — maps speed names to millisecond intervals for animation ticks
- `DEFAULT_*` — default values used by the sign form

## slug.ts
Generates URL-safe 7-character slugs for shareable sign URLs.
- Uses nanoid with a custom alphabet (no ambiguous chars: no i, l, o, 0, 1)
- `SLUG_ALPHABET` — exported for use in tests and validation
- `generateSlug()` — returns a new unique slug
