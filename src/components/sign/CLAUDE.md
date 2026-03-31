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

## (future)
- sign-form.tsx — creation form with live preview
- sign-preview.tsx — LED display preview wrapper
- sign-card.tsx — dashboard card per sign
- fullscreen-button.tsx — fullscreen toggle for display page
