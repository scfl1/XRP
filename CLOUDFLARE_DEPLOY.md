# Cloudflare Pages deployment

Build command: `npm run build`

Output directory: `dist`

## Asset paths

- Vue application branding is imported from `src/assets/`:
  - `src/assets/lumarise-logo.svg`
  - `src/assets/lumarise-bg.svg`
- Browser/public assets remain in `public/`:
  - `public/favicon.svg`
  - `public/icon-192.png`
  - `public/icon-512.png`
  - `public/manifest.json`
  - `public/qr/*.png`

`Login.vue` and `Register.vue` use Vite imports from `../assets/`, so Rollup resolves the SVG files during production builds.

## Cloudflare

Use:

- Build command: `npm run build`
- Output directory: `dist`

If Cloudflare reports `Could not resolve "../assets/lumarise-logo.svg"`, verify that the deployed commit contains both:
`src/assets/lumarise-logo.svg` and `src/views/Login.vue`.
