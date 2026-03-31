# lib/supabase

Supabase client utilities. There are only TWO clients — server and middleware.
There is NO browser client. Client-side DB access goes through API routes.

## server.ts
`createClient()` — async factory for server-side Supabase client.
Use in: Server Components, API route handlers, Server Actions.
Reads and writes session cookies via Next.js `cookies()`.

## middleware.ts
`updateSession(request)` — refreshes the Supabase auth session on every request.
Use only in: `src/middleware.ts`.
Also handles redirect of unauthenticated users away from /create and /dashboard.

## Rules
- Never import from this directory in Client Components
- Never create a browser Supabase client anywhere in this project
- Always use `createClient()` (not the raw `createServerClient`) in app code
