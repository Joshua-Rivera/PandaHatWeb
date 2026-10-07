# PandaHat cleanup audit and deletion plan

Audited October 7, 2026, against commit `08ec5f2`. This is a plan: no application code, assets, dependencies, or existing documents were deleted or changed during this audit. The new report and inventory are the only repository additions.

The audit covered all **168 tracked files**, including **17 source files**, **111 public files**, six test files, three maintenance scripts, 11 design drafts, configuration, documentation, and the original presentation. Ignored build output and dependency directories were also inspected.

## What is safe to remove, and what needs protection

All 17 files under `web/src/` are reachable from `web/src/main.tsx` through imports. **Do not delete any whole source file.** In particular, `Graphics.tsx` still supplies the PandaHat logo even though two other exports in it are unused.

The runtime asset review accounts for 101 public files used by current behavior, three intentionally hidden historical-poster files, and seven files not requested by the app. Those seven include two font licenses and a README; being unrequested does not mean they should all be deleted. Dynamic collage paths, conference-photo links, responsive image variants, both research years, and sponsor `<picture>` sources were included.

The accompanying `unused-file-inventory.csv` classifies each of the 168 tracked files and gives its size, evidence, and recommended action. Unobserved browser requests alone were not used to decide that an asset is unused.

### First deletion batch: confirmed unused sponsor exports

| Exact file | Size | Evidence | Required companion change |
| --- | ---: | --- | --- |
| `web/public/images/sponsors/academic-partners.webp` | 104,844 bytes | No current sponsor, component, HTML, test, or maintenance-script consumer | Remove its entry from `src/image-variants.json` |
| `web/public/images/sponsors/academic-partners-480.webp` | 35,496 bytes | Only reachable through that unused manifest entry | Remove it with the base image |
| `web/public/images/sponsors/mit-lincoln-laboratory-clean.webp` | 156,824 bytes | Current site uses `mit-lincoln-transparent.webp` and mobile variants | Remove its entry from `src/image-variants.json` |
| `web/public/images/sponsors/mit-lincoln-laboratory-clean-480.webp` | 52,324 bytes | Only reachable through that unused manifest entry | Remove it with the base image |

These four files total **349,488 bytes (341.3 KiB)**. They are copied into deployment output today even though the website does not use them. Keep all four current transparent sponsor images and all 12 mobile sponsor variants. The report cannot establish whether an old publicly served asset URL is bookmarked outside this repository; preserve old URL aliases if that is a requirement.

### Other straightforward cleanup

- **Root `package-lock.json`:** it has an empty `packages` object and no sibling root `package.json`. CI, README, and deployment instructions use `web/package-lock.json`. Remove only this empty root lockfile; retain the application's lockfile.
- **`web/public/images/collage/README.md`:** documentation rather than a runtime asset. Move its useful explanation into `web/docs/` or the app README, then remove the public copy. Do not delete the conference thumbnails or mobile collage layers.
- **`web/src/Graphics.tsx`:** remove the unused `SignalArt` and `TopicGraphic` functions and their now-unused `useId` import. Keep `PandaMark` and the file itself.
- **`web/src/content.ts`:** `metadata` is exported but never imported; the page title and description currently come from `web/index.html`. Remove that unused export, then remove its obsolete `content.home` and `content.research` copy, the unused `content.notFound` object, and unused `content.team` fields `eyebrow`, `heading`, `intro`, and `outro`. Keep `content.team.title`, `content.team.onboarding`, the brand, shared Description copy, and all year-specific research/profile content.

These code removals simplify maintenance. Unused JavaScript exports may already be excluded by production tree shaking, so this audit does not promise a particular JavaScript bundle-size reduction.

### Unused dependency

`react-router-dom` is declared in `web/package.json` but no current source file imports it or its routing APIs. `App.tsx` uses native `window.location`, hash changes, and the History API, including the `/team` and `/research` bookmark handling. Remove this dependency through the chosen package manager after resolving the npm/pnpm mismatch; regenerate the applicable lockfile rather than hand-editing package entries. Then verify legacy routes, direct member URLs, year query parameters, and refresh/back navigation. Keep React, React DOM, Motion, and Lucide, which all have current consumers.

### Duplicate portrait: remove only after rewriting the manifest

`adriana-vega.webp` and `adriana-vega-small.webp` have identical SHA-256 hashes, identical dimensions (264 × 540), and identical sizes (23,836 bytes each). Keep `adriana-vega.webp`, update its `image-variants.json` record to contain one 264w candidate, and remove `adriana-vega-small.webp`. Do not simply delete the small file while its `srcSet` entry remains. Update `optimize-images.py` so images narrower than the small target do not recreate duplicate files.

### CSS cleanup: edit selectors, not entire stylesheets

`App.css` has 1,592 lines, and `stack-spread.css` also retains the unused `.home-introduction` block. Static reference review and browser sampling identified **63 class names** associated with older layouts, listed below. Treat these as candidates for per-rule review, not permission to remove arbitrary line ranges.

