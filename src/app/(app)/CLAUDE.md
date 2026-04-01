# (app) — Authenticated App Pages

Auth-guarded layout. Access requires login (enforced by middleware).

## Pages
- `/create` — Sign creation page with live preview and ShareDialog on success
- `/dashboard` — User's saved signs (Task 15)

## Actions
- `create/actions.ts` — `createSign(data)` Server Action
  - Validates with signSchema
  - Gets authenticated user (nullable — anonymous signs allowed)
  - Inserts into signs table, retries once on slug collision
  - Returns { success: true, slug } or { success: false, error }

## Pattern
Forms use react-hook-form + zodResolver for client-side validation.
On submit, calls Server Action. Server re-validates with Zod before DB insert.
