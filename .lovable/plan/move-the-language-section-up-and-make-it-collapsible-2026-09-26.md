# Move the language section up and make it collapsible

## What changes

The language picker moves from the bottom of the form to the top of the right panel — directly under the "Already have an account? Log In" row and above the "Create your account" heading, exactly where the reference image points.

### Collapsible behavior

- It becomes a collapsible section: a compact header bar showing a language icon, the "Choose your language" label, and the currently selected language (e.g. "हिंदी / Hindi"), with a chevron that rotates when open.
- Clicking the bar expands/collapses the vertical list of the five languages (English, हिंदी, मराठी, বাংলা, தமிழ்) with a smooth open/close animation.
- Default state: collapsed, so it takes only one slim row of space and never pushes the form down.
- Picking a language from the list still instantly translates the whole right side, and the list auto-collapses after a selection so the panel stays tidy.

### Sizing

- The collapsed bar is one compact row (~40px) spanning the panel width; the expanded list uses the same slim row style as now, so nothing overflows at your 942x579 screen size.
- The old language section at the bottom of the form is removed — only one language picker, in the new position.

## Technical notes

- All changes in `src/routes/index.tsx`: move the language block above the heading, wrap it in a collapsible (open state + chevron rotation + grid-rows transition), auto-close on selection.
- Translations, fonts, and the rest of the page stay exactly as they are.

## Verification

- Check collapsed and expanded states at 942x579, 1536x864, 1280x1800, and 390x844.
- Confirm switching language still translates everything, the section collapses after selection, and build/runtime logs stay clean.
