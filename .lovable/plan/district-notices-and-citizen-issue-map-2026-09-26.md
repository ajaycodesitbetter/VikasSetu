# District notices and citizen issue map

## Goal

Improve the district notices, then add a polished citizen-reporting section where people can raise a local issue with photos and a location and immediately see it marked on a district map.

## District notice improvements

- Replace the current generic notice rows with district-aware notice entries for Gwalior, Bhind, and Morena.
- Show a clear publication date, responsible department, notice title, and official-source action on every entry.
- Keep notice content source-led; label any demonstration item clearly instead of presenting it as an official live notice.
- Give meaningful icons accessible names where they convey information, and keep purely decorative icons hidden from screen readers.
- Preserve all five interface languages for headings, dates, department labels, actions, and accessibility text.

## Raise an issue

- Add a new full-width section directly below the district profile.
- Build a clear form for issue category, short title, description, photo upload, and location.
- Support Roads, Water, Sanitation, Health, Electricity, and Other, with the responsible department shown automatically.
- Let the citizen use their current location or place/adjust a marker on the map before submitting.
- Validate required fields, file type, file size, location, and text lengths with clear inline messages.
- Show accessible photo previews with remove controls and useful alternative text.

## Map and hotspot experience

- Follow the uploaded reference with a wide interactive district map, top tabs, category filters, numbered clusters, and individual issue markers.
- Keep “Reported needs” as the main active view; include working “Known works” and “Facilities” views using clearly labelled prototype data.
- Filter markers by issue category and selected district.
- Clicking a marker or cluster will reveal the issue title, category, department, date, status, photo preview, and location summary.
- After submission, add the new issue immediately, focus its marker, update relevant hotspot counts, and show a confirmation with a browser-generated tracking ID.
- Use distinct marker shapes/icons and text labels so status and category are not communicated by colour alone.

## Prototype storage and privacy

- Keep the experience client-side with no real account or shared public database.
- Save reports and uploaded photo data in browser storage so they remain available on the same device after refresh.
- Explain near the form that reports are private prototype data on this device and are not sent to a government department.
- Seed a small set of clearly marked sample reports per district so hotspot clustering and filters are visible before the first submission.

## Map setup

- Use Google Maps for the interactive map and district framing, with app-owned markers and controls.
- Link the Google Maps connection during implementation; no server-side location search or public proxy will be added.
- Use the citizen’s chosen coordinates only after explicit browser permission, with manual map placement as the fallback.

## Responsive and accessibility checks

- Keep the reference’s wide map presentation on desktop and a form-first, map-second reading order on mobile.
- Ensure every input has a visible label, icon-only control has an accessible name, and dynamic submission/status updates are announced.
- Keep tap targets at least 44px, visible keyboard focus, logical heading order, and no horizontal overflow.
- Verify all categories, filters, tabs, uploads, location permission fallback, marker details, persistence, all three districts, and all five languages.

## Technical details

- Extend the existing `/citizen` page and its district/language data without changing the access page or Government Official experience.
- Use the existing semantic design tokens and shadcn controls; add only semantic map/status tokens where needed.
- Keep uploaded images within strict prototype limits and store them with their report records in IndexedDB rather than sending them elsewhere.
- Record the client-side report-storage decision in the project architecture notes and update the roadmap when complete.
