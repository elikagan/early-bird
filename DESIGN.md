# Design System — Early Bird

## Product Context
- **What this is:** Pre-market marketplace where flea market dealers post what they're bringing so buyers get first crack before the gates open.
- **Who it's for:** Serious vintage/antique buyers and the dealers who sell to them. Insiders, not casual browsers.
- **Space/industry:** LA flea market scene (Downtown Modernism, Rose Bowl, Long Beach, PCC Flea, etc.)
- **Project type:** Mobile-first web app, phone-number auth, SMS-native

## Roles
- **Dealers:** Vetted/invited by founder. Can post items AND browse/buy. See both seller tools (My Items) and buyer tools (feed, favorites, messages). A dealer is also a buyer.
- **Buyers:** Open registration. Can browse, buy, save favorites, and message dealers. Cannot post items. Cannot become a dealer without founder approval.
- **Key:** Many dealers are also the most motivated buyers (they have shops, sell online). The app gives dealers full buyer capabilities plus posting/selling. But buyers are buyer-only — it's a permission level, not a toggle.

## Pricing Model
- **Buyers:** Free during launch. Future model is paid access — subscription or per-event ticket (like buying an early entry pass at a flea market). Do not promise "always free."
- **Dealers:** Free. Likely stays free — they're the supply side.

## Aesthetic Direction
- **Direction:** "The Text Message" — ultra-minimal, monospaced, raw. The interface feels like a back channel, not a marketplace. The insider feeling comes from the rawness.
- **Decoration level:** None. No gradients, no shadows, no borders, no dividers. Spacing is the only structure.
- **Mood:** Like finding out about something good through a text from someone who knows. Not a startup, not a gallery. Confident and direct.
- **Tone:** Not democratic ("everyone gets access"). Exclusive ("you get first crack").

## Typography
- **One font:** JetBrains Mono — used for everything. Headlines, body, buttons, labels, prices.
- **No display font, no serif.** Hierarchy through size and weight only, not font changes.
- **Loading:** Google Fonts `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700`
- **Scale:**
  - Logo: 20px, weight 700
  - Market names: 24px, weight 700, letter-spacing -0.03em
  - Section titles: 11px, weight 600, letter-spacing 0.15em, uppercase
  - Body: 13px, weight 400
  - Labels/fine print: 11px
  - CTA buttons: 13px, weight 600, letter-spacing 0.15em, uppercase
- **Prices:** Weight 700, font-variant-numeric: tabular-nums
- **Line-height:** 1 for display, 1.3 for tight body, 1.5 for readable body

## Color
- **Approach:** Minimal. One accent color, everything else is black/gray/white.
- **Background:** `#FAFAF8` (barely warm white)
- **Text primary:** `#1A1A1A`
- **Text muted:** `#888888`
- **Text dim:** `#CCCCCC`
- **Input background:** `#F0EFEC`
- **Accent:** `#0066FF` (pure blue, like a link in a text message)
- **Accent hover:** `#0052CC`
- **Semantic:**
  - Error: `#D32F2F`
  - Success: `#2E7D32`
  - Hold/Pending: `#B8960C`

## Logo
- **Treatment:** "EARLY BIRD_" on one line. JetBrains Mono 700, 20px. The underscore blinks like a cursor.
- **No icon/mascot.** No stacked wordmark. No color split. Just text with a blinking cursor.

## Spacing
- **Approach:** Spacing is the only structural element. No borders, no dividers, no rules.
- **Between items in a group:** 32px
- **Between groups:** 48px
- **Between zones:** 64px
- **Padding:** Screen padding 24px horizontal.
- **Key rule:** The space below a section label MUST be >= the space between items in that section. A label introduces a group; the first item can't feel closer to the label than items are to each other.

## Layout
- **Approach:** Single column, mobile-first
- **Max content width:** 480px on mobile
- **Border radius:** 6px on inputs/buttons
- **Desktop (768px+):** White card on `#F0F0EC` background, max-width 720-900px, two-column grid for hero area and info sections

## Browse Feed
- **Mobile:** TikTok-style vertical scroll. One item fills the screen. Swipe up for next. Swipe left/right for photo carousel.
- **Desktop:** Two-column grid.
- **Item display:** Full-bleed photo, price overlay, dealer name, condition, firm/offers badge, sold/hold status.

