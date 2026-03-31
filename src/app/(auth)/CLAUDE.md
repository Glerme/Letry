# (auth) — Authentication Pages

Centered card layout for login and register flows.

## Pages
- `/login` — Email + password sign in via Server Action → redirects to /create on success
- `/register` — Email + password sign up via Server Action → shows email confirmation message
- `/auth/callback` — Handles Supabase email confirmation redirect (exchanges code for session)

## Pattern
Server Actions in page files (inline `'use server'`).
No client-side Supabase — auth mutations go through Server Actions using the server client.
Errors passed via URL search params (?error=...) and decoded in the page.

## Environment
Requires NEXT_PUBLIC_SITE_URL for email redirect in register flow.
