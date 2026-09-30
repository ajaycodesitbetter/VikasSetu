# Running VikasSetu on your own hosting

The app is fully client-side: reports, photos, and account details are stored
in the visitor's browser (IndexedDB / localStorage), so no backend or database
setup is needed.

## Build

```sh
npm install   # or bun install
npm run build
```

## Interactive Maps

The interactive issue reporting and hotspot maps use **OpenStreetMap with Leaflet**.
They are completely free and work out-of-the-box on `localhost` or any production domain with **no API keys, billing accounts, or domain restrictions** needed.

Everything (login prototype, citizen reporting, official feedback,
languages, district pages, hotspot maps) works on any static hosting without changes.
