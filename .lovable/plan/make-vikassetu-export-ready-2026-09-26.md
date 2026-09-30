# Make VikasSetu export-ready

## Goal

The project must build and run correctly outside Lovable (own hosting, Netlify/Vercel/self-host) with no broken images or maps.

## Problems found

1. **Five images are loaded from Lovable's hosting, not from the project.**
   The login background, the scene image, and the three Collector portraits are stored as pointer files (`*.asset.json`) that resolve to Lovable-only URLs (`/__l5e/assets-v1/...`). After export, those URLs stop working and the login page and district profiles lose their images.
   - Used in: `src/routes/index.tsx` (login background), `src/routes/citizen.tsx` and `src/routes/official.tsx` (3 Collector portraits).

2. **The Google Maps key only works on Lovable's preview address.**
   The map key in `.env` is restricted to Lovable domains — this is why tiles already fail on localhost. On any new hosting address, the district maps will show an error instead of the map.

3. **Everything else is already export-safe.**
   - Reports, photos, account details: stored in the browser (IndexedDB/localStorage) — work anywhere, no server needed.
   - District carousel photos and the logo: already local files in the project.
   - The error-reporting helper is a safe no-op outside Lovable.
   - Build is currently clean.

## What I will do

### 1. Make the five hosted images local

- Download the actual image files and save them into `src/assets/` as normal files.
- Change the imports in `index.tsx`, `citizen.tsx`, and `official.tsx` to use the local files.
- Delete the now-unused pointer files.
- Visually confirm the login page and both district profile sections look identical.

### 2. Make the map fail gracefully and document the key step

- Confirm both map components already show a clear "map unavailable" state instead of a broken box when Google blocks the key (add one if missing).
- Add a short `EXPORT.md` note at the project root explaining: to make maps work on your own domain, add that domain to the Google Maps key's allowed websites in Google Cloud Console (or create your own free key and put it in `.env`).

### 3. Final verification

- Clean build + typecheck.
- Browser pass over `/`, `/citizen`, `/official`: images load, login/signup works, report submission and official feedback round trip work, no console errors.

## Technical details

- No new dependencies; no changes to report storage, languages, or navigation.
- Images are imported as bundled assets, so they are copied into the build output automatically.
