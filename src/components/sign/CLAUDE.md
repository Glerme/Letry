# components/sign

Sign-specific components used across creation and display flows.

## share-dialog.tsx
`ShareDialog({ slug, onClose })` — shown after sign creation.
- Displays the full shareable URL (/s/[slug])
- Copy to clipboard with 2s feedback
- Opens sign in new tab

## watermark.tsx
`Watermark` — fixed branding in bottom-right of display page.
Links back to letry.app home.

## sign-form.tsx
`SignForm` — full creation form with react-hook-form + zodResolver.
Live preview via useWatch. Calls createSign Server Action. Shows ShareDialog on success.

## sign-preview.tsx
`SignPreview` — thin wrapper around LEDDisplay with a rounded border.

## sign-card.tsx
`SignCard({ sign })` — dashboard card for each sign.
- LED-styled text preview with inline colors
- Inline two-step delete confirmation (no native confirm dialog)
- Shows delete errors inline
- "Abrir" link opens sign in new tab

## fullscreen-button.tsx
`FullscreenButton` — fixed top-right, toggles fullscreen on click or F key press.
