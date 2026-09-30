# VikasSetu — People's Voice. Better Development.

An interactive civic-technology prototype: citizens report local issues with a
photo and a marked location, and a government official workspace shows the same
reports so the official can update the status and reply with feedback.

Built for a hackathon demo. **Everything runs in the visitor's browser** — there
is no server, no database and no real account:

- Reports, photos, statuses and official feedback: IndexedDB (`vikassetu-prototype`)
- Name, role, state, district and language: localStorage (`vikassetu-account`)
- OTP is a demo step; any 6 digits accepted, code `123456` shown in the UI

## Try it

```sh
npm install        # or: bun install
npm run dev        # opens the URL printed in your terminal
```

Then:

1. Pick a language (English, हिन्दी, मराठी, বাংলা, தமிழ்) — the whole form follows it.
2. Choose **Citizen** or **Government Official**, fill in the details and create
   the account. Madhya Pradesh offers Gwalior, Bhind and Morena.
3. Citizens land on `/citizen`: district carousel, civic links, notices, district
   profile, Collector details, and the report-a-local-issue section with the
   hotspot map.
4. Officials land on `/official`: the same district imagery, district
   information, official notice boards, and a queue of the citizen reports saved
   in this browser where they can set a status and write feedback.
5. The citizen sees that status and feedback in **Track Reports**.

## Build and deploy

```sh
npm run build
```

The default build targets Cloudflare Workers and is verified working:

```sh
npx wrangler --cwd .output deploy
```

Two other hosting targets were also built and checked:

| Hosting | Command                                  | Output                                           |
| ------- | ---------------------------------------- | ------------------------------------------------ |
| Netlify | `NITRO_PRESET=netlify npm run build`     | `.netlify/` (functions) + `dist/` (static)       |
| Node.js | `NITRO_PRESET=node_server npm run build` | `.output/` — run `node .output/server/index.mjs` |

Any other [Nitro preset](https://nitro.build/deploy) can be selected the same
way with `NITRO_PRESET=<name>`.

## Environment variables

Copy the example file and fill it in before building for your own domain:

```sh
cp .env.example .env
```

| Variable                       | Purpose                                                  |
| ------------------------------ | -------------------------------------------------------- |
| `VITE_GOOGLE_MAPS_BROWSER_KEY` | Google Maps JavaScript API key used by the district maps |
| `VITE_GOOGLE_MAPS_TRACKING_ID` | Optional Maps usage-tracking channel name                |

Both are read in browser code only, so they are visible to visitors — restrict
the key by HTTP referrer in Google Cloud Console.

## Google Maps key

The included development key is restricted to its original preview domain,
so on any new address the district maps show a friendly "map
unavailable" message instead of the map (the rest of the app keeps working).
To get the maps back on your domain, either add your domain to that key's
allowed HTTP referrers (APIs & Services → Credentials → the browser key →
Application restrictions) or create your own free Google Maps JavaScript API
key and put it in `.env` before building. See [EXPORT.md](EXPORT.md).

## Project layout

```text
src/routes/index.tsx        access page: languages, role cards, account form
src/routes/citizen.tsx      citizen platform
src/routes/official.tsx     government official platform
src/components/             issue map, official report console, UI primitives
src/lib/report-store.ts     shared browser report store (IndexedDB)
src/assets/                 logo, login background, district and Collector photos
```

Prototype content (district facts, Collector names and phone numbers, notices)
is compiled from official district portals and is labelled as checked on
26 September 2026 — verify before any real use.
