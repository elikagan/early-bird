# Design System — Early Bird

## Product Context
- **What this is:** Pre-market marketplace where flea market dealers post what they're bringing so buyers get first crack before the gates open.
- **Who it's for:** Serious vintage/antique buyers and the dealers who sell to them. Insiders, not casual browsers.
- **Space/industry:** LA flea market scene (Downtown Modernism, Rose Bowl, Long Beach, etc.)
- **Project type:** Mobile-first web app, phone-number auth, SMS-native

## Aesthetic Direction
- **Direction:** Flea Market Flyer — bold typographic energy, poster-like hierarchy, raw and confident
- **Decoration level:** Minimal. No gradients, no shadows, no rounded-everything. Thick rules, tight spacing, type does the work.
- **Mood:** Insider access. Like finding out about something good through word of mouth. Not a startup, not a gallery. Confident and direct.
- **Tone:** Not democratic ("everyone gets access"). Exclusive ("you get first crack").

## Typography
- **Display/Headlines:** Bebas Neue — condensed, bold, poster energy. Used for logo, event names, countdown numbers, CTA buttons.
- **Body/UI:** DM Sans — clean, friendly, readable. Used for body text, metadata, form inputs, labels.
- **Loading:** Google Fonts `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700`
- **Scale:**
  - Logo: 44px Bebas Neue
  - Event name: 24px Bebas Neue
  - Countdown numbers: 56px Bebas Neue
  - CTA button: 18px Bebas Neue, letter-spacing 0.08em
  - Body: 13-14px DM Sans
  - Metadata: 12px DM Sans
  - Fine print: 10-11px DM Sans
- **Prices:** DM Sans 700, font-variant-numeric: tabular-nums

## Color
- **Approach:** Restrained. One accent color (bluejay blue), everything else is black/gray/white.
- **Background:** `#FFFFFF` white
- **Text primary:** `#111111` near-black
- **Text secondary:** `#444444`
- **Text muted:** `#999999`
- **Borders:** `#E0E0E0`
- **Accent (Bluejay):** `#2E7EBF` — links, CTA buttons, "BIRD" in logo
- **Accent hover:** `#1D6BA8`
- **Semantic:**
  - Error: `#CC4444`
  - Sold/Success: `#2D8A4E`
  - Hold/Pending: `#B8960C`

## Logo
- **Treatment:** Stacked text, Bebas Neue. "EARLY" in `#111111`, "BIRD" in `#2E7EBF`.
- **No icon/mascot.** The bluejay is referenced through color and name, not a graphic.

## Spacing
- **Base unit:** 4px
- **Density:** Compact-comfortable. Poster-like tightness in headers, comfortable in content areas.
- **Padding:** Screen padding 24px horizontal.

## Layout
- **Approach:** Single column, mobile-first
- **Dividers:** Thick 2px black rule under logo. Thin 1px gray rules between sections.
- **Border radius:** 4px on inputs/buttons. 3px on images. Minimal.
- **Max content width:** 375px (phone-native)

## Motion
- **Approach:** Minimal-functional. No decorative animation.
- **Countdown:** Live-updating numbers, no transition effects.

## Key Patterns
- **CTA buttons:** Full-width, Bebas Neue uppercase, bluejay blue background, 4px radius
- **Text inputs:** Full-width, 2px black border, DM Sans, tabular-nums for phone numbers
- **Section dividers:** Horizontal rules (thick for major, thin for minor)
- **Above the fold:** Logo, event, countdown, one-liner, phone input, CTA. Everything that matters visible without scrolling.
- **Below the fold:** Hero image (admin-curated per event), pitch copy, disclaimer.

## Landing Page Copy
- **Tagline:** "Dealers post what they're bringing. You get first crack."
- **Below-fold pitch:** "The best things at any flea market change hands before the gates open. Early Bird is how you get in on it."
- **CTA:** "REGISTER FOR EARLY ACCESS"
- **Sub-CTA:** "Get notified when inventory drops."
- **Disclaimer:** "Early Bird is an independent platform. Not affiliated with or endorsed by any market or event listed here. All listings are posted directly by individual dealers."

## Product Details (design-relevant)
- **Teaser image:** Admin picks one hero photo per event. Shows on landing page before drop. Not blurred, not a grid. One curated image.
- **Buyer market subscriptions:** After registration, buyers choose which markets they follow. Only get texts for those events.
- **Dealer link:** Small, tucked in corner. "Dealers" — not prominent.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | Bebas Neue + DM Sans | Poster energy for headlines, clean readability for body. One display font, one body font. |
| 2026-04-06 | Single accent color (#2E7EBF) | Bluejay blue. Only color in the palette. When it appears, it means something. |
| 2026-04-06 | No blur effect for pre-drop items | Cliché. Admin-curated single teaser photo instead. |
| 2026-04-06 | CTA above the fold | Phone input and register button must be visible without scrolling on mobile. |
| 2026-04-06 | Insidery tone, not democratic | "You get first crack" not "everyone gets access." Exclusive, not egalitarian. |
| 2026-04-06 | No bluejay icon/mascot | The bird is the color and the name. No cartoon, no graphic. |
| 2026-04-06 | Independent platform disclaimer | Avoid cease & desist from market organizers. |
