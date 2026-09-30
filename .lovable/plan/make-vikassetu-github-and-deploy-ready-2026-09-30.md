# Make VikasSetu GitHub-and-deploy ready

## Goal

Push the project to GitHub and deploy it elsewhere (own domain) with all images intact and the app working smoothly.

## What is already verified good

- All 13 VikasSetu images are ordinary files inside `src/assets/` (5.1 MB total): login background, logo, six district carousel photos, three Collector portraits, plus `public/favicon.png`. No image pointer files remain and no app code references Lovable's hosting.
- No backend, no database, no login accounts: reports, photos and account details live in the visitor's browser, so any static or server hosting works.
- The only environment variables are the two Google Maps ones, read in browser code, and both map views already fall back to a friendly "map unavailable" message when the key is not allowed.
- The build helper is published on the public npm registry, so a fresh machine can install everything; `bun.lock` is committed for reproducible installs.
- Outside Lovable's build environment the build config honours a hosting target of your choice (default: Cloudflare Workers).

## The one thing that must change before pushing

`.env` is currently committed to Git and holds the Google Maps key. If the repository is made public, that key is exposed.

- Stop tracking `.env` and ignore it, keeping your local copy working.
- Add `.env.example` listing the two variable names with no values, so anyone cloning knows what to set.
- Note: the key remains in Git history. If you push the full history publicly, either push a fresh single-commit snapshot or use your own Google key.

## Hosting setup

- Primary path: Cloudflare Workers, which is what the build already targets by default. I will add the small deploy config with the exact folder paths the build produces, plus a `deploy` script.
- Verified alternatives: Netlify and a plain Node build, by setting the hosting target before building. Whichever you prefer, the steps go in the README.
- On your own host you must supply the Google Maps key yourself (host environment variable, or `.env` locally) and allow your domain in Google Cloud Console — otherwise the maps show the fallback text while everything else works.

## README rewrite

The README currently opens with the wrong title ("Living Icons") and your original chat prompt. It will be replaced with a proper VikasSetu description, how to run it, how to build and deploy, and the Google Maps key step.

## Clean-room proof (the important check)

- Copy only the source (no installed packages, no Git metadata) into a fresh folder, install from scratch, build for the target host, and serve the built output.
- Browser pass on the served build: `/`, `/citizen`, `/official` — every image loads, signup and login work, a citizen report submits and appears in the official queue, official feedback comes back to the citizen, no console errors.
- Typecheck, lint and a final scan for any remaining Lovable-only URL.

## Not changing

- No images deleted (including the two currently unused ones), no changes to languages, district content, report storage, or navigation.

## Technical details

- `.gitignore`: add `.env`. Untrack with `git rm --cached .env` (file stays on disk).
- `.env.example`: `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY=` and `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID=`.
- Hosting target: the build defaults to Cloudflare Workers; alternatives use `NITRO_PRESET=netlify` or a Node preset before `npm run build`. Deploy config file and script added only after a real clean-room build confirms the emitted folder layout.
- Verification uses a clean install in `/tmp`, a production build, a local server for the built output, and the existing Playwright flow for the citizen-to-official round trip.
