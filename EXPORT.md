# Running VikasSetu on your own hosting

The app is fully client-side: reports, photos, and account details are stored
in the visitor's browser (IndexedDB / localStorage), so no backend or database
setup is needed.

## Build

```sh
npm install   # or bun install
npm run build
```

## Google Maps key

The map key in `.env` (`VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`) is
restricted to its original preview domain. On your own domain the district maps
will show a friendly "map unavailable" message instead of the map until you do
one of the following:

1. Add your domain to the key's allowed HTTP referrers in Google Cloud Console
   (APIs & Services → Credentials → the browser key → Application restrictions), or
2. Create your own free Google Maps JavaScript API key and replace the value in
   `.env` before building.

Everything else (login prototype, citizen reporting, official feedback,
languages, district pages) works on any static hosting without changes.
