# PandaHat Adversarial

A responsive, static research portfolio built with React, TypeScript, Vite, React Router, and Motion. Home, Research, and Team feature custom SVG illustrations and a dark research-studio aesthetic.

## Development

Run `npm install`, then `npm run dev`.

## Validation

Run `npm run lint`, `npm run build` (includes type checking), and `npm run test:e2e`. Install the browser once with `npx playwright install chromium`.

## Content and design

- `src/content.ts`: typed research topics, confirmed team cohort structure, advisor profiles, and site metadata. Replace only the remaining member placeholders when the roster is finalized.
- `src/index.css`: typography and color tokens; `src/App.css`: responsive component styling.
- `src/Graphics.tsx`: original SVG illustrations and temporary branding.

Unconfirmed member bios and research descriptions remain placeholders. Visuals are illustrative, not detector outputs. No backend, data collection, performance claims, or external profile links are included. Fonts load from Google Fonts with system fallbacks.

## Current research structure

- Three hash-addressable research endpoints cover digital watermarking, deepfake analysis, and media authenticity.
- The team view distinguishes 7 full-time researchers from 16 new members in the learning-path onboarding process.
- Advisors are listed as Dr. Nayda Santiago and Dr. Alcibiades Bustillo.
- Member cards open hash endpoints such as `#member/joshua-rivera` with resume-derived education, experience, skills, projects, and approved public links. Resume PDFs are optional and are not loaded until a member-approved path is added to that profile.

## Static hosting

Run `npm run build` and publish `dist/`. The host must serve `index.html` for non-file routes such as `/research` and `/team`, preserving the URL (an SPA rewrite, not a redirect). Otherwise refreshing a nested URL will return the host's 404. Unknown client routes render the app's not-found page.

For Netlify, add a `public/_redirects` file containing `/* /index.html 200`. For nginx, use `try_files $uri $uri/ /index.html;`. Configure equivalent rewrites on other hosts. Vite development and preview servers already support this fallback. Deployment is not configured for a specific provider.
