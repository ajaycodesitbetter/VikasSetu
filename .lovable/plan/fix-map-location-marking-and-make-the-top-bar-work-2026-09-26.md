# Fix map location marking and make the top bar work

## Why the location is not marked

The map loads a moment after the page opens. The code that draws the report pins and the "your chosen location" pin runs before the map is ready, and nothing tells it to run again once the map appears. So pins only show up by accident (e.g. after changing a filter), and a location picked early never gets drawn.

## Map fixes

- Track when the map has finished loading and redraw all pins and the chosen-location pin at that moment.
- Clicking the map or using "Use my location" always drops a visible pin, pans to it, and shows the coordinates under the form.
- If the device location is far outside the selected district, still show the pin but add a gentle note, so it never looks like nothing happened.
- Show real hotspot numbers on pins (count of reports near the same spot) instead of the fixed "1".
- Redraw correctly when the district, tab, or filter changes; clean up old pins so none are duplicated.

## Top bar functions

- **Home**: scroll to the top banner.
- **My District**: scroll to the district details section.
- **Report Issue**: scroll to the report form and focus the first field.
- **Track Reports**: open a panel listing the reports saved on this device (tracking ID, title, status, date); clicking one scrolls to the map and opens its details.
- **Notices**: scroll to the dated "What's new" notices.
- **Schemes**: scroll to the civic service links section.
- The active item underline follows the section being viewed.
- **Bell**: opens a small panel with recent activity (your latest submitted reports and the dated notices), with a count badge.
- Language and profile menus stay as they are; open menus close when another opens or on outside click / Escape.
- Same behaviour in the mobile menu (it closes after choosing).

## Safety

- No changes to the login page, stored account data, or report storage format; existing saved reports keep working.
- Re-test all three districts, five languages, desktop and mobile after the change.

## Technical details

- `citizen-issue-map.tsx`: add `mapReady` state set after `new Map`; include it in the markers and draft-marker effect deps; clear draft marker on district change; compute cluster counts by rounding lat/lng; expose section `id`s (`report-issue`, `issue-map`) and accept an optional `focusIssueId` prop for Track Reports.
- `citizen.tsx`: add section ids, a `scrollToSection` helper with `scrollIntoView({ behavior: "smooth" })`, IntersectionObserver for active nav, Track Reports and Notifications popovers reading IndexedDB via an exported `readReports`.
