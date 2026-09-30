# Remove unnecessary Lovable branding safely

## Goal

Deliver a clean VikasSetu codebase without unnecessary Lovable branding while preserving the working app, maps, images, export setup, and deployment support.

## Changes

- Remove the “Built with Lovable” footer from the README.
- Rewrite export and Google Maps guidance so it refers neutrally to the existing preview key and the deployment domain, rather than presenting Lovable as part of the product.
- Keep all visible VikasSetu branding, including the uploaded logo, browser icon, title, district imagery, and page metadata.

## What will remain unchanged

- Keep `@lovable.dev/vite-tanstack-config`, its configuration import, and the existing map environment-variable names because they are implementation dependencies, not visible branding; removing or renaming them could break builds or maps.
- Keep the preview-only error reporting helper because it becomes a harmless no-op after export and does not display branding to visitors.
- Keep internal project instructions required for continued editing; they do not appear in the downloaded app or website UI.
- Do not alter any citizen or official workflow, browser-saved data, routes, images, map behavior, or styling.

## Verification

- Search all user-facing pages and documentation for remaining promotional Lovable text.
- Run the existing type/build checks.
- Open the access, Citizen, and Government Official pages and confirm they still load with the VikasSetu logo and no new browser errors.
