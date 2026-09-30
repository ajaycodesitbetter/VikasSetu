# Stack the role cards: icon on top, description below

The Citizen / Government Official selector is still breaking because the icon and the text compete for the same horizontal space. At your current preview size each card leaves only about 80px for text, so "Government Official" wraps and the descriptions get cut off ("Share needs from your are…", "Access planning & analyt…").

The fix you suggested is the right one: put each icon on its own line and write its label and description underneath. Then the text gets the full card width and nothing can clip.

## What changes

- Each role card becomes a vertical stack, centered:
  - icon in its tile at the top
  - the role name directly under the icon
  - the short description under the role name
- Both icons sit in the same-sized tile with the same treatment, so Citizen and Government Official look like a matched pair instead of a filled person glyph next to a bare building outline.
- Text sizes go up slightly (the labels are currently almost unreadably small) because the stacked layout frees up room.
- Descriptions may wrap onto two lines, and both cards are forced to the same height so they always line up.
- The blue selected tick moves to a corner where it never touches the label or the card edge.
- Everything else on the page stays exactly as it is: the background image, the heading and intro, all fields, Send OTP, the security notice, Create Account, the Google / DigiLocker row, and the terms line.

```text
Before                      After
+----------------+          +----------------+
| [i] Label      |          |      [i]       |
|     desc...    |          |     Label      |
+----------------+          |  description   |
                            +----------------+
```

## Verification

Checked at 1536x864, 1280x1800, your current 942x579, and 390x844: both role names and both descriptions render in full with nothing cut off, both cards are the same height, the tick stays inside the card, clicking either card still switches the selection, and the page and build logs stay clean.

## Technical details

- `src/routes/index.tsx`, role selector block (lines 118-132) only.
- Card `Button` switches from `justify-start` with a side-by-side icon to a centered `flex-col` stack; the fixed `h-[66px]` becomes a `min-h` so wrapped descriptions never overflow.
- Both icons render in one shared tile class (`size-9`, rounded, selected = tinted background + primary glyph, unselected = muted glyph) so the two glyphs read consistently; the building glyph keeps `stroke-[1.75]` and matches the person glyph's optical size.
- Label `strong` and description `span` get `w-full text-center` and drop the tiny clamp sizes in favour of fixed `text-[11px]` / `text-[10px]`, with a `min-h` on the description to keep card heights equal.
- `BadgeCheck` stays `absolute` but anchors to the top-right with enough inset that it cannot overlap the centred text.
- `aria-pressed`, the `aria-label="Account type"` group, and the existing `role` state machine are unchanged.
- The uploaded screenshot is a reference of the current broken state, not an app asset, so it is not added to the project.
