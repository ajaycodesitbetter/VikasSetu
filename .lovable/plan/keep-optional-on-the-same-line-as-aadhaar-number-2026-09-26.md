# Keep "(Optional)" on the same line as "Aadhaar Number"

## What is misaligned

In your screenshot "(Optional)" sits on its own line under "Aadhaar Number", which pushes that field's input box lower than the email input next to it.

The cause is measured, not guessed: between roughly 800 and 1200 CSS px the form splits into two side-by-side columns, and each column is too narrow for the label to stay on one line.

| Window width | Width of one form column | Space "Aadhaar Number (Optional)" needs |
| ------------ | ------------------------ | --------------------------------------- |
| 1536 px      | 249 px                   | 147 px — fits                           |
| 1280 px      | 200 px                   | 147 px — fits                           |
| 1100 px      | 165 px                   | 147 px — fits                           |
| 1026 px      | 151 px                   | 147 px — fits by 4 px only              |
| 900 px       | 127 px                   | 147 px — wraps                          |
| 820 px       | 112 px                   | 147 px — wraps                          |

The longest label of all is the Tamil email field at 190 px, so it wraps even at 1100 px.

## What I will change

One file only: `src/routes/index.tsx`.

1. **The label line becomes a single line that cannot break.** Field name on the left, "(Optional)" immediately to its right in the same muted grey it already uses, on one flex row with a fixed 17 px height. Because the height is fixed, two fields side by side always have their input boxes starting at exactly the same height — no more one-sitting-lower. Anything that still would not fit is clipped inside its own field instead of spilling over the neighbour.

2. **The form only goes two-column when there is real room.** The two-column split currently turns on at 640 px; it will turn on at 1200 px instead, where both columns are at least 190 px wide. Below that, each field simply takes the full width of the panel — there is plenty of space there, so every label in every language stays on one line. This also stops the placeholder clipping you can see today at small widths ("Enter your emi…", "Enter 12-di…").

3. **Email gets the identical treatment.** "Email Address (Optional)" is today one solid blue string, so its "(Optional)" does not match Aadhaar's grey one. It will be split the same way: dark name, grey "(Optional)" on its right. This adds one short entry per language (email address name only) alongside the existing "(Optional)" entry.

Untouched: the background image and its blank right-side area, the collapsible language bar and all five languages, role cards, Log In / Sign Up, Send OTP and demo OTP 123456, state and district lists, the saved-in-browser account details and prefill, the success and error messages, Google and DigiLocker buttons, Terms and Privacy.

## How I will check it

Browser check at 1536x864, 1280x800, 1100x700, 1026x579 (the size you are on), 900x600, 820x600 and 390x844, in each of the five languages: confirm every field label is one line with "(Optional)" to the right of the name, and that paired inputs share the same top edge.

Then a pass over the working features so nothing else breaks: language switching and auto-collapse, Log In / Sign Up switch, both role cards, Send OTP then demo OTP 123456, Madhya Pradesh showing Gwalior / Bhind / Morena and Rajasthan and Uttar Pradesh showing Demo District, the missing-field errors, Google / DigiLocker / Terms / Privacy messages, and saving plus auto-prefilling your details after a reload. Build and console logs are confirmed clean at the end.
