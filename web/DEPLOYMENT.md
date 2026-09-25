# Deployment preparation

The site builds to static files. No backend, database, runtime secrets, or server process are required. A host and domain have not been selected, and nothing is deployed by the CI workflow.

## Build settings

| Setting | Value |
| --- | --- |
| Application/root directory | `web` |
| Node.js | 24 (repository `.nvmrc`) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Publish directory | `dist` relative to `web`, or `web/dist` from the repository root |

Keep dev dependencies available during the build: TypeScript and Vite are build tools. Publish only the contents of `dist`, not the repository, source resumes, or `node_modules`.

## Validate a release

From `web/`, run `npm ci`, `npx playwright install chromium`, then `npm run check`. This lints, type-checks, builds, and runs browser tests against the production bundle. The browser tests start an isolated preview server on port 4173; keep that port free during checks.

GitHub Actions runs the same checks on pushes and pull requests, and saves a `pandahat-site` artifact after success. Browser failure screenshots and traces are retained for diagnosis. The workflow must pass in GitHub before treating that platform's build as verified.

For a manual inspection, run `npm run preview` after a build. Vite preview is for local verification, not a production server. See [Vite's deployment guide](https://vite.dev/guide/static-deploy).

## Routing and caching

Deploy at the domain root (`/`). Images and navigation currently use root-relative paths; subdirectory hosting requires a separate base-path change.

Configure the host to serve `index.html` for application routes such as `/team` and `/research` without changing the requested URL. The app then handles legacy bookmarks. Real assets must be served before the fallback. Test a direct visit and refresh on both paths after deployment; local preview does not validate a provider's rewrite configuration.

Check direct links `/#member/kelvin-soto` and `/#member/frances-sola` as well as navigation, images, and profile contact links on desktop and mobile.

Allow long-lived immutable caching for hashed files in `/assets/`. Revalidate `index.html` so new deployments load promptly. Files in `/images/` do not have hashed filenames and should not receive immutable caching.

## Remaining launch decisions

- Select the host and final domain; configure its SPA fallback, HTTPS, and caching.
- Complete or intentionally retain the remaining placeholder biographies.
- Review the displayed roster, research copy, contact information, and institutional imagery for the public release.
- Add domain-specific canonical/social metadata and a sitemap once the final URL is known.

Member profiles summarize supplied resumes in `src/content.ts`. Original PDFs are not included in the current profile format; download links remain optional. Fonts load from Google Fonts with local fallback fonts.
