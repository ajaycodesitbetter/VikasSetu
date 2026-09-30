# Citizen platform top section

## Goal

Create the first citizen-platform screen, using the uploaded district-site image as visual reference while keeping VikasSetu’s own identity and citizen-focused navigation.

## Build

- Add a dedicated `/citizen` page and send a successfully validated Citizen account/login into it.
- Preserve the selected district and language from the browser-saved prototype profile; default safely to Gwalior if no district is available.
- Build a compact top navigation with VikasSetu branding and citizen destinations: Home, My District, Report Issue, Track Reports, Notices, Schemes, language, notifications, and profile/menu controls.
- Make each top control respond without pretending unfinished pages exist: menus open and close, the active item is clear, and future destinations show concise prototype feedback.
- Add a wide district-photo carousel directly below the navigation, inspired by the reference’s proportions and arrow controls.
- Create a distinct, realistic image set for Gwalior, Bhind, and Morena. The carousel will load only images belonging to the citizen’s saved district, with district name and slide context readable over the image.
- Keep the imagery aligned and consistently cropped across desktop, tablet, and mobile; retain safe text contrast and accessible previous/next controls.

## Scope boundary

- This step builds only the working top navigation and district image carousel.
- Citizen tools and page content below this area will be designed in later steps.
- The experience remains a browser-only hackathon prototype with no real accounts or stored server data.

## Verification

- Test Citizen signup/login entry, direct `/citizen` access, all three district variants, carousel controls, navigation/menu interactions, language continuity, refresh persistence, mobile and desktop layouts, metadata, and error-free preview output.

## Technical details

- Use a separate TanStack route with unique citizen-page metadata.
- Store generated district visuals as project assets and map them by the existing district identifier.
- Reuse the existing browser profile rather than introducing authentication or a database.
