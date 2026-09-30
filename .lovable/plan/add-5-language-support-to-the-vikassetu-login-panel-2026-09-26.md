# Add 5-language support to the VikasSetu login panel

## What changes

A vertical language section is added to the right-side form panel, placed directly under the "Already have an account? Login" area so it uses the leftover empty space at the bottom of the panel.

### Language section

- Five Indian languages: English, हिंदी (Hindi), मराठी (Marathi), বাংলা (Bengali), தமிழ் (Tamil).
- Rendered as a vertical stacked list of full-width rows (native script name + English name), each row a button with a small globe/language icon.
- The active language row is highlighted with the same blue selected style used on the role cards; a small check mark shows the current choice.
- A short "Choose your language" heading sits above the list.

### Translation behavior

- Selecting a language instantly translates everything on the right side: headings ("Create your account" / "Welcome back"), role card names and descriptions, all field labels and placeholders, Send OTP / Resend, the security info notice, Create Account / Login buttons, Google / DigiLocker buttons, the login/signup switch line, Terms/Privacy text, and all validation + toast messages.
- The left-side image stays untouched (it is a fixed picture).
- The chosen language is remembered for the session only (prototype — no stored accounts).

### Layout safety

- Longer translations (Bengali/Tamil run long) wrap instead of overflowing: labels and buttons allow wrapping, and the panel already scrolls vertically if content grows.
- The language list is compact so it fits under the login link at your screen size without pushing the form off-screen.

## Technical notes

- All work is in `src/routes/index.tsx`: a `Language` state ("en" | "hi" | "mr" | "bn" | "ta"), a copy object holding every string in all five languages, and the new vertical language list component under the login/signup switch.
- Fonts for Hindi/Marathi/Bengali/Tamil scripts are already loaded in `src/routes/__root.tsx` (Noto Sans families) from the earlier multilingual work — reuse them.
- No backend, no stored preferences; everything stays a client-side prototype per project rules.

## Verification

- Check all five languages render correctly at 942x579 (your size), 1536x864, 1280x1800, and 390x844.
- Confirm switching language updates every visible string, the form still validates and submits in each language, and the build/runtime logs stay clean.
