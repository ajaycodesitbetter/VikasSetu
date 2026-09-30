# District civic services section

## Goal

Add one responsive section directly below the district image carousel, following the uploaded reference while matching VikasSetu’s existing visual style. Its content will change automatically between Gwalior, Bhind, and Morena using the district already saved from the access page.

## What will be added

- A district overview area with icon-led figures such as tehsils, urban local bodies, and police stations.
- A useful civic services list using verified official government links, opening safely in a new tab.
- A public-information list for relevant district notices and official portals.
- A district map panel with the correct district shown and a clear “Open in Maps” action.
- District-specific names, counts, links, and map locations for Gwalior, Bhind, and Morena; facts that cannot be confirmed from an official source will be omitted rather than guessed.
- English, Hindi, Marathi, Bengali, and Tamil labels that follow the language already selected in the top navigation.

## Interaction and layout

- Keep the existing carousel and navigation unchanged.
- Use four aligned content groups inspired by the reference: district figures, civic services, public information, and map.
- On wide screens, show the groups in one balanced row; on smaller screens, stack them into readable sections without horizontal scrolling or clipped text.
- Make each external link visibly actionable, keyboard accessible, and marked as opening an official site.
- Keep all cards and controls consistent with the current VikasSetu colors, spacing, icon treatment, and accessible focus states.

## Technical details

- Extend the district data model on the existing `/citizen` page so each district supplies its own statistics, official URLs, and map target.
- Reuse the current district and language state loaded from the browser-saved prototype profile.
- Use semantic design tokens rather than hardcoded colors.
- External links will use secure new-tab behavior (`target="_blank"` with `rel="noreferrer"`).
- No account system, server storage, or unrelated citizen-platform sections will be added.

## Verification

- Confirm each district displays only its own figures, map, and district links.
- Open every civic service link and confirm it resolves to the intended official government website.
- Check all five languages, keyboard focus, and external-link labeling.
- Test desktop, reference-size, tablet, and mobile layouts for alignment and clipping.
- Recheck carousel, top navigation, menus, saved district, and language behavior for regressions.
