# Early Bird — Product Roadmap

## What This Document Is
This is the source of truth for what Early Bird needs to become. It captures architecture decisions, feature specs, and design feedback from a thorough QA review (April 2026). These changes have NOT been implemented — multiple attempts failed due to lack of discipline and verification. They will be implemented using [EDS (Eli Design Studio)](https://github.com/elikagan/eds), a structured design tool that enforces component-based development through a ticket system.

## Current State: v0.5.1
The app is functional but visually inconsistent and missing key features. See `HANDOFF.md` for technical details of what exists. The code is a single-file HTML app (~5500 lines) with all CSS, HTML, and JS in one file. There is no external design system CSS — this is the #1 technical debt item.

---

## Design System: Material Design 3 + JetBrains Mono

The app will adopt Material Design 3 as its structural foundation, customized with the Early Bird brand:

**Why M3:** It's the most comprehensively documented component system available. Every component has exact sizing tokens, defined states (enabled/disabled/hovered/focused/pressed), spacing rules, and accessibility requirements. It's designed to be themed.

**Customization for Early Bird:**
- **Typeface:** JetBrains Mono for everything. This gives the app a DIY/Craigslist feel — intentional, not slick. The mono font IS the brand.
- **Color palette:** Warm and muted. Primary: `#0066FF`. Background: `#FAFAF8`. Neutral: warm grays, not cool. The existing palette is close but `--muted: #666` is too light (should be `#555`) and `--dim: #AAA` is illegible (should be `#888`).
- **Shape:** M3 defaults (4dp XS through pill Full). Rounded rectangles, no hard corners.
- **Spacing:** 8dp baseline grid. Mobile layout: 4 columns, 16dp margins, 16dp gutters.
- **Elevation:** Minimal. M3 levels 0-2 only. The app is flat by design — spacing creates hierarchy, not shadows.

**Typography scale (M3 structure, our values):**
- Display Large/Medium/Small — not used in the app (too big for mobile-first)
- Headline Large: 24px/700 — market names on landing, page titles
- Headline Medium: 20px/700 — prices, stat values
- Headline Small: 16px/700 — section headers, logo
- Title Large: 15px/700 — item card prices
- Title Medium: 14px/600 — names, emphasis
- Title Small: 13px/600 — secondary titles
- Body Large: 14px/400 — primary body text
- Body Medium: 13px/400 — secondary body text
- Body Small: 12px/400 — metadata, descriptions
- Label Large: 12px/600 — button text, nav labels
- Label Medium: 11px/600/uppercase/0.15em tracking — form labels (our `.fl` class)
- Label Small: 10px/600 — status pills, tiny labels

**The design system will live in a separate CSS file (`design-system.css`)** loaded by the app via `<link>` tag. This file is the single source of truth for all visual styling. The current inline `<style>` block will be migrated into it component by component using EDS.

---

## Architecture Decisions (User-Approved)

### 1. Kill the Messages Tab
The standalone Messages tab is being eliminated. Communication moves to item detail pages.

**The problem:** Messages were disconnected from context. A dealer with 30 conversations across 10 items had no way to manage them efficiently. Buyers had to leave the item they were looking at to check messages. The inbox was a flat chronological list that would become unusable at any real scale. The fundamental insight: in a marketplace, communication is ABOUT an item — it should live ON that item.

**What replaces it:** Every item detail page becomes a communication hub. When a buyer sends a message about an item, the item detail page transforms — the item info compresses to a compact header, and the conversation becomes the main content. For dealers viewing their own items, all buyer inquiries appear as threaded conversations grouped by buyer on that item's page.

### 2. Watching Tab (Replaces Messages + Favorites)
A new tab called "Watching" replaces both the Messages tab and the Favorites/Saved feature. It shows every item you have a relationship with — either favorited or messaged about.

**What it shows:**
- Item thumbnail, current price, dealer name, status (live/held/sold)
- Heart icon = favorited only. Chat bubble = has a conversation.
- PRICE DROP badge when dealer lowers price (see Decision #4)
- Strikethrough on old price when price has dropped
- Sorted by most recent activity (new message or price change)
- Tap any item → opens item detail with conversation visible if one exists

**Why this works:** It collapses two concepts (favorites + messages) into one. "Items I'm interested in" is one list, whether I expressed interest by hearting it or by messaging the dealer.

### 3. Bottom Nav: Buy · Watching | Sell | Account
The nav tabs are renamed and restructured:
- **Buy** — browse items from other dealers (was "Shop")
- **Watching** — items you've favorited or inquired about (was "Messages" / "Saved")
- **Sell** — dealer's booth (was "Booth", hidden for buyer-only users)
- **Account** — settings (unchanged)

Buy and Watching are visually grouped on the left with a subtle divider separating them from Sell and Account. This communicates that Watching is part of the buying experience, not a standalone inbox.

**The buyer/dealer distinction is critical:** Buyers are ONLY buyers. Dealers are buyers AND sellers. This means:
- A buyer sees: `[ Buy · Watching | Account ]` (3 tabs)
- A dealer sees: `[ Buy · Watching | Sell | Account ]` (4 tabs)
- A buyer's Watching tab has no buying/selling filter (they only buy)
- A dealer browsing items, favoriting, messaging — they're acting as a buyer, and the nav reflects this

### 4. Price Drop Notifications (Major Feature)
When a dealer lowers the price of an item, they're prompted: "Notify X watchers of this price drop?" If confirmed, an SMS goes to everyone who favorited or inquired about that item.

**Why this is huge:** One of the biggest challenges at a flea market is deciding when to lower prices as the day ends. Being able to signal to interested buyers that the price dropped creates a marketplace flywheel: browse → favorite → price drops → notification → conversion. No other flea market tool offers this.

**Flow:**
1. Dealer edits price downward on their item
2. System detects the decrease, prompts: "Notify X watchers of this price drop?"
3. Shows preview of the notification with old price → new price
4. If confirmed: SMS to all who favorited OR inquired
5. SMS text: "Price drop! [Item title] is now $X (was $Y) — [link to item]"
6. In the Watching tab: item shows a PRICE DROP badge with the old price struck through

**Technical:** `previous_price` column already exists on items table. API needs `notify_watchers` flag on PATCH. Watchers = UNION of favorites + conversation participants for that item.

### 5. Item Detail Page States
The item detail page is the most important screen in the app. It transforms based on the viewer's relationship to the item:

**State 1 — Browsing (no relationship):**
Full item detail: photos (large carousel), price, title, dealer info with avatar, compose buttons ("I'll take it" / "Make an offer" / "Ask a question"). This is the first impression — it needs to be clean and photo-forward.

**State 2 — Active conversation (buyer sent a message):**
Item info compresses to a compact card header: thumbnail (48px) + price + status pill + dealer name, all in one row. Expandable chevron to show full item details if needed. The conversation thread becomes the main content area. Reply input fixed at bottom — iMessage-style auto-expanding textarea (starts 1 line, grows to 4 max). This state is reached from the Watching tab or from an SMS notification link.

**State 3 — Dealer viewing own item (no inquiries):**
Full item detail with an edit button. Status control buttons (Live / Hold / Sold). Market context shown: "Listed in Downtown Modernism · Apr 26". No compose area (you don't message yourself). This is the dealer's management view.

**State 4 — Dealer viewing own item (has inquiries):**
Item info compresses to compact header (same pattern as State 2). Below it: inquiry threads from multiple buyers, each in a collapsible accordion section (buyer avatar + name + last message + timestamp). Only one thread expanded at a time. Reply input per thread. Status control buttons at the bottom — when tapping Hold or Sold, the system asks WHICH BUYER to hold/sell to, directly connecting the communication to the action.

### 6. Dealer Inquiry Threading
On the dealer's item detail page (State 4 above), inquiries are organized as an accordion by buyer:

```
┌─────────────────────────────┐
│ ← Back                      │
│ ┌─────┐ $150  HOLD          │
│ │photo│ Brass Desk Lamp     │
│ └─────┘ 3 inquiries         │
├─────────────────────────────┤
│ 🟢 Loubna Maher        2h   │
│ "I'll take it! Can I pick   │
│  it up Saturday morning?"   │
│                    [Reply]   │
│                              │
│ ── Marco Rivera        5h   │
│ "Is this still available?   │
│  What are the dimensions?"  │
│                    [Reply]   │
│                              │
│ ── Jane Smith         1d    │
│ "Would you take $120?"      │
│                    [Reply]   │
├─────────────────────────────┤
│ [LIVE]  [HOLD ▾]  [SOLD ▾]  │
└─────────────────────────────┘
```

- Green dot (🟢) = unread/new inquiry
- Tap [Reply] → thread expands inline showing full message history + reply input
- Only one thread expanded at a time (accordion behavior)
- [HOLD ▾] and [SOLD ▾] are dropdowns that list the buyers who have inquired — selecting one holds/sells to that specific buyer

**The mental model for dealers:** "I have 10 items. 3 have inquiries. I tap each item, see who wants it, reply or mark sold." The booth list is the overview; the item detail is the action center.

### 7. Logged-In Home Page
The current landing page (`/`) shows the marketing content (markets list, phone input, "Get Early Access"). For logged-in returning users, this page should transform. The principle: a returning user should never see the sign-up pitch.

**Open design question:** The exact layout hasn't been decided. Candidates:
- Redirect straight to Buy tab (simplest)
- A dashboard showing: next market countdown, new inquiry count (dealer), price drops on watched items (buyer), quick links to Watching/Sell
- The Buy tab itself IS the logged-in home page (just skip the landing)

This should be designed in EDS once the core screens are built.

---

## QA Feedback (Not Yet Implemented)
Complete notes in `QA-NOTES.md`. Below is the full detail, not just summaries.

### Global Issues
- **6 different header implementations** across screens — need one `.app-header` component used everywhere. Currently: landing uses `.header`, feed uses `.feed-header`, item detail uses `.detail-back` gradient overlay, conversation uses `.conv-detail-header`, add-item uses `.feed-header` with inline back link, admin uses `.admin-header`.
- **Text too light everywhere** — `--muted: #666` and `--dim: #AAA` are illegible on multiple screens. Users specifically called out: onboarding, conversation, booth setup, booth active items, add-item form. Fix: `--muted: #555`, `--dim: #888`.
- **Nav labels wrong** — still says Shop/Booth/Messages/Account. Decided: Buy · Watching | Sell | Account.

### Landing (Buyer)
- "Dealer? Click here" → capitalize "Click Here"
- Remove chevrons (›) on market rows — decorative, not functional
- Countdown should be right-aligned, should NOT wrap to next line
- Remove "drops in" prefix — just show "22d 13h"
- Needs a logged-in version (see Decision #7)
- Market selection UX is unclear — where does the magic link take you? How do you pick a market?

### Landing (Dealer)
- Needs EARLY BIRD_ logo in the header — currently the only major screen without it
- Copy change: "Buyers see it when items drop" → "Buyers see it when items drop the evening before the show"

### Onboarding
- Left-align everything (currently some elements centered)
- Square rounded avatar (border-radius: 12px) instead of circle — more modern
- "Almost there" → "Get set up to pre-buy" (provides context for what's happening)
- Needs structure — light grays and tiny text are straining to read
- Needs EARLY BIRD_ logo in consistent header position

### Feed
- Dealer avatar on item cards is too small (32px → 44px+)
- Contact button that opens a drawer with SMS/call options should be on every item card
- Photo doesn't go to the bottom of the container (gap between photo and info area)
- Filter bar needs reorganization (specifics TBD)
- Filter dropdowns won't scale — 100+ dealers in a dropdown is unusable. Need searchable autocomplete.

### Item Detail
- Held/sold status marker should be inline with price, right-aligned (not a full-width banner)
- Missing dealer avatar next to seller info
- Missing bottom nav on this screen
- The chat with the dealer should live on this page (see Decision #5, State 2)

### Booth (Fresh Dealer / Setup Card)
- Light grays impossible to read
- "Confirm" button can't be blue/active until required fields are filled — must start disabled/gray
- Title should include market name AND date: "Set up your booth for Downtown Modernism · Apr 26"
- Payment setup must be inline on this page, NOT buried in Account settings:
  - Checkbox for Venmo (with handle input)
  - Checkbox for Zelle (with handle input)
  - Checkbox for Cash only
  - These persist across markets — set once, carry forward
- Page needs visual hierarchy — nothing is big or obvious, spacing is weird
- FAB and "your booth is empty" message should be hidden until setup is complete (or offer "skip for now")

### Booth (Active / With Items)
- Items should be in cards with backgrounds (not floating on white)
- Status pills (live/sold/relist) are nearly invisible
- Price should be top-aligned with thumbnail (not vertically centered)
- Countdown should count to DROP TIME, not market date
- After drop: "Early Bird market is live" (green) — consider "X buyers are shopping"
- Event name feels too subtle

### Booth (Market Picker)
- Markets have TWO dates: the event date (part of the name — "when the market is") and the drop countdown ("when inventory goes live and you need stuff posted")
- "Select market" → "Switch to different event"
- Unclear how the picker is initiated from the booth page

### Add Item
- Remove the Condition field entirely (and the condition tag from item display)
- Remove the Market picker — you're already in a market context. Show "Adding to Downtown Modernism · Apr 26" at top.
- Remove price posture (firm/flexible/make offer) → simple "Price Firm" toggle, defaults off
- Post button must be pinned to bottom of screen, disabled/gray until photo + price are filled
- Photo add button should be the LAST square in the grid (bottom right), not top left
- First photo = main photo — indicate this visually
- Photo drag reorder must be best-in-class smooth
- Camera vs album choice when adding photo

### Conversation
- Back button inconsistent with other screens
- Content feels randomly indented too far left
- Dealer info and avatar are too tiny
- Reply input must auto-expand like iMessage (1 line → grows up to 4)
- Horizontal divider above reply field too light — barely visible
- Light gray text impossible to read

---

## Technical Debt
1. All styling in a single `<style>` block in index.html (~2000 lines of CSS)
2. No external design system CSS file — will be created as `design-system.css`
3. Component classes exist (`.btn-primary`, `.fi`, `.fl`, `.status-pill`) but aren't uniformly applied
4. 6 different header implementations instead of one component
5. Multiple "consolidated" comments in CSS for deleted classes, but replacements inconsistently applied

## EDS Integration (Status: v1 Built)
This repo is the first project onboarded into [EDS (Eli Design Studio)](https://github.com/elikagan/eds).

### What exists now
- **EDS studio (v1):** Three-column design tool with iPhone/Safari frame, ticket system, 22-screen navigation. Source: `/Users/elikagan/Desktop/Claude stuff/eds/`
- **Project config:** `eds/projects/early-bird.json` — 22 screens, 5 test users, theme (JetBrains Mono, #0066FF primary, warm palette)
- **Ticket storage:** `eds/tickets/early-bird.json` — local JSON, committed to git

### What's next (not yet built)
1. **Design system bootstrapper:** Extract the existing ~2000 lines of inline CSS from `index.html` into `design-system.css` with M3 structure and `@eds-` metadata comments. This is EDS's job — do NOT create `design-system.css` manually.
2. **CSS parser for the DS panel:** Reads `@eds-` comments and populates the design system panel (Column 2).
3. **Ticket processing loop:** Claude reading pending tickets and executing them (writing CSS/HTML changes).
4. **Migration:** One component at a time, from inline `<style>` into `design-system.css`, verified visually in the iframe.

### How to run EDS for this project
```bash
node "/Users/elikagan/Desktop/Claude stuff/eds/studio/server.js" early-bird 8097
open http://localhost:8097/eds/
```

### Contract
See `CLAUDE.md` "EDS Contract" section. Key rule: **never write inline styles or ad-hoc CSS classes.** If you need a component, create an EDS ticket.

---

## Development History
This app has been through 5 failed design system implementation attempts:

1. **Attempt 1:** "Rebuild entire design system" → actually just unified some toggles and CSS variables. Font was accidentally changed from JetBrains Mono to Inter based on a note from a different project.
2. **Attempt 2:** 39-step plan → claimed 100% complete. Self-evaluation found it was ~35% done. Settings avatar wrong size, favorites empty state broken, conversation back button wrong color, add item header inconsistent.
3. **Attempt 3:** PLAN-v2 "corrective" plan → same pattern. Foundation first, then screens. Claimed all 5 phases done. Back/forward navigation was broken. User caught it.
4. **Attempt 4:** Component library + screen templates → partially built. `.app-header` created. Text contrast adjusted. Nav renamed. But most screens never touched.
5. **Attempt 5:** Rushed v0.6.0 with Watching tab, inline chat, price drop → API endpoints written but frontend was half-implemented hacks. Reverted within hours.

The root cause: Claude Code loses discipline in long sessions, batches too many changes, claims completion without verification, and produces plausible-looking but incomplete work. This is a documented issue (GitHub #6159, #22140, #17097).

**Solution:** [EDS (Eli Design Studio)](https://github.com/elikagan/eds) — a structured design tool that enforces component-based development through a ticket system, visual verification, and a Material Design 3 foundation.

---

## API Changes Needed
- `GET /api/watching` — items user has favorited OR has conversations about, with last message + price history
- `GET /api/items/:id` — add `my_conversation` field when authenticated (conversation token + messages)
- `PATCH /api/items/:id` — detect price drops, support `notify_watchers` flag, track `previous_price`
- `previous_price` column on items table (already exists in DB)
- `market_booths` table (already exists in DB)
- `qa_notes` table (already exists in DB, used by QA tool)

## Test Users (Already Created in Supabase)
| Role | Name | Phone | ID |
|------|------|-------|----|
| Fresh buyer | (no name) | +15555550001 | `99db7c21-d996-4ef0-8024-e4b2f67849bc` |
| Active buyer | Loubna Maher | +12138420721 | `9cc49ca0-1235-43aa-bbcb-93a0742b9aea` |
| Active buyer 2 | Marco Rivera | +13234638274 | `5a021f0e-4b9b-40bb-9786-595629acfb0a` |
| Fresh dealer | Sarah Chen | +15555550003 | `fc1df7fa-2247-4d7a-94dd-9a84d1abd8b1` |
| Active dealer | Eli | +13104985138 | `8935f2ac-4998-4e6d-9c31-47dbbce896fd` |

Conversations: Loubna→Eli (token: ZjWgPaD7), Marco→Eli (token: zaUjFSTf). Loubna has favorited the Vintage Persian Rug.
