- Keep VikasLens as a client-side interactive prototype until real authentication is explicitly requested, so access flows never imply stored accounts.
- Size icons inside a shadcn `Button` with the trailing important suffix (e.g. `size-5!`), because the button base's `[&_svg]:size-4` descendant rule outranks a plain `size-5` and silently forces every glyph to 16px.
- Keep Citizen and Government Official experiences on dedicated routes, because their workflows will grow independently after the shared access page.
- Keep district profiles source-led and district-aware, with time-sensitive Collector details visibly date-stamped and linked to official profiles.
- Store citizen issue reports, compressed-size photos, statuses, and official feedback through the shared browser report store in IndexedDB, because both prototype experiences need one local source without implying a live government submission.

- All images are bundled local files in src/assets (no CDN pointer files), so exports work anywhere.
- Both map loaders hook window.gm_authFailure to show the friendly fallback when the Google key blocks a domain.
- Keep the default build on Cloudflare Workers and choose other hosting at build time with `NITRO_PRESET` (e.g. `netlify`, `node_server`), because the app is fully client-side and Nitro bakes the deploy target into the build.
- Keep `.env` uncommitted and `.env.example` as the template with both variable names, because the Google Maps key is browser-visible and must be supplied per hosting target.
