# api/og

Dynamic OG image generation for sign share previews.

## [slug]/route.ts
Edge runtime route. Generates a 1200×630 OG image for a given sign slug.
- Fetches sign text, led_color, and bg_color from Supabase
- Renders sign text with LED glow effect using the sign's colors
- Returns 404 if slug not found
- Used in display page metadata: `/api/og/[slug]`

## Notes
- Uses edge runtime — cannot use Next.js cookies() or session auth
- Uses a no-op cookie handler with createServerClient directly
- Public data only (signs are publicly readable via RLS)
