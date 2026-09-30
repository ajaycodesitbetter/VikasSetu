# Fix report submission and replace the header logo

## Report submission

- Replace the single generic warning with clear field-level checks for:
  - title length (5–80 characters)
  - description length (10–500 characters)
  - selected location
- Keep a map click and “Use my location” as valid location choices, and make the chosen coordinates visibly confirmed before submission.
- Preserve the chosen location when the map finishes loading so a delayed map load cannot silently remove it.
- Catch browser-save failures separately, so a storage problem is not shown as a missing-fields problem.
- On success, keep the existing tracking ID, map marker, report list update, and browser-only IndexedDB storage unchanged.

## Uploaded VikasSetu logo

- Use the uploaded VikasSetu artwork in the top-left header, replacing the generated landmark tile and duplicate text.
- Remove only the white image background, preserve the exact symbol, name, colours, and tagline, and store the optimized result as an app asset.
- Fit the full logo proportionally within the existing header height without stretching, clipping, or crowding the navigation; use a smaller responsive size on narrow screens.
- Derive the browser tab icon from the same VikasSetu symbol so the branding stays consistent.

## Verification

- Submit a report using a map click and using browser location, including a photo, and confirm it appears immediately and after reload.
- Check that each incomplete field shows the correct guidance and receives focus.
- Verify the header logo, menu controls, and report flow on desktop and mobile without changing saved accounts, languages, district content, or existing reports.
- Confirm the citizen page builds and runs without browser errors.

## Technical details

- Keep the existing client-side prototype architecture: account data in localStorage and reports/photos in IndexedDB.
- Reuse the existing semantic design tokens and header layout; no backend, authentication, or district-data changes.
