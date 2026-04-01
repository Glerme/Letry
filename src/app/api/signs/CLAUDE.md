# api/signs

REST API routes for signs — called by TanStack Query hooks on the client.

## GET /api/signs
Returns authenticated user's signs ordered by created_at DESC.
Requires auth — returns 401 if not authenticated.
Called by: `useSigns()` hook in `src/lib/query/hooks/useSigns.ts`

## GET /api/signs/[slug]
Returns a single sign by slug. Public (signs are readable by anyone via RLS).
Returns 404 if not found.
Called by: `useSign(slug)` hook in `src/lib/query/hooks/useSign.ts`
