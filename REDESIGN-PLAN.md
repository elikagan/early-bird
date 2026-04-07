# Early Bird Front-End Redesign Plan

## Guiding Principles

1. **JetBrains Mono everywhere.** It IS the brand. No system fonts. No exceptions.
2. **Zero inline styles.** Every visual property lives in the `<style>` block as a named class. No `style=""` attributes in HTML. No `style="..."` in JS template literals. If it's visual, it's a class.
3. **Every element earns its place.** If it's not helping the user accomplish something, remove it.
4. **Spacing is structure.** Minimal borders, no gratuitous dividers. Whitespace does the heavy lifting.
5. **One component, one style.** Seg-ctrl, buttons, inputs, pills — each has exactly one look across the entire app.
6. **Information hierarchy is king.** Biggest/boldest = most important. Muted/small = supporting context. No two things should compete for attention.
7. **Mobile-first, touch-friendly.** 44px minimum touch targets. No hover-dependent interactions.

---

## Audit Checklist Coverage

Every screen is evaluated against every item below. This section maps each goal to specific findings and fixes in the plan.

### 1. Information Hierarchy
Every screen must have a clear visual order: what's most important is biggest/boldest.
- **Feed:** Price (20px bold) dominates. Good. But item count badge in header competes with logo → fix: remove from header.
- **Item detail:** Title appears ABOVE price → fix: price first, title below as support.
- **Conversation:** All info (name, phone, payment, item) at same visual weight → fix: structured header with clear levels.
- **Messages list:** Name and price at similar weight → fix: bold the price.
- **Dealer home:** "My Booth" header is clear. Empty state is clear. Good.
- **Settings:** Double title ("Settings" + "Profile") → fix: remove one.
- **Admin:** Stat cards are clear. Good hierarchy.
- **Landing:** Market names are hero-sized. CTA is prominent. Good.

### 2. Intuitiveness
Can a first-time user figure out what to do without instructions?
- **Landing → auth → app:** Clear. Phone → magic link → you're in.
- **Feed → item → message:** Clear intent flow, but "I WANT THIS" button reveals options that look like disabled inputs → fix: style as selectable chips with active state.
- **Conversation view:** No clear indication this is a chat. Reply input floats at bottom of content, not fixed → fix: fixed input bar like every chat app.
- **Favorites:** Blank when empty. User doesn't know what this screen does → fix: add empty state explaining hearts.
- **Dealer home → add item:** FAB "+" is universal. Good.
- **Admin seg-ctrl:** 5 tabs, last one might be off-screen with no scroll hint → fix: add fade indicator.
- **Navigation between markets:** Markets are tappable on landing but have no visual tap affordance → fix: add chevron or hover/active state.

### 3. Satisfies App Goals
The app's core goal: buyers find and claim items from dealers before markets open.
- **Feed serves the goal** — TikTok scroll shows items prominently with photos/price.
- **"I WANT THIS" serves the goal** — clear buying intent button.
- **SMS serves the goal** — notifications pull people back in.
- **Missing:** No countdown visible in the feed. Buyers in the feed don't see "this drops in 3d" context. The urgency/scarcity signal is only on landing page. → **NEW FIX:** Show market drop countdown in the feed header (next to or replacing the market name link) when viewing a pre-drop market.
- **Missing:** No clear "SOLD" social proof in the feed. Sold items exist but don't prominently show the buyer name/face as a social signal. → **NEW FIX:** On sold feed cards, show "SOLD TO [name]" in a muted overlay on the photo, similar to how Instagram shows tagged users.

### 4. Copy Clarity
Is every piece of text clear, precise, and minimal?
- **"Register for early access"** — good. Clear, not overpromising.
- **"We'll text you when inventory goes live"** — good. Sets expectation.
- **"I want this"** — good. Direct buying intent.
- **"Your booth is empty"** — good. Clear dealer empty state.
- **"No messages yet"** — good.
- **"Tap to take selfie"** — unclear WHY. → fix: add "Dealers see your photo when you message them."
- **"How dealers/buyers will know you"** (name placeholder) — wordy. → fix: "Your display name"
- **"Condition details, dimensions, etc."** (notes placeholder) — fine.
- **"Show name on sold items"** — slightly unclear. Whose name? → fix: "Show my name when I buy items"
- **Market countdown "drops in --d --h --m"** — broken fallback before JS hydrates. → fix: hide countdown until JS populates it.
- **Admin "13D AWAY"** — cryptic. → fix: "in 13 days" or "Apr 19" for clarity.

