# Letry — Source Directory

## Structure
- `app/` — Next.js App Router pages and layouts (route groups: marketing, auth, app, display)
- `components/` — React components (ui/, led/, sign/)
- `lib/` — Utilities, Supabase clients, Zod schemas
- `__tests__/` — Vitest test files mirroring src structure

## Conventions
- All files: TypeScript strict (no `any`)
- No classes — arrow functions only
- Server Components for reads, Server Actions for mutations
- Client Components only when necessary (interactivity, browser APIs)
- UI strings in PT-BR, code/commits/comments in English
