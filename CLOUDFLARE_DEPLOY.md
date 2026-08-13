# Cloudflare Pages deployment

Build command: `npm run build`
Output directory: `dist`

The LumaRise branding assets used by Login/Register are stored in `public/brand/` and referenced with absolute public paths:
- `/brand/lumarise-logo.svg`
- `/brand/lumarise-bg.svg`

Do not rename or omit the `public/brand` directory when uploading the project to GitHub.

If Cloudflare detects Bun automatically, it is fine to use the same build command. The project does not require a special adapter.