Remove a selector only after checking that its required class is absent from current JSX, composed class names, DOM updates, and maintained fallback states. In comma-separated rules, remove only the unused selectors; preserve declarations for live selectors. Keep cascade order and media-query boundaries. Remove `@keyframes watermark` only with its unused `.watermark-reveal` consumer. Keep both curtain animations and all mobile collage animations.

Protect `.panda-logo`, `.wipe-newer`, `.is-cover`, `.is-reveal`, `.is-pinned`, `.is-open`, all `avatar-*` variants, hover/focus rules, text-selection styles, reduced-motion styles, the Safari toolbar background, and classes used in member/profile/gallery behaviors. `.button` and `.button-primary` were not observed with current data but support optional resume downloads, so retain them. Keep the archived-poster capability and its shared rules while preserving the historical poster.

Do not treat later overrides of `.header`, `.navigation`, `.avatar`, or `.members-track` as proof that their earlier declarations are useless: these declarations combine across breakpoints and states.

### Preserve or archive before removing

| Item | Why deletion is conditional | Recommendation |
| --- | --- | --- |
| Entire `drafts/` directory: 11 files, 60,951 bytes | No current build/runtime references; still contains previous design work | Archive the complete directory as one unit, then optionally remove it from the active checkout. Git retains tracked history |
| `web/pnpm-lock.yaml` | CI/docs use npm, but current local `web/node_modules` was installed by **pnpm 11.17.0** and includes different dependency versions | Keep it until package-manager standardization is completed. Recommended default is npm to match CI; validate a clean npm install before retiring the pnpm lockfile |
| Root `node_modules/`, about 170 MiB | Both mobile image-generation scripts currently resolve `playwright` from this directory | First make those scripts resolve declared dependencies from the `web` package, validate them in an isolated copy, then remove the root installation |
| Root `dist/`, about 5.2 MiB | Stale output from September 17, but includes PNG/JPG source-quality files missing from `assets/image-originals/` | Recover or archive its useful originals before deleting the old output. It is ignored by Git and cannot be recovered through Git alone |
| `web/dist/`, about 11 MiB | Current deployment/preview output; regenerated by the build | Clear only between builds when no preview or deployment job is using it; rebuild before testing or publishing |
| Root/web `test-results/`, build caches, `.DS_Store` | Ignored local diagnostics and cache files | Remove after preserving any failure traces needed for investigation; not a website speed optimization |
| Empty folders under `assets/image-originals/` | Empty folders are not tracked files | Optional housekeeping, with no deployed-site benefit |

The root `dist` contains old logo, sponsor, professor, 2023 poster, and stock collage images. At least the useful originals should be preserved outside the deployment output rather than discarded as apparently redundant build files.

## Files and content to keep

- `web/index.html`, `main.tsx`, `App.tsx`, `App.css`, `index.css`, and all imported UI hooks/components. Desktop SVG collage and mobile raster collage implement different render paths; keep both.
- `content.ts`, `collage-cards.json`, and the live portion of `image-variants.json`. Conference paths and sponsor filenames are assembled dynamically, so literal text searches alone miss them.
- All current member portraits, including Angel Fernández's base/small WebP pair; both years' members and shared profiles; advisor photos; conference full-size images, thumbnails, small variants, and the group-photo 960px variant.
- Current poster preview/full/PDF files. Retain the three `pandahat-2023` assets and their archived content entry: the archive was intentionally hidden, not requested to be destroyed. Hidden content is not disposable content.
- Both local `.woff2` fonts and both OFL license files. Licenses are required accompanying materials even though the browser does not fetch them.
- All six tests, Playwright config, TypeScript configs, Vite config, lint config, `.nvmrc`, `.gitignore` files, the GitHub Actions workflow, and the active app package/lockfiles. Dev dependencies are needed to build and verify the site.
- All three maintenance scripts. Manual execution rather than an npm-script reference does not make them unused.
- `assets/image-originals/posters/IAP_2026_GroupB_Poster_Draft.pptx`: original presentation, not a disposable deployment file.
- The unused `resumeProfiles["Kevin Beltran"]` record: this contains supplied personal profile information. The current roster only passes his photo and does not consume that record. Preserve it rather than deleting it as dead data; deciding whether to display it is a separate content change.

## Image-generation hazard to resolve before housekeeping

Most folders in `assets/image-originals/` are empty. Only one PPTX is tracked there, and `optimize-images.py` accepts only PNG/JPG/JPEG inputs. It builds a fresh manifest and replaces `web/src/image-variants.json`. With the current original-image inventory, running it would replace the responsive manifest with an empty object. The converted Angel portrait exists in public WebP assets, but its PNG original is no longer present in the current checkout.

Do not run that optimizer or delete responsive files on the assumption that they can currently be rebuilt. Recover available originals from the old output and separately saved photos; make the generator incremental/preserve existing records, or fail clearly when expected originals are absent. Validate changed generators against a temporary copy, not the live public directory.

