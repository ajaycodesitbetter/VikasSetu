# Polished district details section

## What will be added

- Place a new district-information band directly below the existing civic links and map.
- Match the reference structure with three clear areas: a short “About the district” introduction, a 2011 census snapshot, current notices, and a Collector profile.
- Tailor all content to the citizen’s selected district: Gwalior, Bhind, or Morena.
- Keep the existing five-language behavior so headings, labels, and supporting text change with the selected language.

## Visual direction

- Use a refined editorial civic style rather than another generic card grid: strong information hierarchy, disciplined spacing, thin dividers, and compact factual rows.
- Replace repetitive icon boxes with distinct, elegant Lucide symbols chosen for each meaning—area, population, urban/rural split, gender, language, villages, notices, office, and contact.
- Present the Collector portrait as a restrained circular focal image with name, title, and official profile/contact actions beneath it.
- Preserve the current VikasSetu colors and typography while adding only semantic design tokens needed for the new visual accents.

## District content and behavior

- Source district facts, Collector names/photos, descriptions, and notices only from official government district portals.
- Add an “Read more” action to the appropriate official district page and link each notice to its official source.
- Mark the Collector information with a small “verified” date because officeholders can change.
- If an official portrait is unavailable for a district, show a polished official-building placeholder rather than an invented person.

## Responsive and quality checks

- Keep the reference’s balanced multi-column arrangement on wide screens and convert it into a clean reading order on smaller screens.
- Verify all three districts, all five languages, links, portrait fallbacks, keyboard focus, text wrapping, and zero horizontal overflow.
- Confirm the updated page builds cleanly and visually inspect desktop and mobile results before completion.

## Technical details

- Extend the existing district data model and localization copy in the citizen page; keep the prototype client-side with no new account or storage behavior.
- Store any official portraits through the project’s asset system and include accessible alternative text.
- Record the district-detail presentation rule in the project architecture notes and update the roadmap when complete.