## Landing Page
- **Multi-market:** Shows all upcoming markets as a list, not just one. Each market shows name + date (compact format like "5.11") + countdown ("drops in Xd Xh Xm").
- **Market names:** Can be abbreviated for space (e.g., "DTWN MODERNISM" for Downtown Modernism).
- **Countdown:** Inline text, not big numbers. Anti-urgency urgency.
- **CTA + phone input** visible without scrolling on mobile.
- **Dealer link:** "Dealer? Click here" — small, top right. Not prominent but clearly clickable.

## Key Patterns
- **CTA buttons:** Full-width, `#0066FF` background, white text, JetBrains Mono 600, 13px uppercase, letter-spacing 0.15em, 6px radius
- **Text inputs:** Full-width, `#F0EFEC` filled background, no border, 6px radius. Focus: 2px blue ring.
- **Section labels:** 11px uppercase, letter-spacing 0.15em, `#888` muted color. No decorative elements.
- **Above the fold:** Logo, upcoming markets, phone input, CTA. Everything that matters visible without scrolling.
- **Below the fold:** How it works, FAQ, disclaimer.

## Motion
- **Approach:** Minimal-functional. No decorative animation.
- **Blinking cursor:** Logo underscore blinks 1s step-end infinite. The only animation.
- **Countdown:** Live-updating text, no transition effects.

## Dealer Context Switch
- Dealers see a top-level toggle: **Browse | My Booth**
- **Browse mode:** Full buyer experience — feed, favorites, messages as a buyer. Identical to what a buyer-only user sees.
- **My Booth mode:** Seller tools — my listings, messages from buyers, add item.
- Buyers don't see this toggle. They only have the buyer experience.
- The toggle should be prominent and unambiguous. Dealers need to always know which hat they're wearing.

## Buyer Features
- Browse feed (vertical scroll mobile, grid desktop)
- Favorites (save/heart items)
- Messages (conversations with dealers)

## Dealer Features
- Everything buyers get (via Browse mode), plus:
- My Booth mode: manage listings, view buyer inquiries
- Add item form (photos, price, condition, firm/offers, market selection)

## Product Details
- **Dealer link:** "Dealer? Click here" — top right, small, plain text
- **Market dates displayed as:** compact M.DD format (e.g., "4.26", "5.11")
- **Disclaimer required** on both landing pages (legal protection from market organizers)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | JetBrains Mono only | One font. Monospaced = insider/back-channel feel. Hierarchy through size/weight. |
| 2026-04-06 | Single accent color (#0066FF) | Pure blue, like a link in a text. When it appears, it means something. |
| 2026-04-06 | No borders or dividers | Spacing does all the structural work. Cleaner, more confident. |
| 2026-04-06 | Multi-market landing page | Shows all upcoming markets. Helps messaging — buyers see the breadth of what's coming. |
| 2026-04-06 | "The Text Message" aesthetic | Raw, monospaced, anti-design. The lack of polish IS the brand. |
| 2026-04-06 | Logo is "EARLY BIRD_" with cursor | Not a stacked wordmark. One line, blinking underscore. Terminal/text feel. |
| 2026-04-06 | Inline countdown text | "drops in 16d 22h 47m" — not big countdown numbers. Anti-urgency urgency. |
| 2026-04-06 | Buyers free now, paid later | Like an early entry ticket. Dealers stay free (supply side). |
| 2026-04-06 | Dealers are also buyers | Dealers get full buyer capabilities + posting. Buyers are buyer-only. Not a toggle — dealer is a permission level. |
| 2026-04-06 | TikTok scroll mobile, grid desktop | One-item-at-a-time on mobile for focused browsing. Grid on desktop for scanning. |
| 2026-04-06 | Favorites for buyers | Key feature — save pieces you like. Separate tab/section. |
| 2026-04-06 | Browse / My Booth toggle for dealers | Dealers need a clear context switch. Browse = buyer mode, My Booth = seller mode. Buyers don't see the toggle. |
| 2026-04-06 | Independent platform disclaimer | Avoid cease & desist from market organizers. |
