# Government Official platform

## Goal

Make the **Government Official** option open a dedicated district workspace while keeping the existing Citizen platform unchanged. The official workspace will read citizen reports saved in the same browser, show them on the district map, and let an official add visible feedback in this prototype.

## What will change

### 1. Fix Government Official entry

- Add a dedicated `/official` page.
- After a valid Government Official sign-up or login, open `/official`; Citizen continues opening `/citizen`.
- Preserve the selected district, name, and language from the existing browser-saved access details.
- Add a working way back to the access page.

### 2. District-aware top section

- Reuse the matching Gwalior, Bhind, or Morena district imagery and carousel behavior already used by the Citizen page.
- Add a polished official navigation bar with working links to overview, notices, reports, map, and feedback.
- Use the uploaded VikasSetu logo at the established compact size.

### 3. Official notices and district information

- Reuse the source-led district profile, census snapshot, official notice links, Collector details, dates, and accessible icon labels already established for each district.
- Present these in the uploaded reference’s clean three-column structure, adapted for the official workflow.

### 4. Report overview and shared map

- Read the same IndexedDB citizen-report records already created by the Citizen platform on this browser.
- Show district-filtered totals, category counts, open/in-progress/resolved summaries, and recent reports.
- Display citizen reports on the same district map with category filters and clickable issue details, including submitted photos and locations.
- Keep sample entries visibly labelled so they cannot be confused with citizen-submitted reports.

### 5. Official feedback workflow

- Let the official select a citizen report, change its prototype status, and add a dated feedback comment.
- Save status and comments into the same browser report record so they remain after refresh and become visible when that report is opened on the Citizen page.
- Include clear empty, validation, success, and unavailable-map states.
- Label all updates as browser-only prototype activity, not a real government response.

### 6. Verification

- Test Government Official selection through to `/official` for Gwalior, Bhind, and Morena.
- Submit a Citizen report, confirm it appears in the official totals and map, add feedback, then confirm the updated status/comment appears back in the Citizen view.
- Check top navigation, filters, responsive layout, keyboard access, accessible text, browser persistence, and error-free loading.

## Technical details

- Move shared report reading/updating into a browser-safe report store so Citizen and Official pages use one source without duplicating storage logic.
- Keep all data client-side in the existing `vikassetu-prototype` IndexedDB database; no accounts, cloud database, or real submissions will be introduced.
- Add unique metadata for the new official page and preserve the existing design tokens and button/icon sizing rules.