### 5. Intentional Layout (Not "Plopped")
Does every element feel deliberately placed, or just dropped where it was convenient?
- **Conversation view:** Most "plopped" screen. Item thumbnail + price crammed next to avatar/name with no alignment logic. Reply input just... floats. → Major redesign needed (see Screen #6).
- **Feed header:** Too many elements competing for one row. Logo, count, seg-ctrl, filter icon — all "plopped" horizontally. → fix: simplify to logo + filter.
- **Settings:** Fields run straight down with no grouping. Profile fields, payment fields, and preferences all at the same visual level. → fix: add section labels as visual breaks.
- **Add item:** Back link is right above title with minimal breathing room. → fix: increase spacing.
- **Onboarding:** Selfie circle, "Add a photo" link, and name field — three elements centered with no visual relationship between them. → fix: remove redundant link, tighten selfie-to-field spacing.

### 6. Component Design Principles
Are components recognizable as standard patterns?
- **Seg-ctrl:** Recognizable iOS-style toggle. Good.
- **Message option buttons:** Look like disabled form fields, not selectable options. → fix: chip pattern with active state.
- **Status pills:** 4 different implementations → fix: consolidate to one `.status-pill`.
- **Buttons:** 2 primary button classes, 3 secondary button classes → fix: consolidate.
- **Inputs:** 3 different input styles → fix: consolidate.
- See full Component Catalog section below.

### 7. Icons vs. Long-Form Text
Where can icons replace or supplement text for a cleaner UI?
- **Bottom nav:** Already uses icons + short labels. Good.
- **Filter button in feed:** Already an icon (filter lines). Good.
- **Back navigation:** "← Back" uses text arrow. Consider: a proper SVG chevron icon would be more compact and universally recognized. → **NEW FIX:** Replace "← Back" text with a 24x24 chevron-left SVG icon on all in-app back links. Keep the text "← Back" only on landing pages where it's a branded choice.
- **FAB:** "+" icon, no text. Good.
- **Favorite heart:** SVG icon. Good.
- **Add item "+"** photo slot: Text "+" character. → fix: use a proper camera/photo SVG icon inside the slot.
- **Settings gear icon:** Nav has it. Good.
- **Unread badge:** A dot indicator (no number) would be cleaner than the current number badge. → fix: use a blue dot for unread, number badge only if count > 1.
- **Booth number "+":** "Add booth number" is text. Could be just an edit icon. → Moot if we move to settings.

### 8. Text Minimization
Can UI text be shortened?
- **"REGISTER FOR EARLY ACCESS"** (button) → "GET EARLY ACCESS" (shorter, same meaning)
- **"We'll text you when inventory goes live."** → "We'll text you when items drop." (shorter, uses app vocabulary)
- **"How dealers/buyers will know you"** (placeholder) → "Your display name"
- **"Post the items you're bringing. Buyers will see them when inventory goes live."** (dealer empty state) → "Post what you're bringing. Buyers see it when items drop."
- **"When you message a seller about an item, your conversation will appear here."** (messages empty) → "Conversations with sellers appear here."
- **"Condition details, dimensions, etc."** (notes placeholder) → "Details, dimensions, etc."
- **"Show name on sold items"** → "Show my name on purchases"
- **Admin timestamps:** "4/7/2026, 9:06:50 AM" → "4/7 9:06 AM" or "2h ago"

### 9. Overflow Fixes
Is any content getting clipped or breaking layout?
- **Feed header on 375px screens:** Logo "EARLY BIRD_" wraps to two lines when seg-ctrl + filter icon share the row. → fix: shrink logo or simplify header.
- **Admin seg-ctrl (5 tabs):** Last tab(s) clipped on mobile without scroll indicator. → fix: add fade/shadow scroll hint.
- **Market dropdown on add-item:** "TEST EVENT - Do..." truncated in half-width column. → fix: use `displayName()` abbreviations or allow full-width when name is long.
- **Conversation reply input:** Not fixed, content can push it off-screen. → fix: fixed positioning.
- **Messages list:** `overflow-x: hidden` already set. Good.
- **Item detail:** `overflow-x: hidden` already set. Good.
- **Body:** `overflow-x: hidden` on html + body. Good.

### 10. Cross-Screen Consistency
Does the app feel like one product, or a collection of different pages?
- **Back navigation:** 3 different styles (gradient overlay, blue link, muted link). → fix: standardize to 2 patterns (photo-overlay + standard in-app).
- **Buttons:** 2 primary classes, 3 secondary classes. → fix: consolidate (see Component Catalog).
- **Inputs:** 3 styles. → fix: one `.form-input` everywhere.
- **Status pills:** 4 implementations. → fix: one `.status-pill`.
- **Page titles:** Feed says "EARLY BIRD_", Dealer Home says "My Booth", Messages says "Messages", Settings says "Settings" → header says "Account" in nav. → fix: match header text to nav label.
- **Screen max-widths:** Landing 480px, feed full, dealer home 480px, messages 480px, admin 600px. This is correct and intentional — photo-centric screens go wider.

### 11. Navigation Clarity for First-Time Users
Can a new user navigate without confusion?
- **Landing → app:** Clear auth flow. Magic link is standard.
- **Bottom nav:** 3 tabs (buyer). Clear icons + labels. But "Browse" should be "Shop" per product language.
- **Missing Saved tab:** Buyers can favorite items but can't find favorites without discovering the All/Saved toggle in the feed header. → fix: add Saved tab to bottom nav.
- **Feed header "← Markets" link:** How to get back to the market list. Blue and small but functional. → fix: restyle as muted context, less visually loud.
- **Dealer mode:** Shop/Sell mental model is clear. Booth tab appears when you're a dealer. Good.
- **Conversation → Messages:** Back button goes to messages list. Good.
- **No breadcrumbs needed.** The app is shallow enough (2-3 levels max) that back buttons suffice.

### 12. Touch Targets (44px minimum)
- **Seg-ctrl buttons:** Current padding 7px 12px = ~25px tall. Below minimum. → fix: increase to 8px 14px.
- **Inquiry action buttons:** 6px 10px padding = ~22px tall. Way too small. → fix: 8px 14px.
- **Admin action buttons:** 4px 8px padding = ~18px tall. Way too small. → fix: 8px 14px.
- **"Dealer? Click here" link:** No padding, relies on font size. → fix: add 8px padding.
- **Carousel dots:** 6px diameter. Tap target should be larger than visual. → fix: 8px visual, 24px tap area with padding.
- **Filter icon:** Has 4px padding. Increase to 8px.
- **All buttons (.btn-primary, .btn-secondary, FAB, nav tabs):** Already at or above 44px. Good.

### 13. Loading / Error / Empty States
- **Loading:** No screens have a loading indicator while fetching data. → fix: add centered `.spinner` to feed, messages, dealer home, favorites, conversation, admin.
- **Error:** Most API calls have error handling in JS but display varies (some use alert(), some show inline text). → fix: standardize to inline error text in `--error` color below the relevant element. Never use alert().
- **Empty states present:** Messages ("No messages yet"), Dealer home ("Your booth is empty").
- **Empty states missing:** Favorites (blank), Feed (no items for market), Admin lists (no dealers/markets/items). → fix: add `.empty-state` component to all.

### 14. Typography Scale Discipline
Is the type scale being followed, or are there random font sizes?
- **Violations found:**
  - Market teaser uses inline `font-size:22px` — not in the scale (should be 20px or 24px). → fix: use 20px.
  - Market teaser stat uses inline `font-size:20px` for count number — correct per scale, but should use 24px to differentiate from heading.
  - Admin stat card `.value` uses 24px — correct.
  - Sheet title uses 15px — correct.
  - Booth number row is 12px — correct.
  - Feed item count is 11px — correct.
  - Market teaser "items"/"dealers" label is inline 11px — correct.
- **Overall discipline is good.** Only 1-2 off-scale values to fix.

### 15. Semantic Color Usage
Is every color used for its intended purpose?
- **Green violations:**
  - "13D AWAY" on admin market card → fix: use `--muted`
  - "100% FREE FOR DEALERS" badge on dealer landing → fix: use blue tint (`#E8F0FE` + `--accent`)
  - Free notice on dealer home → fix: use blue tint
- **Red:** Used correctly (errors, logout only).
- **Blue:** Used correctly (interactive elements, links, active nav).
- **Amber:** Used correctly (HOLD status only).
- **Muted/dim:** Used correctly throughout for secondary/tertiary text.

### 16. Component Recognizability
Do components look like what they are?
- **Buttons look like buttons:** Primary (blue, full-width) = yes. Secondary (bordered) = yes. Message option buttons = NO, look like disabled inputs. → fix: chip pattern.
- **Inputs look like inputs:** Gray fill, rounded. Good.
- **Selects look like selects:** No dropdown arrow indicator on iOS. → fix: add CSS arrow.
- **Toggles look like toggles:** iOS-style switch. Good.
- **Nav looks like nav:** Fixed bottom, icons + labels. Good.
- **Links look like links:** Blue text = interactive. Consistent.
- **Cards look like cards:** Gray fill differentiates from page bg. Good.

---

## Design Tokens (Confirmed)

These stay:
```
--bg: #FAFAF8        (page background)
--text: #1A1A1A       (primary text)
--muted: #666666      (secondary text, labels)
--dim: #AAAAAA        (tertiary, placeholders)
--accent: #0066FF     (links, buttons, active states)
--accent-hover: #0052CC
--error: #D32F2F      (errors only)
--success: #2E7D32    (success/live states only)
--input-bg: #F0EFEC   (input backgrounds, card fills)
--side: 24px          (horizontal rhythm)
```

### Semantic Color Rules
- **Green (`--success`):** ONLY for success confirmations and "LIVE" status pills. Never for dates, countdowns, badges unrelated to success.
- **Red (`--error`):** ONLY for errors and destructive actions.
- **Amber (#B8960C):** ONLY for "HOLD" status.
- **Blue (`--accent`):** Interactive elements — links, buttons, active nav. Never decorative.
- **Dates, countdowns, neutral info:** Use `--muted` or `--text`. Never green.

### Typography Scale
All JetBrains Mono. No other fonts anywhere.
```
10px  — caption, fine print, badge text
11px  — labels, uppercase section headers (weight 600, letter-spacing 0.15em)
12px  — secondary body, metadata, timestamps
13px  — primary body text, button labels, list items
14px  — large body, emphasis
15px  — input text
20px  — screen titles, section headings
24px  — hero text, large prices
```

---

## Spacing System

### Horizontal Rhythm
- `--side: 24px` — the universal horizontal margin. Every content element in a tab screen applies this itself (screen has no side padding).
- Inputs, buttons, cards: full-width within their container (which has `--side` padding).

### Vertical Rhythm
```
4px   — tight: between related inline elements (label to subtext, icon to text)
8px   — compact: between items in a tight group (photo slots, pill gap)
12px  — default: between form fields, list row padding
16px  — comfortable: between distinct elements within a section
20px  — section break: between groups within the same zone
24px  — large section: between titled sections (label + content)
32px  — zone break: between major content zones
48px  — page zone: between above-fold and below-fold, between major page sections
64px  — max zone: info-zone separation (landing pages only)
```

**Current violations to fix:**
- Conversation view uses arbitrary margins (16px, 8px, 4px) with no pattern
- Admin cards use 8px bottom margin (should be 12px for list items)
- Market teaser uses inline margin-top: 16px, 20px, 6px, 8px with no rhythm
- Add item form uses 20px between fields but 24px after photo area — pick one (20px)

### Borders & Dividers
- **List row dividers:** 1px solid `var(--input-bg)` — ONLY on stacked list items (conversation rows, settings rows, my-items, admin timeline).
- **Section dividers:** None. Use vertical spacing (32px+) to separate sections.
- **Card outlines:** None. Cards use `background: var(--input-bg)` fill to differentiate from page bg. No borders.
- **Input focus ring:** `box-shadow: 0 0 0 2px var(--accent)` — all inputs, selects.

### Border Radius
```
4px   — small: pills, badges, small buttons, seg-btn inner
6px   — default: inputs, cards, buttons, seg-ctrl outer, photo slots
12px  — large: chat bubbles, toast notifications
50%   — circle: avatars, FAB, carousel dots
```

**Current violations:**
- Toast notification uses 12px (correct)
- Bottom sheet uses 16px top corners — change to 12px for consistency
- Some admin badges use 4px, others don't specify — standardize to 4px

### Shadows
Only two shadows in the system:
```
box-shadow: 0 1px 3px rgba(0,0,0,0.08)   — subtle: active seg-btn, cards on desktop
box-shadow: 0 4px 12px rgba(0,0,0,0.15)   — elevated: FAB, toast, bottom sheet
```
No other shadows. No blur effects except the frosted-glass header/nav backdrop.

### Motion & Interaction

**Timing curve:** `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease-out) for all transitions. Feels responsive without being bouncy.

**Durations:**
```
0.15s  — instant feedback (button press, toggle, active state)
0.2s   — fast (hover color changes, focus rings, pill transitions)
0.3s   — standard (sheet slide, toast entrance, screen transitions)
0.5s   — slow (only for the logo cursor blink — keep the 1s step-end)
```

**Hover effects (desktop only — use `@media (hover: hover)`):**
- **Buttons (`.btn-primary`):** Background darkens to `--accent-hover`. Already exists, add `transition: background 0.15s`.
- **Secondary buttons:** Background shifts to `--input-bg`. Add `transition: background 0.15s, border-color 0.15s`.
- **Cards/rows (`.conv-item`, `.my-item`, `.market-item`, `.admin-card.admin-clickable`):** `background: var(--input-bg)` on hover. Subtle fill. `transition: background 0.15s`.
- **Links (`.feed-market-link`, `.back-link`, `.admin-link`):** `color: var(--text)` on hover (from `--muted` or `--accent`). `transition: color 0.15s`.
- **Nav tabs:** `color: var(--text)` on hover (from `--muted`). `transition: color 0.15s`.
- **FAB:** `transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.2)` on hover. `transition: transform 0.15s, box-shadow 0.15s`.

**Active/press effects (touch + click):**
- **Buttons:** `transform: scale(0.97)` on `:active`. Quick snap-back. `transition: transform 0.1s`.
- **Cards/rows:** `background: var(--input-bg)` on `:active`. Already exists on `.my-item:active`, extend to all tappable rows.
- **FAB:** `transform: scale(0.92)` on `:active`. Already exists, keep.
- **Favorite heart:** Pulse animation on toggle — `@keyframes heart-pop { 0% { transform: scale(1) } 50% { transform: scale(1.3) } 100% { transform: scale(1) } }` — 0.3s duration, runs once on favoriting.
- **Photo slots (add item):** `opacity: 0.7` on `:active` when tapping to add.

**Focus effects:**
- All inputs: `box-shadow: 0 0 0 2px var(--accent)`. Already exists. Add `transition: box-shadow 0.15s`.
- Seg-ctrl buttons: Active button slides its white background pill. Add `transition: background 0.15s, color 0.15s, box-shadow 0.15s` (already has `transition: all 0.15s` — keep).

**Content transitions:**
- **Bottom sheet:** Slide up with `transition: transform 0.3s ease`. Already exists, keep.
- **Toast:** Slide down from above with `transition: transform 0.3s ease`. Already exists, keep.
- **Seg-ctrl active indicator:** White pill background crossfades (already works via transition on `.seg-btn`).
- **Message compose options:** Fade in when "I WANT THIS" is tapped. `opacity: 0 → 1, transition: opacity 0.2s`.
- **Chat bubbles (new messages):** Appear with `opacity: 0 → 1, transform: translateY(8px) → 0`. `transition: opacity 0.2s, transform 0.2s`. Subtle entrance when new message renders.
- **Loading spinner:** Existing `@keyframes spin` at 0.6s. Keep.
- **Unread dot:** Pulse once on appearance. `@keyframes dot-pulse { 0% { transform: scale(0) } 60% { transform: scale(1.2) } 100% { transform: scale(1) } }` — 0.3s.

**What does NOT animate:**
- Screen transitions (no page slide/fade — hash routing is instant, feels app-like)
- Scroll snap (CSS native, no JS animation)
- Status pill changes (instant swap — a sold item is sold, no need to celebrate)
- Countdown updates (text swap, no ticker animation)

---

## Grid & Layout System

### Page Types

**1. Full-bleed screens** (no max-width constraint on content):
- Feed — photos go edge-to-edge, item cards fill viewport height
- Item detail — photo carousel is full-width from edge to edge
- Favorites — 2-column grid with 1px gap, full-width

**2. Constrained screens** (max-width: 480px, centered):
- Landing pages (buyer + dealer)
- Onboarding
- Dealer home (My Booth)
- Messages list
- Add item form
- Settings/Account

**3. Wide constrained** (max-width: 600px):
- Admin screens

### Feed Grid
**Mobile (<768px):** TikTok-style single column.
- Each `.item-card` fills `calc(100dvh - 110px)` height
- `scroll-snap-type: y mandatory` + `scroll-snap-align: start`
- Photo area is `flex: 1` (takes remaining height after info bar)
- Info bar: price (20px bold) + meta (12px muted) + badge — fixed height at bottom

**Desktop (>=768px):** 2-column grid.
- `grid-template-columns: 1fr 1fr; gap: 1px; background: var(--input-bg)`
- Cards become `height: auto` with `aspect-ratio: 1` on photo area
- Info condensed: price 14px, meta 10px

**Issues with current grid:**
- Feed `scroll-snap-type: y mandatory` can be janky on some iOS versions — consider `proximity` instead of `mandatory` for more forgiving snapping
- The 110px header offset (`calc(100dvh - 110px)`) is brittle — if header height changes, cards don't fill correctly. Should derive from actual header height or use `flex` layout instead of hardcoded calc
- No grid gap between cards on mobile (they're stacked with `border-bottom: 1px solid var(--input-bg)`). This is fine but the 1px line between cards is very subtle — consider 2px or a small gap

**Changes:**
1. Change snap from `mandatory` to `proximity` for smoother feel
2. Replace hardcoded `calc(100dvh - 110px)` with a CSS custom property `--header-h` set dynamically, or restructure feed as a flex column where the item area fills remaining space
3. Keep 1px separator on mobile (it works), keep 1px grid gap on desktop

### Favorites Grid
- 2-column, same as desktop feed grid: `grid-template-columns: 1fr 1fr; gap: 1px`
- Square aspect-ratio photos
- Same card info style as desktop feed (14px price, 10px meta)
- **Currently has no minimum height enforcement** — if you have 1 favorite, the grid is tiny. Add `min-height: calc(100dvh - 120px)` to prevent awkward short pages.

### Conversation Messages Layout
Currently a flat list of flex rows with `justify-content: flex-start/flex-end`. This works but:
- No max-width on the message container itself — on desktop (900px), bubbles span 75% of 900px = 675px which is way too wide for chat
- **Fix:** Add `max-width: 480px; margin: 0 auto` to the conversation message area (same as other constrained screens)

### Admin Grid
- Stat cards: `grid-template-columns: 1fr 1fr; gap: 8px` — good, keep
- Admin content is single-column at 600px max — good for data tables
- **No responsive behavior specified.** On very narrow screens (<360px), the 2-column stat grid squishes. Add `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` for safety.

---

## Component Catalog

### Current State → Target State

Every component below is audited. "Current" = what exists in the CSS/HTML. "Issues" = what's wrong. "Target" = exact spec after redesign.

---

### 1. Primary Button (`.btn-primary`)

**Current state:** TWO classes doing the same thing:
- `.auth-btn` — used on landing pages, onboarding, settings, admin (7 instances)
- `.text-seller-btn` — used on item detail "I WANT THIS" + conversation reply (3 instances)
- Plus 3 inline-styled buttons (filter sheet "Done", market teaser "Browse inventory", booth number "Save") that replicate the same look

**Issues:**
- Two classes for one component = maintenance burden
- Inline-styled buttons bypass the system entirely
- `.auth-btn` on admin has inline `style="width:280px"` and `style="flex:1;background:var(--muted)"` overrides

**Target spec — `.btn-primary`:**
```css
.btn-primary {
  width: 100%;
  background: var(--accent);
  color: #fff;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 16px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.btn-primary:hover { background: var(--accent-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: default; }
```

**Variants (modifier classes):**
- `.btn-primary.btn-dark` — `background: var(--text)` — for "Done" / secondary CTAs
- `.btn-primary.btn-compact` — `width: auto; padding: 10px 16px; font-size: 11px` — for inline actions (conversation "Send", booth "Save")
- `.btn-primary.btn-muted` — `background: var(--muted)` — for secondary admin actions ("Add as Buyer")

**Migration:**
- Replace all `.auth-btn` → `.btn-primary`
- Replace all `.text-seller-btn` → `.btn-primary`
- Replace all 3 inline-styled buttons → `.btn-primary.btn-dark` or `.btn-primary.btn-compact`

---

### 2. Secondary/Ghost Button

**Current state:** THREE classes:
- `.my-item-action` — bordered button on dealer item list (HOLD / SOLD actions)
- `.inquiry-action-btn` — smaller version on seller inquiry rows
- `.admin-action-btn` — even smaller version in admin

**Issues:**
- Three different sizes/styles for the same concept (a secondary action button)
- `.my-item-action` has border + white bg; `.inquiry-action-btn` has `--input-bg` fill + no border; `.admin-action-btn` has `--input-bg` fill + no border
- Touch targets too small on `.inquiry-action-btn` (6px 10px padding) and `.admin-action-btn` (4px 8px)

**Target spec — `.btn-secondary`:**
```css
.btn-secondary {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 4px;
  border: 1px solid var(--input-bg);
  background: #fff;
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
}
.btn-secondary:active { background: var(--input-bg); }
.btn-secondary.danger { color: var(--error); }
.btn-secondary.danger:active { background: #FDECEA; }
```

**Migration:**
- Replace `.my-item-action`, `.inquiry-action-btn`, `.admin-action-btn` → `.btn-secondary`
- Increase all touch targets to minimum 8px 14px padding

---

### 3. Option/Chip Button (`.btn-chip`) — NEW

**Current state:** `.msg-option-btn` — the Buy/Offer/Question buttons on item detail. Styled like form inputs (gray fill, no border), making them look unclickable.

**Target spec — `.btn-chip`:**
```css
.btn-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--input-bg);
  background: #fff;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}
.btn-chip.active {
  border-color: var(--accent);
  color: var(--accent);
  background: #E8F0FE;
}
```

---

### 4. Destructive Button (`.btn-danger`)

**Current state:** `.logout-btn` — red border, no fill, centered text. Only used once.

**Target spec:** Keep as-is. Single-use component, well-styled. Rename class to `.btn-danger` for consistency.

---

### 5. FAB (`.fab`)

**Current state:** 52px blue circle, fixed bottom-right, "+" text. Only on dealer home.

**Issues:** None. Works well. Keep as-is.

---

### 6. Segmented Control (`.seg-ctrl` + `.seg-btn`)

**Current state:** Unified component used for:
- Browse All/Saved toggle (feed header)
- Message filter All/Buying/Selling (messages screen)
- Price posture Firm/Flexible/Make Offer (add item form)
- Admin tabs Dashboard/Markets/Dealers/Items/SMS (admin)

**Issues:**
- Admin 5-tab version overflows on mobile. `.admin-tabs` adds `overflow-x: auto` but no scroll indicator.
- All seg-ctrls look identical regardless of context. The admin tabs are navigation (switching views), while price posture is a form selection — these could arguably look different, but keeping them unified is correct per the design system.
- `.seg-btn` explicitly sets `font-family: 'JetBrains Mono', monospace` — redundant since body sets it, but harmless insurance. Keep.

**Target spec:** Keep current spec. Only fix:
1. Add right-edge fade indicator on `.admin-tabs` to signal horizontal scroll
2. Ensure minimum touch target (current 7px 12px padding = ~25px tall — increase to `8px 14px` for ~27px height, still compact but slightly more comfortable)

---

### 7. Form Input (`.form-input`)

**Current state:** THREE input classes:
- `.auth-input` — landing page phone inputs. Explicitly sets font-family, has `font-variant-numeric: tabular-nums`
- `.form-input` — add item, admin, conversation reply. Inherits body font.
- `.field input[type="text"]` — onboarding, settings. No explicit font, no explicit focus style (it does have `:focus` box-shadow).

**Issues:**
- Three classes for one component
- `.auth-input` has tabular-nums (correct for phone), others don't
- `.field input` focus ring is identical to `.form-input` focus ring, but they're separate CSS rules

**Target spec — `.form-input`:**
```css
.form-input {
  width: 100%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: var(--text);
  background: var(--input-bg);
  border: none;
  padding: 14px 16px;
  border-radius: 6px;
  outline: none;
  font-variant-numeric: tabular-nums;
}
.form-input::placeholder { color: var(--dim); }
.form-input:focus { box-shadow: 0 0 0 2px var(--accent); }
```

**Migration:**
- Delete `.auth-input` class — replace with `.form-input` on landing phone inputs
- Delete `.field input[type="text"]` styles — replace with `.form-input` on onboarding/settings inputs
- One class, everywhere

---

### 8. Form Select (`.form-select`)

**Current state:** One class, used consistently. Nearly identical to `.form-input` but adds `-webkit-appearance: none`.

**Target:** Merge visual properties with `.form-input` base, keep `-webkit-appearance: none` and add a dropdown arrow indicator (CSS background SVG). Currently selects have no arrow on iOS, making them hard to identify as selects.

---

### 9. Form Label (`.form-label`)

**Current state:** TWO label styles:
- `.form-label` — add item form. 11px/600/uppercase/`--muted`, 0.15em spacing.
- `.field label` — onboarding, settings. Same visual spec but separate CSS rule.
- `.sheet-label` — filter sheet. 10px instead of 11px.

**Issues:** Three rules for one look.

**Target:** Consolidate to `.form-label`. Delete `.field label` and `.sheet-label` rules. Use `.form-label` everywhere. Keep 11px (10px is too small for a label).

---

### 10. Status Pill (`.pill-live`, `.pill-hold`, `.pill-sold`)

**Current state:** Used on dealer item list. 10px/600/uppercase, colored background.
- Live: green bg `#EDF7F0`, green text `--success`
- Hold: amber bg `#FDF6E3`, amber text `#B8960C`
- Sold: gray bg `#EEE`, muted text

Also exists as `.badge-*` in admin with slightly different sizing and `.item-card-badge` + `.badge-hold` + `.badge-sold` on feed cards, and `.detail-status-badge` + `.detail-badge-sold` + `.detail-badge-hold` on item detail.

**Issues:** FOUR different badge/pill systems:
1. `.my-item-status-pill` + `.pill-*` (dealer home)
2. `.item-card-badge` + `.badge-hold/sold` (feed cards)
3. `.detail-status-badge` + `.detail-badge-*` (item detail)
4. `.admin-badge` + `.badge-*` (admin)

All do the same thing with slightly different sizes and padding.

**Target spec — `.status-pill`:**
```css
.status-pill {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 10px;
}
.status-pill.live { background: #EDF7F0; color: var(--success); }
.status-pill.hold { background: #FDF6E3; color: #B8960C; }
.status-pill.sold { background: #EEE; color: var(--muted); }
```

**Full-width variant** for item detail status display:
```css
.status-banner {
  width: 100%;
  text-align: center;
  padding: 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

**Additional admin-only variants:** `.status-pill.upcoming`, `.status-pill.past`, `.status-pill.deleted` — use same base, different colors.

**Migration:**
- Delete `.my-item-status-pill`, `.pill-*`, `.item-card-badge`, `.badge-hold/sold`, `.detail-status-badge`, `.detail-badge-*`, `.admin-badge`, `.badge-*`
- Replace ALL with `.status-pill` + modifier

---

### 11. Page Header (`.feed-header`)

**Current state:** Sticky, frosted glass, safe-area aware. Used on feed, dealer home, messages, favorites, settings.

**Issues:** None structurally. Works well.

**Target:** Keep as-is. This is the one component that's properly implemented and consistently used.

---

### 12. Empty State (`.empty-state`)

**Current state:** Centered block with h2 (20px bold) + p (13px muted). Used on dealer home and messages.

**Issues:**
- Missing on favorites and feed (no empty state at all)
- Admin screens have no empty state for empty lists

**Target:** Keep current spec. Just apply it everywhere it's missing:
- Favorites empty: "No saved items yet" / "Heart items in the feed to save them here."
- Feed empty (no items): "No items yet" / "Check back when inventory drops."
- Admin empty lists: "No [dealers/markets/items] yet"

---

### 13. Toast Notification (`.toast`)

**Current state:** Fixed top, white card, rounded, shadow, avatar + text. Slides in from above.

**Issues:** None. Well-implemented.

**Target:** Keep as-is.

---

### 14. Bottom Sheet (`.sheet-overlay` + `.sheet`)

**Current state:** Full-screen overlay with slide-up panel. Used for feed filters.

**Issues:**
- 16px top corner radius — should be 12px per radius system
- Handle width (36px) is fine

**Target:** Change `border-radius: 16px 16px 0 0` → `12px 12px 0 0`. Otherwise keep.

---

### 15. Bottom Nav (`.bottom-nav` + `.nav-tab`)

**Current state:** Fixed bottom, frosted glass, icon + text label tabs.

**Issues:** Covered in screen-by-screen plan (rename Browse → Shop, add Saved tab, etc.)

**Target spec stays the same** — just content/label changes.

---

### 16. Conversation Row (`.conv-item`)

**Current state:** Flex row with item thumbnail (52px square) + avatar (circular, inline in the info area) + name + price + preview + timestamp.

**Issues:**
- Avatar adds visual noise alongside the item thumbnail
- No unread state

**Target:**
- Remove avatar from row
- Add `.conv-item.unread` state: bold name + blue dot indicator
- Keep 52px thumbnail + text info layout

---

### 17. Zero Inline Styles — Full Migration

**167 inline `style=""` attributes exist in the codebase.** Every single one must be replaced with a CSS class. No exceptions. No "just this one margin." If it's a visual property, it lives in `<style>`.

Below is the full inventory, grouped by area. Each group gets new named classes.

---

#### A. Static HTML (lines 1684–1953) — 26 instances

| Line | Current inline | New class |
|------|---------------|-----------|
| 1684 | `style="margin-top: 8px;"` on onboarding button | `.onboard-submit` (margin built into class) |
| 1691 | `style="display:flex;align-items:baseline;gap:8px;"` feed header left | `.feed-header-left` |
| 1693 | `style="font-family:...;font-size:11px;color:var(--muted);"` item count | `.feed-item-count` |
| 1695 | `style="display:flex;align-items:center;gap:8px;"` feed header right | `.feed-header-right` |
| 1700 | `style="background:none;border:none;cursor:pointer;padding:4px;..."` filter btn | `.feed-filter-btn` |
| 1707 | `style="display:block;font-size:12px;color:var(--accent);..."` markets link | `.feed-market-link` |
| 1716, 1722 | `style="padding:10px 12px;font-size:14px;"` on .form-select | `.form-select--sheet` (variant) |
| 1726 | Full button inline styles | `.btn-primary.btn-dark` |
| 1737 | `style="font-size:12px;"` booth number row | `.booth-number` |
| 1739 | `style="font-size:12px;color:var(--muted);..."` booth event | `.booth-event-name` |
| 1741 | `style="display:flex;gap:16px;..."` booth stats | `.booth-stats` |
| 1783 | Full padding/max-width on teaser content | `.teaser-content` |
| 1798 | Full link styles for add-item back | `.back-link` (reuse existing) |
| 1860 | `style="padding:0 var(--side);"` settings wrapper | `.settings-content` |
| 1906–1911 | 6 instances on admin login | `.admin-login-container`, `.admin-login-logo`, `.admin-login-label`, `.admin-login-input`, `.admin-login-btn`, `.admin-login-error` |
| 1917–1921 | 4 instances on admin header | `.admin-header`, `.admin-header-links`, `.admin-link`, `.admin-link--muted` |
| 1953 | `style="position:relative;"` on messages badge | `.nav-tab-label` (position:relative built in) |

#### B. Landing/Market JS (lines 2081–2149) — 12 instances

New classes needed:
- `.market-item` already exists but needs `cursor: pointer` added to the class (currently inline)
- `.teaser-preview-grid` — 3-col grid for market preview images
- `.teaser-preview-cell` — aspect-ratio:1, border-radius:6px, overflow:hidden
- `.teaser-header` — margin-top:20px wrapper
- `.teaser-title` — 20px bold (use existing scale, not inline 22px)
- `.teaser-date` — 14px muted
- `.teaser-countdown` — 13px, uppercase, letter-spacing
- `.teaser-countdown.live` — accent color variant
- `.teaser-stats` — flex row with gap
- `.teaser-stat-value` — 24px bold mono
- `.teaser-stat-label` — 11px muted
- `.btn-primary.btn-dark` — reuse for "Browse inventory" button

#### C. Feed/Favorites JS (lines 2374–2427) — 4 instances

- `.empty-state-icon` — 32px emoji/icon above heading in empty states
- Item title on feed cards: `style="color:var(--text);font-weight:500;"` → `.item-card-title` class

#### D. Messages/Conversation List JS (lines 2490–2497) — 8 instances

New classes:
- `.conv-avatar` — 36px circle image
- `.conv-avatar-placeholder` — 36px circle with initials (reuse `.inquiry-avatar-placeholder` pattern)
- `.conv-item` already exists but the JS uses `style="text-decoration:none;color:inherit;"` → add those to the class definition
- `.conv-thumb` already exists but JS re-specifies `style="width:56px;height:56px;..."` → update the class to 56px (currently 52px)
- `.conv-name-row` — flex row with avatar + name
- `.conv-price-line` — 12px, text color, truncation
- `.conv-meta` already exists — ensure it covers all needed styles

#### E. Booth/Dealer Home JS (lines 2556–2658) — 8 instances

New classes:
- `.booth-number-display` — font-weight:600 with mono number
- `.booth-number-edit` — link style
- `.booth-stat` — mono number + label pattern (reuse for live/hold/sold counts)
- `.booth-stat-value` — 18px mono bold
- `.booth-stat-label` — muted/colored label
- `.booth-input` — compact input for inline edit (width:80px variant)
- `.btn-primary.btn-compact` — reuse for save button
- Error state `<li>` → `.list-error`

#### F. Item Detail JS (lines 2788–2929) — 12 instances

New classes:
- `.detail-title` — 14px muted, below price (for item title in detail view)
- `.detail-loading` — centered muted text for "Loading inquiries..."
- `.detail-empty` — centered muted text for "No inquiries yet"
- `.detail-ownership` — centered muted text for "This is your listing"
- `.error-text` — generic inline error (color:var(--error))
- `.compose-header` — 11px uppercase section label "Message seller"
- `.compose-options` — flex column gap container
- `.compose-input-area` — hidden container for custom textarea
- `.compose-textarea` — textarea with no-resize, fixed width
- `.compose-sent` — centered success message after sending

#### G. Conversation View JS (lines 3002–3071) — 18 instances

This is the biggest offender. New classes:
- `.conv-header` — flex row with item context
- `.conv-header-thumb` — 60px square rounded image
- `.conv-header-info` — flex column for price + name + phone
- `.conv-header-price` — bold, tabular-nums
- `.conv-header-name` — 12px muted with optional avatar
- `.conv-header-phone` — 11px accent link
- `.conv-header-avatar-sm` — 24px inline avatar
- `.conv-header-avatar-lg` — 32px inline avatar
- `.conv-payment` — 11px muted, payment method info
- `.conv-no-messages` — muted empty state text
- `.msg-row` — flex row for a chat message (justify-content varies)
- `.msg-row.sent` — align right
- `.msg-row.received` — align left
- `.msg-bubble` — max-width:75%, 10px 14px padding, 12px radius
- `.msg-bubble.sent` — accent bg, white text
- `.msg-bubble.received` — input-bg, text color
- `.msg-avatar` — 24px circle, flex-end aligned
- `.conv-reply-bar` — flex row with input + send button, fixed to bottom
- `.conv-reply-input` — form-input with flex:1

#### H. Admin JS (lines 3427–4107) — 79 instances

The admin has the most inline styles by far. New classes needed:

**Shared admin patterns:**
- `.admin-loading` — "Loading..." muted text (used 7 times)
- `.admin-error` — error color text (used 8 times)
- `.admin-empty` — muted "No X found" text
- `.admin-detail-title` — 18px bold heading
- `.admin-detail-meta` — 12px muted metadata line
- `.admin-detail-link` — accent color clickable link in body text
- `.admin-row-card` — admin card with flex + thumbnail layout
- `.admin-row-card-info` — flex:1 area
- `.admin-row-card-meta` — 11px muted sub-info
- `.admin-btn-row` — flex row with gap for multiple buttons
- `.admin-section-header` — section title with flex space-between (for search input)
- `.admin-search-input` — compact input (width:140px, 11px, 6px padding)
- `.admin-badge--test` — yellow TEST badge

**Blast-specific:**
- `.blast-history-item` — card for sent blast
- `.blast-history-meta` — date + audience + status line
- `.blast-history-body` — pre-wrap message preview in input-bg card

**Item detail admin:**
- `.admin-photo-strip` — flex row, overflow-x auto, for item photos
- `.admin-photo-thumb` — 120px square, rounded, shrink:0
- `.admin-item-price` — 24px bold with tabular-nums
- `.admin-item-info-row` — flex row for status + condition + posture
- `.admin-item-notes` — 12px muted notes block
- `.admin-item-stats` — favorites + conversations count
- `.admin-conversation-row` — buyer name + last message + timestamp

**Archived markets:**
- `.admin-archived-toggle` — clickable section header with arrow
- `.admin-archived-section` — collapsible container
- `.admin-card--dimmed` — opacity:0.6 for past/archived items

---

**Total new CSS classes to create: ~65**
**Total inline style attributes to remove: 167**

Every JS function that builds HTML (`renderConversations`, `loadConversation`, `openMarketTeaser`, `loadDealerHome`, `loadItemDetail`, `textSeller`, `loadAdmin*`) must be rewritten to use class names only. The HTML templates go from:

```js
// BEFORE (broken)
html += `<div style="font-size:12px;color:var(--muted);margin-top:4px;">${phone}</div>`;

// AFTER (correct)
html += `<div class="admin-detail-meta">${phone}</div>`;
```

No exceptions. No "just a small margin-top." If it needs a margin, make a class or add it to an existing class's definition.

---

## Screen-by-Screen Plan

### 1. Buyer Landing Page

**Current state:** Functional and clean. The strongest screen in the app. Good hierarchy with markets list, auth form, how-it-works, FAQ.

**Issues:**
- Market countdown text shows `--d --h --m` placeholder when JS hasn't hydrated (fallback HTML). Looks broken on first paint.
- "Dealer? Click here" link at 11px is appropriately subtle but could use slightly more tap target padding.
- Below-fold content (How it Works + FAQ) is well-structured but the two-column desktop layout (`info-grid`) has no visual differentiation between the two sections.
- Phone input placeholder "(310) 555-1234" — good.
- CTA "REGISTER FOR EARLY ACCESS" — good, clear, full-width.

**Changes:**
1. **Fix countdown fallback.** Change static HTML fallback to show just the market name + date without the broken `--d --h --m`. JS will populate the countdown when it hydrates.
2. **Increase tap target on "Dealer? Click here".** Add `padding: 8px 0` so the touch area is comfortable without changing visual size.
3. **Add subtle top divider to info-zone.** A single 1px `--input-bg` line to separate above-fold from below-fold. The 64px margin alone doesn't signal "new section" clearly enough.
4. **Market items: add tap affordance.** They're clickable (to market teaser) but have zero visual indication. Add a subtle `→` or change cursor isn't enough on mobile. Add a small chevron or make the whole row look tappable with hover/active state.

### 2. Dealer Landing Page

**Current state:** Mirrors buyer landing structure. Good headline hierarchy with accent-colored second line. "100% FREE FOR DEALERS" badge in green.

**Issues:**
- The green free badge uses `--success` color. This is a branding badge, not a success state. Green here implies "status: good" rather than "fact: free."
- "← Back" link at top left is lonely — page has no logo/header. Feels like you left the app.
- Below-fold FAQ is identical structure to buyer landing, which is good for consistency.

**Changes:**
1. **Change free badge color.** Use `--accent` (blue) background tint instead of green. Blue = information/action in this system. `background: #E8F0FE; color: var(--accent);` — same style used for buyer role badges in admin.
2. **Add logo to dealer landing.** Put "EARLY BIRD_" logo in the header area (same position as buyer landing), with "← Back" as a text link below or beside it. The dealer landing should feel like part of the same app, not a disconnected page.
3. **Tighten spacing.** The gap between headline and sub-text (currently margin: 32px 0 8px) leaves too much air above the headline after the back link. Reduce to `margin: 20px 0 8px`.

### 3. Feed (Browse)

**Current state:** TikTok-style vertical scroll with snap. Full-bleed photos. Header with logo, item count, All/Saved toggle, filter icon. Market name link below header.

**Issues:**
- **Logo wraps to two lines on small screens.** "EARLY BIRD_" at 20px + "11 items" badge + seg-ctrl + filter icon is too much for one row on 375px wide screens. The logo breaks to "EARLY / BIRD_" on two lines.
- **"← Downtown Modernism · Sun, Apr 26" link** is useful navigation but styled as blue link text that looks like a breadcrumb. It's the only blue text in the header area, making it visually loud.
- **All/Saved toggle in the header** competes with the market name for attention. Two distinct interactive zones stacked in the header is busy.
- **Item count badge** ("11 items") in mono font next to the logo adds noise. Item count is secondary info being placed at the highest hierarchy level.
- **Favorite heart button** on dark overlay is well-placed. Good.
- **Price/meta below photo** — clean. "$150 / Brass Desk Lamp / Eli" is good hierarchy.
- **No loading state.** Feed shows nothing while loading.

**Changes:**
1. **Shrink logo on feed.** Use 16px instead of 20px for the feed logo. The landing page "owns" the large logo. Inside the app, the logo is wayfinding, not branding.
2. **Move item count.** Remove from header. If needed, show it in the market name line: "Downtown Modernism · 11 items · Sun, Apr 26".
3. **Simplify header.** One line: logo (left), filter icon (right). Move All/Saved toggle to the market name row or remove it entirely (the Favorites tab in bottom nav already serves this purpose — having "Saved" in both the header toggle AND the bottom nav is redundant).
4. **Restyle market name link.** Change from blue link to `--muted` text with a subtle left arrow. It's navigation context, not a CTA. `color: var(--muted); font-size: 11px;`
5. **Add feed loading state.** Show a centered spinner or skeleton cards while items load.
6. **Add empty state for feed.** When no items exist for a market: "No items yet. Check back when inventory drops." centered, muted text.

### 4. Item Detail (Buyer View)

**Current state:** Full-bleed photo at top, carousel with dots and counter. Back button overlaid on photo with gradient. Price, posture, condition, notes, dealer info below. "I WANT THIS" CTA at bottom.

**Issues:**
- **Title ("Brass Desk Lamp") appears ABOVE the price.** Price should be the dominant element — it's the most important info. Title is supporting context.
- **"Open to offers" under the price** is good placement but uses plain muted text. This is an actionable detail (it tells you the price is negotiable) — could be slightly more prominent.
- **Condition ("MINT")** as uppercase label is good.
- **Dealer section** ("Eli / Object Lesson") has no visual separator from the item notes above it. Reads as one continuous block.
- **"No inquiries yet"** text appears on seller's own item view — this is correct for seller view but should not appear on buyer view.
- **Carousel dots** are tiny (6px) — fine for visual indication but could be slightly larger for accessibility.

**Changes:**
1. **Reorder: Price first, then title.** Price at 24px bold, title below at 13px muted. Price is the hero.
2. **Style price posture as a pill.** "FLEXIBLE" / "FIRM" / "MAKE OFFER" — use the same pill component as status badges but in a neutral color. `background: var(--input-bg); color: var(--muted); font-size: 10px; uppercase.` Placed inline after the price or on its own line.
3. **Add separator before dealer info.** 1px `--input-bg` border-top with 20px padding-top/margin-top (this CSS exists but isn't rendering — check `detail-seller` border).
4. **Increase carousel dots to 8px.** Improves touch target and visibility.
5. **Back button:** Keep the gradient overlay approach — it works well over photos. But ensure the gradient is tall enough to not crowd the button against the photo content.

### 5. Message Compose Flow (on Item Detail)

**Current state:** Tapping "I WANT THIS" reveals three option buttons (Buy / Make an offer / Ask a question) and a textarea. Options are plain gray buttons.

**Issues:**
- **Option buttons look like disabled elements**, not selectable choices. They're `--input-bg` with `--text` color — visually identical to form inputs.
- **No clear "selected" state.** When you pick "Buy", the button should look active/selected.
- **Textarea appears abruptly** below the options with no transition or context.
- **Send button** is styled as the full-width accent button, which is correct.

**Changes:**
1. **Style option buttons as selectable chips.** Add a border: `1px solid var(--input-bg)` default state, and on selection: `border-color: var(--accent); color: var(--accent); background: #E8F0FE`.
2. **Show textarea with pre-populated text** immediately when an option is selected. The current behavior works, just needs the visual distinction above.
3. **Add "Send" label to button** (currently uses the generic `.text-seller-btn` class). Make it say "SEND MESSAGE".

### 6. Conversation View

**Current state:** Reuses `#item-detail` screen. Dynamically renders: item thumbnail + price + other party name/avatar/phone + payment info + chat bubbles + reply input. All using inline styles in JS.

**Issues (this is the weakest screen):**
- **Back button overlaps item thumbnail.** The fixed-position `.detail-back` gradient overlay was designed for full-bleed photos, but conversation view starts with a small 60px thumbnail. The back button's gradient covers the thumbnail.
- **No clear header structure.** The conversation partner's name, avatar, phone, and payment info are all crammed into one block with no visual hierarchy. It's a blob of information.
- **Chat bubbles use inline styles** — no CSS classes. This means they can't be consistently maintained.
- **Reply input is in `.detail-actions`** which has its own padding (`0 24px`), but the input has `padding: 0 24px` again inside a flex container, creating inconsistent alignment.
- **Reply input floats** at the bottom of the content, not fixed. On long conversations, you have to scroll past all messages to reply.
- **No message timestamps** in the chat view. You can't tell when messages were sent.

**Changes:**
1. **Build a proper conversation header.** Replace the gradient overlay back button with a solid white/bg header bar:
   - Row 1: `← Back` link (left-aligned, `--muted` color)
   - Row 2: Item thumbnail (40px) + price + item title (truncated) — all in one row
   - Row 3: Other party's avatar (32px) + name (bold) + phone (blue link) on one line
   - Row 4: Payment info (Venmo/Zelle) in muted text — only visible to buyer
   - This header should be sticky so context is always visible.
2. **Extract chat bubble styles to CSS classes.** Create `.msg-bubble`, `.msg-sent`, `.msg-received` classes instead of inline styles. Sent = `--accent` bg, white text. Received = `--input-bg`, `--text`.
3. **Fix reply input.** Make it `position: fixed; bottom: 0` (like a real chat app). Add safe-area padding. The conversation content needs corresponding bottom padding to not be hidden behind the fixed input.
4. **Add timestamps to messages.** Show time (e.g., "2:30 PM") below each message or below groups of messages from the same sender. Font-size 10px, `--dim` color, centered.
5. **Remove detail-back gradient** when in conversation mode. The conversation is not a photo-first view.

### 7. Messages List

**Current state:** Feed header "Messages" + optional seg-ctrl (All/Buying/Selling for dealers) + conversation rows with item thumbnail, avatar, name, price, last message preview, timestamp.

**Issues:**
- **Avatar overlaps/crowds the item thumbnail.** The 52px item thumbnail and circular avatar next to it create a visually busy left edge. Two images competing for attention.
- **"You inquired · 1h ago"** and **"Inquiry from · 1h ago"** are good contextual labels.
- **No unread indicator.** All conversations look the same whether they have new messages or not.
- **Price ($180, $450) uses default body font.** Should be bolder/more prominent since it's the primary identifier alongside the person's name.
- **Messages tab label in nav says "Messages"** — the bottom nav shows "Browse | Messages | Account" which is fine.
- **Seg-ctrl (All/Buying/Selling)** for dealers: correctly hidden for buyers, shown for dealers. Good.

**Changes:**
1. **Simplify conversation row.** Remove the circular avatar from the list view. The item thumbnail is the primary visual anchor (it tells you which item the conversation is about). The person's name in text is sufficient. This reduces visual clutter significantly.
2. **Add unread indicator.** Bold the name + show a blue dot (6px circle, `--accent` fill) on the left side of unread conversations.
3. **Bold the price.** Make `.conv-meta` price `font-weight: 700` to improve scannability.
4. **Truncate last message preview.** Ensure single-line truncation with ellipsis (already done via CSS but verify the `conv-meta` isn't wrapping).

### 8. Favorites

**Current state:** Feed header "Favorites" + 2-column grid of saved items. Same card style as feed but in grid layout.

**Issues:**
- **No empty state.** When there are no favorites, the screen is completely blank below the header. Just empty beige.
- **No way to unfavorite from this screen.** You have to tap into the item, then unfavorite. The heart button from the feed cards doesn't appear on the favorites grid.
- **Favorites screen exists alongside "Saved" toggle in feed header** — redundant navigation paths.

**Changes:**
1. **Add empty state.** Centered text: "No saved items yet" (20px bold) + "Heart items in the feed to save them here." (13px muted). This matches the empty state pattern used in Messages and Dealer Home.
2. **Add heart button to favorite grid cards.** Show the filled heart overlay on each card so users can unfavorite directly.
3. **Remove the "Saved" toggle from feed header.** The Favorites tab in bottom nav is the canonical way to access saved items. Having two paths is confusing and clutters the feed header. (If the user disagrees with this, we keep both, but flag it as a consideration.)

### 9. Dealer Home (My Booth)

**Current state:** Feed header "My Booth" + booth number link + market name/date + empty state or items list + FAB.

**Issues:**
- **"+ Add booth number" link** in header is blue link text, which is correct for an action but feels like it belongs in settings, not the booth header. Booth number is a one-time setup detail.
- **No countdown on dealer home.** The market date is shown but no countdown to drop. Dealers need to know how long until their items go live.
- **Empty state** ("Your booth is empty") is well-done. Good copy.
- **FAB (+)** is well-positioned and clearly an add action. Good.
- **Items list** (when populated) shows thumbnail + price + title + status pill + actions. This is good structure but the action buttons (HOLD/SOLD) are very small (10px text, 7px padding).
- **No market selector.** If a dealer has items across multiple markets, there's no way to switch between them on this screen.

**Changes:**
1. **Add countdown.** Below the market date, show "drops in Xd Xh Xm" in `--muted` 12px, same format as landing page. Update live.
2. **Move booth number to settings.** Remove from the booth header. It's not information that changes per-session. Show it in settings under profile.
3. **Increase action button size.** Bump to 11px text, 8px 14px padding. Current size is below comfortable touch target.
4. **Add market picker.** If dealer has items across multiple upcoming markets, show a seg-ctrl or dropdown at the top to switch between markets.
5. **Stats row.** Keep the existing stats display (items count, etc.) but ensure it shows even when items exist (not just on empty state).

### 10. Add Item Form

**Current state:** Back link + "Add item" title + photo upload area + Title + Price + Condition/Market row + Price Posture seg-ctrl + Notes + Post Item button.

**Issues:**
- **Back link ("← Back") is a plain text link** with no visual weight. Consistent with other screens but positioned very close to the page title with minimal spacing.
- **Photo upload area** is a single 72px square with "+". After adding photos, they show as draggable 72px thumbnails. This works but the single empty slot doesn't clearly communicate "add up to 5 photos."
- **Market dropdown** shows "TEST EVENT - Do..." truncated. The `form-select` at 15px in a narrow half-width column truncates long market names.
- **Price Posture seg-ctrl** is well-implemented. "FIRM / FLEXIBLE / MAKE OFFER" works.
- **No "required" indicators.** Photos and Price are required, but there's no visual cue. The labels just say "PRICE" and the photo area has no label at all.
- **Form has no section grouping.** All fields run together vertically with uniform spacing. There's no visual distinction between required (photos, price) and optional (title, condition, notes) fields.

**Changes:**
1. **Add photo area label.** "PHOTOS" label above the photo slots, matching other form labels. Add subtext: "1 required, up to 5" in dim text.
2. **Show all 5 photo slots.** Show 5 slots (first with "+", rest as empty dashed outlines). This communicates the max and encourages multiple photos. Filled slots show the image; empty slots show the dashed outline.
3. **Add required indicator.** Add a red asterisk or "(required)" text to PHOTOS and PRICE labels.
4. **Group fields visually.** Add 8px more spacing between required fields (photos, price) and optional fields (title, condition, notes). Or add a subtle "OPTIONAL" section label above the optional group.
5. **Fix market dropdown truncation.** Use `text-overflow: ellipsis` and ensure the select element has enough width, or abbreviate market names in the dropdown options (use `displayName()` function).
6. **Increase back link spacing.** Add `margin-bottom: 16px` between back link and "Add item" title.

### 11. Settings

**Current state:** Feed header "Settings" + "Profile" title + Name/Business Name fields + Payment section (Venmo/Zelle) + Preferences (show name on sold toggle) + Save button + Log out button.

**Issues:**
- **Double title.** Feed header says "Settings" and immediately below it says "Profile" in 20px bold. Two headings stacked with no content between them.
- **"Profile" is actually the settings title** (via `.settings-title`), but it conflicts with the header "Settings." The screen is called "Settings" in the nav but the content is titled "Profile."
- **Save button is always visible** even when nothing has changed. No dirty-state tracking.
- **No selfie/avatar management.** You set your photo during onboarding but can't change it in settings.
- **Log out button** is red-bordered, centered. Visually prominent for a destructive action — this is correct.
- **Payment section** (Venmo/Zelle) is dealer-only but shows for all users. Buyers don't need payment fields.
- **No phone number display.** Your own phone number isn't shown anywhere in settings.

**Changes:**
1. **Remove "Profile" title.** The feed header already says "Settings" (or change it to say "Account" to match the nav tab label). One title per screen.
2. **Rename feed header to "Account"** to match bottom nav tab label. Consistency.
3. **Add avatar section.** Show current selfie (circle, same as onboarding) at the top of settings with a "Change photo" tap target. Reuse the selfie-preview component.
4. **Show phone number.** Display the user's phone number (read-only) at the top of the profile section. This confirms their identity and which number they're logged in with.
5. **Conditionally show payment fields.** Only show Venmo/Zelle fields for dealers. Buyers don't need them.
6. **Add booth number field here.** Move booth number from the dealer home header into settings, under the dealer-specific section.
7. **Dirty-state save button.** Disable/gray out "Save changes" button until a field actually changes. Or even better: auto-save on field blur with a subtle "Saved" toast confirmation.

### 12. Onboarding

**Current state:** "Almost there" + "Quick setup, then you're in." + selfie upload circle + name field + "LET'S GO" button.

**Issues:**
- **No progress indication.** Users don't know if this is one step or five.
- **Selfie circle placeholder text** "Tap to take selfie" is clear but the circle itself is small (100px) and the placeholder is in 11px muted text. On mobile the tap target is fine but visually it's underwhelming.
- **"Add a photo" link below the circle** is redundant with the circle itself being clickable. Two tap targets for the same action.
- **No explanation of why selfie is needed.** Users might be uncomfortable uploading a selfie without knowing it'll be shown to dealers on their inquiries.
- **Dealer onboarding is identical to buyer.** Dealers should also be prompted to add first item after onboarding.

**Changes:**
1. **Increase selfie circle to 120px.** Makes it more prominent and easier to tap.
2. **Remove "Add a photo" link.** The circle is the tap target. One affordance, not two.
3. **Add context line.** Below the selfie area: "Dealers see your photo when you message them." in 11px muted. Explains the purpose.
4. **Make selfie feel required.** Add a subtle indicator that this step matters. Currently it looks optional because there's no asterisk or "required" text.
5. **For dealers: add "Add your first item" step after name.** Or redirect to add-item screen after onboarding completes.

### 13. Admin Login

**Current state:** Centered logo + "ADMIN" label + password field + LOG IN button.

**Issues:**
- **Perfectly fine.** Simple, centered, no clutter. This is an internal screen — it doesn't need to be beautiful.
- **Password field width (280px)** is hardcoded inline style. Should use a max-width instead so it's responsive.
- **No error state visible** by default (error div exists but empty).

**Changes:**
1. **Change width: 280px to max-width: 280px; width: 100%.** Prevents overflow on very narrow screens.
2. **No other changes.** This screen works fine.

### 14. Admin Dashboard

**Current state:** Title "Admin" + App/Logout links + 5-tab seg-ctrl (Dashboard/Markets/Dealers/Items/SMS) + stat cards + next market card + recent actions feed.

**Issues:**
- **Seg-ctrl with 5 tabs is too wide.** On mobile, tabs compress and text may truncate. The `overflow-x: auto` on `.admin-tabs` allows scrolling but the scroll indicator is invisible — users don't know they can scroll.
- **"13D AWAY" uses green color.** Green = success/live in our system. A date countdown is neutral info, not a success state.
- **Stat cards** (Active dealers: 2, Buyers: 2, Items this week: 11, Sold: 0) are clean. Good component.
- **Recent actions feed** is minimal but functional. "edit dealer 4/7/2026, 9:06:50 AM" — the timestamp format is very long. Could be shorter.
- **No visual hierarchy between sections.** Stats, next market, and actions all run together.

**Changes:**
1. **Fix seg-ctrl overflow.** Two options:
   - (A) Allow horizontal scroll but add a subtle fade/shadow on the right edge to indicate scrollable content.
   - (B) Stack tabs into two rows on mobile (3 on top, 2 on bottom).
   - **Recommended: (A)** with right-edge fade indicator.
2. **Fix countdown color.** Change "13D AWAY" from green to `--muted`. It's informational, not a status.
3. **Shorten action timestamps.** Use relative time ("2h ago") or short format ("4/7 9:06 AM") instead of full ISO-style timestamp.
4. **Add section spacing.** 32px gap between stat cards, next market card, and actions feed. Currently they're too close together.
5. **Add "UPCOMING MARKET" label** above the next market card. Currently it appears as just another card with no context label.

### 15. Bottom Navigation

**Current state:** Fixed bottom bar with frosted glass effect. Tabs: Browse | [Booth — dealers only] | Messages | Account. SVG icons + text labels.

**Issues:**
- **"Browse" label** contradicts DESIGN.md which says "No 'Browse' as a label. It's Shop/Sell." The nav should say "Shop" not "Browse."
- **"Account" label** but the screen header says "Settings." These should match.
- **No "Favorites/Saved" tab** for buyers. DESIGN.md says buyer nav should be "Shop · Saved · Messages." Currently it's "Browse · Messages · Account." Saved/Favorites is missing from the nav.
- **Active state is blue icon + text.** Good — matches accent color system.
- **Dealer nav** should show: "Shop · Booth · Messages · Account" when in sell mode, or the Shop/Sell toggle should be more prominent.
- **Icons are simple stroke SVGs.** Clean and recognizable. Good.
- **Nav disappears on item detail/conversation.** This is correct for item detail (full-screen photo view) but wrong for conversation — you should be able to navigate away from a conversation via nav.

**Changes:**
1. **Rename "Browse" to "Shop."** Matches the product language.
2. **Rename screen header "Settings" to "Account"** (or vice versa — pick one, use it everywhere). Recommended: "Account" in nav, "Account" as header.
3. **Add "Saved" tab for buyers.** Buyer nav: Shop · Saved · Messages · Account. Heart icon for Saved.
4. **Show nav during conversations.** Don't hide bottom nav when viewing a conversation. Only hide it on item detail (photo-first), add item form, and landing/auth screens.
5. **Ensure active tab is correct** when returning from sub-screens. Currently "Browse" stays highlighted even when viewing Settings.

---

## Cross-Screen Issues

### A. Inconsistent Back Navigation
- Landing pages: no back button (correct — they're entry points)
- Dealer landing: "← Back" plain blue link
- Item detail: "← Back" white text on gradient overlay
- Add item: "← Back" blue link, different position than dealer landing
- Conversation: Uses item detail's gradient overlay back (wrong — no photo behind it)
- Admin detail screens: "← Back" muted text link

**Fix:** Establish one back-navigation pattern for in-app screens:
- **Photo-first screens (item detail):** White text on gradient overlay. Keep as-is.
- **All other screens (add item, conversation, admin details):** Consistent muted text "← Back" at top-left, same font size (12px), same color (`--muted`), same padding.

### B. Missing Loading States
Screens that load data but show nothing while loading:
- Feed
- Messages list
- Dealer home items
- Favorites
- Conversation view
- Admin screens

**Fix:** Add a centered spinner (reuse existing `.spinner` component, but in `--accent` color on white instead of white on blue) for all async-loading screens. Show it immediately, hide when content renders.

### C. Missing Empty States
Screens with no empty state when content is absent:
- Favorites (completely blank)
- Feed (no items for a market)

**Fix:** Every screen that can be empty needs: heading (20px bold) + subtext (13px muted) centered in the viewport. Consistent pattern with Messages and Dealer Home empty states.

### D. Inline Styles in JavaScript
The conversation view, market teaser, admin screens, and several other dynamically rendered views use extensive inline styles in JS template literals. This makes the design system unenforceable.

**Fix:** Extract all inline styles to CSS classes. Every visual element rendered by JS should use a class defined in the `<style>` block. This is a large refactor but essential for maintainability. Priority areas:
1. Conversation view (most broken visually)
2. Market teaser
3. Admin content areas
4. Feed item rendering

### E. Form Input Inconsistency
Three different input styles exist:
1. `.auth-input` (landing pages) — includes `font-family: JetBrains Mono` explicitly
2. `.form-input` (add item, admin forms) — inherits body font
3. `.field input[type="text"]` (onboarding, settings) — separate style, no explicit font

**Fix:** Consolidate to one input class (`.form-input`) used everywhere. Ensure it explicitly sets `font-family: 'JetBrains Mono', monospace` so the font doesn't break if inheritance changes. Remove `.auth-input` and `.field input` as separate styles.

### F. Button Inconsistency
Two primary button styles:
1. `.auth-btn` — full-width, accent bg, 13px uppercase
2. `.text-seller-btn` — nearly identical but separate class

**Fix:** One primary button class. `.btn-primary` — full-width, accent bg, white text, 13px/600/uppercase, 16px padding, 6px radius. Remove `.auth-btn` and `.text-seller-btn` as separate classes. Use the one class everywhere.

---

## Implementation Order

### The Goal
Make every screen look like it was designed by the same person on the same day with the same rules. The app was built incrementally — each screen roughed in to ship the feature. The visual consistency was never enforced. This redesign applies a single design system uniformly so the whole thing feels like one coherent product.

**At every step, every screen is measured against:**
1. **Grid:** Content aligns to `--side: 24px` edges. Max-widths respected. Full-bleed vs constrained is intentional per page type.
2. **Spacing rhythm:** Vertical gaps follow the scale (4/8/12/16/20/24/32/48/64). No arbitrary values. No inline margin hacks.
3. **Typography:** Every font size is on the scale (10/11/12/13/14/15/20/24). Every weight has a purpose (400 body, 500 emphasis, 600 labels/buttons, 700 headings/prices). JetBrains Mono only.
4. **Components:** Every button, input, pill, toggle, card uses its canonical class. Zero one-offs. Zero inline styles.
5. **Color:** Every color use is semantic. Green = success/live. Red = error/destructive. Blue = interactive. Amber = hold. Everything else = text/muted/dim.
6. **Hierarchy:** Each screen has exactly one primary focal point (biggest/boldest). Supporting elements are clearly subordinate. Nothing competes for attention.
7. **Interaction:** Every tappable thing has hover/active feedback. Touch targets ≥44px. Transitions follow the timing system (0.15s/0.2s/0.3s).

This is not a checklist of bug fixes. It's enforcing a coherent system.

---

### Phase 1: CSS Foundation — Component Classes
Build the complete class library FIRST, before touching any screen. No screen work until every component has a proper class.

1. Fix DESIGN.md (remove system font references) ✓ done
2. Write all new CSS classes for the consolidated component system:
   - `.btn-primary`, `.btn-primary.btn-dark`, `.btn-primary.btn-compact`, `.btn-primary.btn-muted`
   - `.btn-secondary`, `.btn-secondary.danger`
   - `.btn-chip`, `.btn-chip.active`
   - `.btn-danger` (logout)
   - `.form-input` (consolidated — delete `.auth-input` and `.field input` rules)
   - `.form-select` (add dropdown arrow)
   - `.form-label` (consolidated — delete `.field label` and `.sheet-label`)
   - `.status-pill`, `.status-pill.live/hold/sold`, `.status-banner`
   - `.back-link` (standard in-app back navigation)
   - `.error-text`, `.list-error`
   - `.empty-state-icon`
3. Write all new CSS classes for layout patterns used in JS:
   - Conversation: `.conv-header`, `.conv-header-thumb`, `.conv-header-info`, `.conv-header-price`, `.conv-header-name`, `.conv-header-phone`, `.conv-header-avatar-sm/lg`, `.conv-payment`, `.conv-no-messages`, `.msg-row`, `.msg-row.sent/received`, `.msg-bubble`, `.msg-bubble.sent/received`, `.msg-avatar`, `.conv-reply-bar`, `.conv-reply-input`
   - Messages list: `.conv-avatar`, `.conv-avatar-placeholder`, `.conv-name-row`, `.conv-price-line`
   - Market teaser: `.teaser-content`, `.teaser-header`, `.teaser-title`, `.teaser-date`, `.teaser-countdown`, `.teaser-countdown.live`, `.teaser-stats`, `.teaser-stat-value`, `.teaser-stat-label`, `.teaser-preview-grid`, `.teaser-preview-cell`
   - Booth: `.booth-number`, `.booth-event-name`, `.booth-stats`, `.booth-stat`, `.booth-stat-value`, `.booth-stat-label`, `.booth-number-display`, `.booth-number-edit`, `.booth-input`
   - Feed header: `.feed-header-left`, `.feed-header-right`, `.feed-item-count`, `.feed-filter-btn`, `.feed-market-link`
   - Compose: `.compose-header`, `.compose-options`, `.compose-input-area`, `.compose-textarea`, `.compose-sent`
   - Detail: `.detail-title`, `.detail-loading`, `.detail-empty`, `.detail-ownership`
4. Write all new CSS classes for admin:
   - `.admin-loading`, `.admin-error`, `.admin-empty`
   - `.admin-login-container`, `.admin-login-logo`, `.admin-login-label`, `.admin-login-input`, `.admin-login-btn`, `.admin-login-error`
   - `.admin-header`, `.admin-header-links`, `.admin-link`, `.admin-link--muted`
   - `.admin-detail-title`, `.admin-detail-meta`, `.admin-detail-link`
   - `.admin-row-card`, `.admin-row-card-info`, `.admin-row-card-meta`
   - `.admin-btn-row`, `.admin-section-header`, `.admin-search-input`
   - `.admin-badge--test`, `.admin-card--dimmed`, `.admin-archived-toggle`, `.admin-archived-section`
   - `.admin-photo-strip`, `.admin-photo-thumb`, `.admin-item-price`, `.admin-item-info-row`, `.admin-item-notes`, `.admin-item-stats`, `.admin-conversation-row`
   - `.blast-history-item`, `.blast-history-meta`, `.blast-history-body`
5. Fix semantic color violations (green → muted/blue where noted)

### Phase 2: Inline Style Purge
With all classes defined, replace every `style=""` attribute in the codebase.

6. Purge static HTML inline styles (26 instances across onboarding, feed, booth, teaser, add-item, settings, admin login, admin header, bottom nav)
7. Purge JS template literal inline styles — conversation view (18 instances)
8. Purge JS template literal inline styles — messages list (8 instances)
9. Purge JS template literal inline styles — market teaser (12 instances)
10. Purge JS template literal inline styles — dealer home/booth (8 instances)
11. Purge JS template literal inline styles — item detail + compose (12 instances)
12. Purge JS template literal inline styles — feed/favorites (4 instances)
13. Purge JS template literal inline styles — admin screens (79 instances)
14. **Verify: grep for `style="` in index.html — must return ZERO results.**

### Phase 3: Navigation & Structure
15. Rename "Browse" → "Shop" in bottom nav
16. Rename "Settings" → "Account" in header (match nav label)
17. Add "Saved" tab to buyer nav (Shop · Saved · Messages · Account)
18. Fix back-navigation pattern (SVG chevron for in-app, gradient overlay for photo-first)
19. Show bottom nav during conversations

### Phase 4: Screen-by-Screen Fixes (in user-flow order)
20. Buyer landing: fix countdown fallback, market tap affordance
21. Dealer landing: fix free badge color, add logo, adjust spacing
22. Onboarding: enlarge selfie circle, remove redundant link, add context, shorten copy
23. Feed: shrink logo to 16px, simplify header, remove redundant Saved toggle, add loading/empty states, change snap to proximity
24. Item detail: reorder price/title, style price posture as pill, fix separator, enlarge carousel dots
25. Message compose: style option buttons as `.btn-chip` with active state
26. Conversation view: structured sticky header, fixed reply bar, message timestamps, max-width constraint
27. Messages list: composite thumbnail (item + avatar overlay), add unread indicator (bold name + blue dot)
28. Favorites: add empty state, add heart buttons to grid cards
29. Dealer home: add countdown, per-market setup card (booth + payment confirmation), enlarge action buttons, add market picker
30. Add item form: photo label + 5 slots, required indicators, fix market dropdown truncation
31. Settings/Account: remove double title, add avatar, show phone, conditional payment fields, auto-save on blur
32. Admin: fix seg-ctrl scroll indicator, fix countdown color, shorten timestamps, add section labels

### Phase 5: States & Polish
33. Add loading spinner to all async-loading screens (feed, messages, dealer home, favorites, conversation, admin)
34. Add empty states to all screens (favorites, feed, admin lists)
35. Standardize error display (inline `.error-text`, never alert())
36. Shorten all copy per text minimization list
37. Final cross-screen consistency pass (spacing rhythm, font sizes on scale, colors semantic)
38. Test on 375px, 390px, 428px viewport widths (iPhone SE, 14, 14 Pro Max)
39. **Final verify: zero inline styles, zero off-scale font sizes, zero wrong-semantic colors**

---

## What This Plan Does NOT Cover
- Backend/API changes (this is purely front-end)
- New features (no new functionality, only improving what exists)
- Desktop breakpoint polish (mobile-first; desktop inherits)
- Full admin CMS redesign (admin gets the class extraction + color/component fixes but not a layout rethink)

---

## Decisions — RESOLVED

All decisions approved by user on April 7, 2026:

1. **Keep All/Saved toggle in feed header. Do NOT add Saved tab to bottom nav.** "Saved" is a filter on the feed, not a destination. Adding it to nav would confuse dealers (buying concept in a dual-role nav). Bottom nav stays: buyers = Shop · Messages · Account (3 tabs), dealers = Shop · Booth · Messages · Account (4 tabs).
2. **Booth number is per-market, NOT profile info.** When a dealer opens their booth for a new market, show an inline setup confirmation card at top of dealer home: booth location (pre-filled from last instance of same market series) + payment prefs (pre-filled from profile). Confirm to dismiss. Editable later via tappable "Booth: E25" in header.
3. **Auto-save settings on blur** with subtle "Saved" toast. No manual save button.
4. **Reply input fixed at bottom** of conversation view, like a real chat app.
5. **Admin is desktop-first.** Prioritize functionality over design polish. Horizontal scroll on seg-ctrl is fine, no fancy indicators needed. Don't waste time on mobile admin layout.
6. **Messages list: composite thumbnail.** Item thumbnail (52px square) with avatar (24px circle) overlapping bottom-right corner, 2px white border on avatar. One visual unit instead of two competing images.
