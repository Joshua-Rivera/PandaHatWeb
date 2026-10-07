# Cleanup execution results

Completed October 7, 2026, on local branch `codex/cleanup-unused-files`. The cleanup was executed after user authorization. Nothing was deployed or pushed.

## Changes made

- Removed the four obsolete combined sponsor exports and their two unused responsive manifest records.
- Removed the empty root npm lockfile. npm now manages the app through `web/package.json` and `web/package-lock.json`; the pnpm lockfile was archived and retired.
- Removed unused `SignalArt`/`TopicGraphic` functions, their `useId` import, unused metadata, and obsolete page copy. `PandaMark`, every active source file, all live research content, and member/profile records remain.
- Removed 202 stale CSS selectors associated with the 63 reviewed class names, plus the unused watermark animation. Mixed selectors retain their live branches, cascade order is preserved, and all three stylesheets remain. `App.css` went from 1,592 to 849 lines, including the separate tablet fix.
- Consolidated Adriana Vega's identical small/base WebP files into one responsive source. Both card and dialog portraits were verified at DPR 1, 2, and 3.
- Made the Python optimizer incremental: it preserves existing WebP assets by default and merges manifest records; missing originals cannot empty the manifest; narrow originals do not produce duplicate responsive variants; retired sponsor exports are skipped. Regeneration of existing files requires `--overwrite`.
- Restored and preserved Angel Fernández's original PNG under `assets/image-originals/members/`. His base/small WebP images remain unchanged.
- Moved the mobile Node generators into `web/scripts/`, using the declared `@playwright/test` dependency. Commands are now `npm run images:collage` and `npm run images:sponsors` from `web/`.
- Archived all 11 design-draft files and the stale root build before removing them from the active checkout. Legacy source-quality JPG/PNG images were also recovered into the external archive.
- Removed the unused root dependency installation after generator and clean-install verification. The active `web/node_modules` installation and current `web/dist` output remain.
- Fixed the pre-existing 768px profile close-button obstruction by reserving header space. Added actual pointer-click regression checks for both research years.
- Updated maintenance documentation and moved the public collage README into `web/docs/`.

## Preserved content and assets

All **17 active source files** remain. The public directory now contains **105 tracked files**, down from 111: four unused sponsor files, one duplicate portrait, and one relocated README account for the difference.

Both research years remain, with 22 current members and 12 archived-year members. Shared profiles, Angel's portrait, conference photos and their full-size links, current poster/PDF, hidden 2023 poster and its three images, advisor portraits, current desktop/mobile sponsors, both local fonts and their OFL licenses, source presentation, optional resume behavior, and all existing tests are preserved. Supplied but currently unused Kevin Beltrán profile information was retained.

The four sponsor files and duplicate portrait total **373,324 bytes** of removed image exports, about **364.6 KiB**, outside compressed transfer measurements. The bundled stylesheet shrank from approximately **40.96 kB to 28.19 kB**, about **31%**. The bundled JavaScript shrank from approximately **391.38 kB to 388.69 kB**. These are bundle/file-size measurements, not claims about page-load timing.

The new npm lockfile preserves every direct dependency version from the previously installed working site. A clean isolated `npm ci` was tested before switching the active installation; `react-router-dom` was removed because routing uses the native History/hash APIs.

## Verification

- Final `npm run check`: build/type checking, lint, and **28/28 Playwright tests passed**. The existing Date-render purity warning remains; no new lint error was introduced.
- **6/6 optimizer regression tests passed**, covering empty/missing originals, manifest preservation, explicit overwrite behavior, narrow and wide portraits, retired sponsors, and conference group variants.
- Both mobile generators were exercised in an isolated clean npm installation. All **20 generated mobile images matched the existing outputs byte-for-byte**.
- Incremental optimization against a copy of the real current assets preserved every image and the responsive manifest **byte-for-byte**.
- **42/42 before/after screenshots were pixel-identical**, with matching DOM/layout/style snapshots: both years, widths 375/768/1440, and seven main page views. The intentional modal-header fix is checked separately. See `cleanup-visual-verification.json`.
- Additional **Chromium and WebKit** checks passed for both years at widths **320, 375, 390, 767, 768, 1024, and 1440**. These covered image decoding, absence of local asset HTTP errors and JavaScript errors, menus, profile opening/closing, normal and reduced motion, year curtain transitions, collage spreading/reversal, mobile-to-desktop resizing, legacy routes, and DPR 1/2/3 portrait loading. See `cleanup-browser-verification.json`.
- All paths in the responsive manifest and research content were checked for existence; responsive widths are unique.

WebKit verification exercises the Safari engine; it does not simulate the physical iPhone's browser toolbar or prove a hosting provider's rewrite configuration. No hosting configuration was changed.

## Recovery

Pre-cleanup Git recovery point: **`7255757`**, built on the original **`08ec5f2`**. Cleanup batches are separate local commits, so individual changes can be reverted without restoring unrelated work.

External recovery folder:

`/Users/gianmiranda/.codex/backups/pandahatweb-cleanup-2026-10-07`

It contains:

- `drafts.tar.gz`: complete previous design drafts.
- `dist.tar.gz`: complete retired root build, including original PNG/JPG assets and old generated files.
- `recovered-image-originals/`: individually recovered legacy originals for easier access.
- `angel-fernandez-original.png`: additional copy of the supplied portrait original.
- Previous npm/pnpm lockfiles and saved pre-cleanup diagnostics.
- `visual-verification.tar.gz`: before/after screenshots and detailed comparison snapshots.
- `recovery-manifest.json`: file sizes and SHA-256 checksums.

For example, restore an archive into a separate empty directory with `tar -xzf <archive-path> -C <restore-directory>`, inspect it, and then bring back only the desired files. The current deployment output remains `web/dist`; legacy archives should stay outside it.

`unused-file-inventory.csv` retains the original 168-file audit and adds an execution-status column. `unused-file-cleanup-plan.md` remains the historical plan with a link to this completed execution record.
