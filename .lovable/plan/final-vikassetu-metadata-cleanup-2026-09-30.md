# Final VikasSetu metadata cleanup

## Goal

Remove stale product branding from browser and social metadata while preserving every dependency and working feature.

## Changes

- Replace the root fallback brand name `VikasLens` with `VikasSetu` in the page title, author, Open Graph title, and description defaults.
- Keep the existing route-specific VikasSetu titles and descriptions for the access, Citizen, and Government Official pages; confirm each remains unique and complete.
- Keep `public/favicon.png`: it is already a 64×64 VikasSetu symbol derived from the project logo, contains no Lovable branding, and is correctly referenced by the root page.
- Keep required internal build tooling, preview diagnostics, and existing Google Maps environment-variable names unchanged; none are visible product branding.
- Do not add a social preview image because the project has no suitable absolute, share-sized image URL; existing title and description previews remain valid.

## Verification

- Search rendered page metadata and public assets for visible Lovable or stale VikasLens branding.
- Confirm `/`, `/citizen`, and `/official` expose their intended VikasSetu title, description, Open Graph fields, Twitter card, and favicon.
- Run the automatic build check and browser-test all three pages for loading errors, broken images, and favicon failures.

## Scope safeguards

No changes to layouts, styling, routes, maps, reports, browser-saved data, images, or citizen/official workflows.
