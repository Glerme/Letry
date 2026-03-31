# Letry — CLAUDE.md

## What is Letry
Digital LED sign generator. Users type a phrase, customize appearance and animation, and get a shareable URL that displays the animated sign. Target audience: anyone who wants to create a digital sign.

**Key user flow:** type text → pick animation/colors/speed → submit → get shareable URL → sign displays at `/s/[slug]`

## Tech Stack
- **Framework:** Next.js 14+ App Router
- **Language:** TypeScript (strict — no `any`)
- **Styling:** Tailwind CSS
- **Database + Auth:** Supabase (PostgreSQL + Auth)
- **Validation:** Zod
- **Forms:** react-hook-form + @hookform/resolvers
- **IDs:** nanoid
- **Package manager:** pnpm
- **Testing:** Vitest + @testing-library/react
- **Git hooks:** Husky (lint + tests run on every commit — never skip)

## Architecture
- Server Components for reads, Server Actions for mutations
- Three Supabase clients: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`
- Route groups: `(marketing)` public pages, `(auth)` login/register, `(app)` auth-guarded, `(display)` minimal sign display
- LED renderer is a pure Client Component shared between creation preview and display page

## Code Conventions
- **TypeScript only** — no `any`, ever
- **No classes** — use arrow functions and plain objects everywhere
- **Simple and direct** — no premature abstractions, no speculative helpers
- **Language:** English everywhere — code, commits, comments, branch names
- **UI strings:** Portuguese (PT-BR) for user-facing text

## Before Every Commit
Husky enforces this automatically, but be aware:
1. Run lint: `pnpm lint`
2. Run tests: `pnpm test:run`

Never use `--no-verify` to skip hooks.

## Environment Variables
- **Never read `.env` or `.env.local`** — reference `.env.example` only to know available keys
- **Never commit `.env*` files** — they must be in `.gitignore`
- Always add new env vars to `.env.example` with placeholder values

## Security Rules
- Sanitize all user input with Zod before any DB operation
- Use Supabase RLS policies — never trust client-side user_id claims
- No raw SQL with string interpolation
- Auth routes protected via middleware (`/create`, `/dashboard`)
- Signs are readable by anyone (public), writable only by creator

## Anonymous Signs
- Signs can be created without login (user_id = null)
- Anonymous signs persist indefinitely (no expiration)
- Logged-in users can manage (edit/delete) their own signs from the dashboard

## Key Files
```
docs/superpowers/plans/2026-03-30-letry-mvp.md  ← Full MVP spec
supabase/schema.sql                              ← DB schema (run in Supabase dashboard)
src/lib/utils/constants.ts                       ← Shared constants (animations, speeds, colors)
src/components/led/led-display.tsx               ← Main LED renderer (use everywhere)
src/lib/validations/sign.ts                      ← Zod schema for sign data
```

## Development Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Vitest watch
pnpm test:run     # Vitest single run
```