The two mobile generators import `playwright` from root-installed dependencies. A suitable cleanup is to place them inside the `web` package, use its declared `@playwright/test` dependency, adjust source/output paths, and expose package scripts. They must still be runnable after removing the root dependency directory.

## Execution order and regression checks

1. **Save a recovery point.** Start a `codex/cleanup-unused-files` branch from the then-current checkout. Commit or snapshot current work. Preserve ignored originals/diagnostics separately because a Git commit will not capture them. Record the baseline screenshots and test results.
2. **Remove the four unused sponsor exports and their two manifest records.** Also retire the empty root lockfile and relocate the public README. Run the existing check command and verify sponsor images in both years at mobile and desktop widths.
3. **Remove unused illustration exports and old copy.** Keep `PandaMark`, current shared Description content, `team.title`, and onboarding. Build/type-check, then run the existing browser suite.
4. **Trim stale CSS in small component groups.** Use before/after screenshots with fonts loaded and animations settled. Validate immediately after each group; do not combine this with redesigns or archive removal.
5. **Consolidate the duplicate Adriana portrait.** Update the manifest and generator first. Verify card and profile portraits at device pixel ratios 1, 2, and 3, then run asset tests.
6. **Repair maintenance dependency paths and recover originals.** Test generators in a temporary copy. Choose one package manager, remove the unused react-router-dom dependency, update CI/docs consistently if necessary, and perform a clean install/build/test without relying on root dependencies.
7. **Archive obsolete drafts/output and remove ignored clutter last.** Rebuild `web/dist`. Deployment should continue to publish only `web/dist`, with application root `web`.

Run `npm run check` from `web/` for each meaningful cleanup batch. Keep 2025 and 2026 available, including direct `?year=2025#member/...` URLs. Validate widths **320, 375, 390, 767, 768, 1024, and 1440px**, with short desktop height 600px and representative DPR 1/2/3.

Compare the initial PandaHat collage, spread/reverse animation, native timeline and JavaScript fallback, navigation menu/anchors, year switches in both directions, pinned member gallery, card/profile opening and closing, contact/external links, Angel portrait, featured poster and PDF, 2025 conference thumbnails and full-photo clicks, advisor portraits, and mobile/desktop sponsor sources. Include keyboard navigation, selection, reduced motion, and resizing across 767/768px. Reject cleanup batches with new 404s, undecodable images, JavaScript errors, layout overflow, changed content, or unintentional visual differences.

Chromium automation is the current project baseline. Before a final deployment, check Safari/iOS (especially native scroll behavior and toolbar tint) and Firefox when available; this audit did not verify those engines. Preserve current host rewrites for `/team`, `/research`, and direct refreshes. Local preview does not prove external hosting configuration.

Commit each successful batch separately. Roll back the failing batch rather than deleting more files to compensate. Do not deploy cleanup until the chosen clean-install path, browser checks, and visual comparisons pass.

## Audit verification and existing limitation

- `npm run check` passed: production build/type checking, lint with the pre-existing `new Date()` purity warning at `App.tsx:145`, and **26/26 Playwright tests**.
- Additional browser inspection covered both research years at the seven widths above, navigation, selected profile states, forward/back year curtain transitions, and resizing from mobile to desktop. It observed **zero JavaScript errors**. All 101 statically accounted-for runtime assets exist on disk.
- The wider inspection found an **existing 768px profile-dialog problem**: the `PROFILE / initials` text overlaps the close button and intercepts pointer clicks in sampled profiles in both years. Escape still closes the dialog. This predates cleanup and is not covered by the passing existing tests. Record it as a separate fix and add an explicit 768px close-button check before claiming full behavior equivalence. Avoid removing live profile/SpecialText CSS to conceal it.

## CSS candidate appendix

These class names were absent from sampled DOM states and have no current class consumer identified in the source review. Review their selectors and related media rules before removal. Presence of a word in research data is not a CSS consumer: for example, `ResearchTopic.tags` is rendered using `.eyebrow`, not `.tags`.

```text
about-section, accent-link, endpoint-cta, entry-content, entry-icon, entry-number, entry-title, focus-card, focus-card-top, focus-copy, focus-grid, focus-section, graphic-label, hero, hero-actions, hero-bottom, hero-description, hero-visual, home-introduction, lit, method-grid, method-number, method-section, muted-heading, not-found, page-intro, page-section, placeholder-notice, poster-archive, poster-card, poster-preview, poster-rail, poster-status, professor-card, professor-grid, professor-photo, professor-portrait, research-about, research-art, research-entry, research-focus, research-rail, scan-box, scan-line, scan-orb, semester-pill, sheet-back, sheet-front, signal-art, status, support-placeholder, tags, team-grid, team-group-photo, team-outro, team-rail, team-section, tiny-dot, topic-graphic, visual-bottom, visual-top, watermark-reveal, watermark-sheet
```

The `.home-introduction` rules are in `web/src/components/ui/stack-spread.css`; the other candidates are in `web/src/App.css`. Keep the three stylesheets themselves.
