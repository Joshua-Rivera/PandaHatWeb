# PandaHat Adversarial

A responsive, static research portfolio built with React, TypeScript, Vite, React Router, and Motion. A single-page layout brings together research, member profiles, posters, advisors, and sponsors in a dark research-studio aesthetic.

## Development

From this `web/` directory, run `npm ci`, then `npm run dev`. Use Node.js 24 (the repository root contains `.nvmrc`).

## Validation

Install the browser once with `npx playwright install chromium`, then run `npm run check` for lint, production build (including type checking), and browser tests. Tests run against the built site on port 4173, so standalone `npm run test:e2e` requires a fresh `npm run build` first.

## Content and design

- `src/content.ts`: typed research topics, confirmed team cohort structure, advisor profiles, and site metadata. Replace only the remaining member placeholders when the roster is finalized.
- `src/index.css`: typography and color tokens; `src/App.css`: responsive component styling.
- `src/Graphics.tsx`: original SVG illustrations and temporary branding.

Unconfirmed member bios and research descriptions remain placeholders. Visuals are illustrative, not detector outputs. There is no backend or data collection. Supplied member profiles include contact and external profile links. Fonts load from Google Fonts with system fallbacks.

## Current research structure

- Three hash-addressable research endpoints cover digital watermarking, deepfake analysis, and media authenticity.
- The team view distinguishes 7 full-time researchers from 16 new members in the learning-path onboarding process.
- Advisors are listed as Dr. Nayda Santiago and Dr. Alcibiades Bustillo.
- Member cards open hash endpoints such as `#member/joshua-rivera` with resume-derived education, experience, skills, projects, and approved public links. Resume PDFs are optional and are not loaded until a member-approved path is added to that profile.

## Static hosting

See [deployment preparation](DEPLOYMENT.md) for build settings, routing, automated checks, caching, and remaining launch decisions. The deployable output is `web/dist/` from the repository root.

## Images

Served raster images use WebP with generated width descriptors and responsive `sizes`. Conference photos are from Spring IAP, May 2026, Mayagüez. Mobile collage images are capped at 320 pixels wide; gallery thumbnails at 640 pixels on the long edge. Larger conference photos remain capped at 1600 pixels on the long edge and open on click. The group photo has intermediate responsive versions.

The poster uses quality-85 WebP at its original 1666 × 2500 resolution, with 480- and 960-pixel-wide page previews. Sponsor logos remain lossless and are sized for their display areas; the MIT logo is capped at 1000 pixels wide. Portraits have smaller versions for profile dialogs and phones. Originals stay in `assets/image-originals/`, outside the deployment output.

To regenerate images and `src/image-variants.json`, install Pillow in a Python environment and run `python scripts/optimize-images.py` from the repository root. Use `ResponsiveImage` with an accurate `sizes` value for new responsive image placements. New source files also require references in the relevant content/component.

Animation components use `motion/react-m` and strict `LazyMotion` with `domAnimation`. Features load synchronously to preserve first-render and scroll animation behavior while excluding unused drag/layout features.
