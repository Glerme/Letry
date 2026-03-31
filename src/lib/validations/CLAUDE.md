# lib/validations

## sign.ts
Zod schema for sign creation and type definitions.

- `signSchema` — validates sign input from the creation form
  - `text`: 1–200 chars required
  - `animation`: one of 'scroll' | 'split-flap' | 'fade'
  - `led_color` / `bg_color`: valid 6-digit hex color (#rrggbb)
  - `speed`: one of 'slow' | 'normal' | 'fast'
- `SignInput` — inferred type from signSchema (form/mutation payload)
- `Sign` — full DB row type (SignInput + id, slug, user_id, created_at)

## Usage
- Server Actions use signSchema.safeParse() before any DB operation
- API routes use signSchema for POST body validation
- Forms use signSchema via react-hook-form zodResolver
