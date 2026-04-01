# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for the full contributor guide (architecture, commands, rules).

## Quick Reference

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Vitest watch
pnpm test:run     # Vitest single run
```

- Use `process.env.VAR` for config values, never raw `ENV`
- For CSS, use tailwindcss v4 utilities and custom properties for theming
