# Government Official profile menu fix

## Goal

Make the Government Official profile badge behave like the Citizen profile badge, without changing report, map, feedback, language, or district functionality.

## Changes

- Turn the official initials badge in the top-right into an accessible profile button.
- Open a compact profile menu showing the official name, selected district, and role.
- Add a **Back to access page** link that returns to the existing login/access screen.
- Close the profile menu when the user clicks outside it, presses Escape, opens the language menu, or opens mobile navigation.
- Keep the existing mobile **Back to access page** option unchanged.

## Verification

- Confirm the profile button opens and closes correctly on desktop and tablet.
- Confirm **Back to access page** returns to `/` without clearing locally saved account or report data.
- Confirm the existing mobile navigation return link still works.
- Check that language, navigation, reports, map, status updates, and feedback remain unaffected.
- Confirm the preview builds cleanly with no browser errors or horizontal overflow.
