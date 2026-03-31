# lib/query

TanStack Query v5 infrastructure for client-side data fetching.
All client-side reads use TanStack Query + native fetch → API routes.
No Supabase browser client is used anywhere in this project.

## keys.ts
Query key factory. Always use these keys for consistency and cache invalidation.
- `queryKeys.signs.list()` — all signs for current user
- `queryKeys.signs.detail(slug)` — single sign by slug

## hooks/
Custom React hooks wrapping useQuery/useMutation.
- `useSigns()` — fetch authenticated user's signs list (calls GET /api/signs)
- `useSign(slug)` — fetch single sign by slug (calls GET /api/signs/[slug])

## Adding new hooks
1. Add query key to keys.ts
2. Create hook in hooks/ using useQuery or useMutation
3. Hook calls fetch() to an API route — never imports supabase client
