# (display) — Sign Display Page

Minimal layout for showing an animated LED sign at /s/[slug].

## Pages
- `/s/[slug]` — SSR page fetching sign from Supabase, renders LEDDisplay component
  - Generates dynamic OpenGraph metadata with OG image from /api/og/[slug]
  - No navigation, no footer — full-screen sign experience

## Components used
- `LEDDisplay` — the core LED renderer (currently placeholder, Task 6/8 will replace)
- `FullscreenButton` — fixed top-right, toggles fullscreen on click or F key
- `Watermark` — fixed bottom-right branding

## Notes
- `getSign` is called twice (generateMetadata + page) — Next.js deduplicates via request memoization
- backgroundColor set on wrapper div (not just LEDDisplay) so fullscreen shows correct color
