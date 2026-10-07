# Conference collage

The homepage uses WebP thumbnails from `web/public/images/conference/` on desktop and baked layers from `web/public/images/collage-mobile/` on mobile. All 13 Spring IAP photos remain available in the 2025 conference gallery, with their May 2026 event captions preserved.

Run `npm run images:collage` from `web/` to rebuild the mobile layers. The desktop and mobile components use the shared `src/components/ui/collage-cards.json` coordinates; the mobile lettering has its own spacing adjustment in the generator.

Retired stock placeholders and legacy source-quality images are preserved in the recovery archive documented in `cleanup-execution.md`, outside deployment output.
