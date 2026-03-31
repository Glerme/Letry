# components/ui

Reusable low-level UI primitives. All are Client Components.

## Components
- `Button` — primary/secondary/ghost/danger variants, sm/md/lg sizes, loading state
- `Input` — text input with label, error message, forwarded ref
- `Select` — dropdown with options array, label, error, forwarded ref
- `Dialog` — modal with overlay, Escape key close, click-outside close
- `ColorPicker` — color input with hex value display

## Rules
- No external component libraries (no shadcn, no radix) — hand-written
- PT-BR for all user-facing strings (e.g. 'Carregando...', 'Fechar')
- Tailwind CSS v4 only for styling
- All accept standard HTML attributes via spreading
