# Early Bird — Plan v3: Component Rebuild + New Information Architecture

## What Changed

QA review revealed the app needs more than a CSS cleanup. The core information architecture is wrong:
- Messages tab is a sloppy inbox nobody will use
- Communication is disconnected from the items it's about
- Dealers have no tool for the most important moment: when to drop prices
- Nav labels confuse dealers who are also buyers

## New Architecture

### Nav Tabs
- **Buy** — browse items from other dealers
- **Watching** — items you've favorited or inquired about (replaces Messages + Favorites)
- **Sell** — dealer's booth (hidden for buyer-only users)
- **Account** — settings

Buy and Watching are visually grouped as "the buying side" with a subtle divider separating them from Sell and Account. For buyers (no Sell tab): `[ Buy · Watching | Account ]`. For dealers: `[ Buy · Watching | Sell | Account ]`.

### Item Detail: The Core Screen
The item detail page is now the hub for ALL communication about an item. It transforms based on state:

**State 1: Browsing (no relationship)**
Full item detail: photos (large), price, title, dealer info, compose buttons ("I'll take it" / "Make an offer" / "Ask a question")

**State 2: Active conversation (buyer sent a message)**
Item info compresses to a compact card header (thumbnail + price + status + dealer name). Conversation thread becomes the main content. Expandable chevron to see full item details. Reply input at bottom (iMessage-style auto-expand).

**State 3: Dealer viewing own item (no inquiries)**
Item info + edit button. Status controls (live/hold/sold). Market context.

**State 4: Dealer viewing own item (has inquiries)**
Item info compresses to compact header. Inquiry threads from multiple buyers shown below. Each buyer is a collapsible section with their messages. Reply input per buyer.

### Price Drop Feature
1. Dealer edits price downward on their item
2. Prompt: "Notify X watchers of this price drop?" with preview
3. If confirmed: SMS to all who favorited OR inquired
4. SMS: "Price drop! [Item] now $X (was $Y) — [link]"
5. In Watching tab: item shows PRICE DROP badge
6. Creates marketplace flywheel: browse → favorite → price drop → convert

### Watching Tab
Replaces both Favorites and Messages. Shows every item you have a relationship with:
- Items you favorited (heart icon indicator)
- Items you inquired about (chat bubble indicator)
- Each row shows: item photo, price, dealer, status (live/held/sold), PRICE DROP badge if applicable
- Tap any item → goes to item detail with conversation visible

---

## Implementation Plan

### Phase 0: Component System (fix the foundation first)

Before ANY screen work, build the components that every screen needs. These are not CSS classes — they're actual reusable patterns with defined HTML structure, CSS, and behavior.

#### 0.1 Header Component
One header used on EVERY screen:
```
.app-header
  .app-header-row1: [logo or back-link left] [action right]
  .app-header-row2: [filters/toggles] (optional)
```
- Pre-auth screens: EARLY BIRD_ logo, right-side action varies
- Tab screens: EARLY BIRD_ logo (Buy tab) or "Sell" / "Watching" / "Account" title
- Detail screens: ← Back link + context
- Same height, same padding, same position on every screen

#### 0.2 Text Contrast Fix
Global change — `--muted` is too light. Every "light gray" complaint traces to this:
- `--muted: #666` → `--muted: #555` (or test values)
- `--dim: #AAA` → `--dim: #888`
- Test on every screen after change

#### 0.3 Nav Component
Bottom nav with role-aware labels:
- Buyer: Buy / Watching / Account (3 tabs)
- Dealer: Buy / Sell / Watching / Account (4 tabs)
- "Watching" replaces both "Messages" and "Saved"

#### 0.4 Item Card Component (Feed)
- Bigger dealer avatar (32px → 44px?)
- Contact button overlay (bottom-right, opens drawer with SMS/call options)
- Photo fills container edge-to-edge (no gap at bottom)
- Price + status pill on same row

#### 0.5 Item Row Component (Booth list, Watching list)
- Thumbnail + price + title + status pill
- Top-aligned price with thumbnail
- Card with background (not floating)
- Inquiry count badge
- PRICE DROP badge (for Watching)

#### 0.6 Conversation Component
- iMessage-style auto-expanding textarea (1 line → grows to 4 max)
- Darker divider above input (1px → 2px, #ddd not #f0efec)
- Consistent back link
- Compact item header (thumbnail + price + name, one row)

#### 0.7 Disabled Button Pattern
- `.btn-primary:disabled` — gray, no pointer, clear visual difference from active
- Used on: booth setup (until required fields filled), add item (until photo + price), compose (until message typed)

---

### Phase 1: Nav + Header (structural)

1.1 Rename nav tabs: Buy / Sell / Watching / Account
1.2 Hide Sell tab for buyer-only users
1.3 Replace "Watching" icon (was messages bubble → use eye or bookmark icon?)
1.4 Build the header component and apply to every screen
1.5 Verify: screenshot all screens, every header consistent

---

### Phase 2: Item Detail Transformation

This is the biggest change — item detail becomes state-aware.

2.1 **Browsing state** (no conversation)
- Keep current layout but fix: dealer avatar visible, held/sold marker inline with price, nav visible
- Remove condition display, simplify posture to "Price Firm" toggle indicator

2.2 **Conversation state** (buyer has sent a message)
- Item info compresses to compact card (thumbnail 48px + price + status + dealer name, single row)
- Expandable: tap compact card to show full item details
- Conversation thread fills the main area
- Reply input fixed at bottom, iMessage auto-expand
- Back link returns to Watching tab (not Messages)

2.3 **Seller view — no inquiries**
- Full item detail with edit button
- Status control buttons (Live / Hold / Sold)
- Market name context ("Listed in Downtown Modernism · Apr 26")
- No compose area (it's your own item)

2.4 **Seller view — has inquiries**
- Item info compresses to compact header
- Each buyer's inquiry is a section: buyer avatar + name + messages
- Reply input per buyer thread
- Status control still accessible

2.5 **Price drop flow**
- Edit price → if lower, prompt "Notify X watchers?"
- API: `POST /api/items/:id/price-drop` — updates price + sends SMS to watchers
- New table or column: track who's watching (already have favorites + conversations)

---

### Phase 3: Watching Tab (replaces Messages + Favorites)

3.1 New screen replacing the messages tab
3.2 Data source: `GET /api/watching` — returns all items user has favorited OR has a conversation about
3.3 Each row: item thumbnail, price (with strikethrough if price dropped), dealer name, status pill, indicator (heart or chat bubble), PRICE DROP badge
3.4 Tap → item detail in conversation state (if has messages) or browsing state (if just favorited)
3.5 Sort by most recent activity (new message or price change)

---

### Phase 4: Booth Rebuild (Sell tab)

4.1 **Setup card redesign**
- "Set up your booth for Downtown Modernism · Apr 26"
- Booth number input
- Payment method checkboxes inline: Venmo (with handle), Zelle (with handle), Cash only
- Button disabled until required fields filled
- "Skip for now" link
- Payment persists across markets

4.2 **Active booth**
- Items in cards with backgrounds (not floating)
- Each item shows inquiry count badge
- Countdown: counts to drop time, then switches to "Market is live · X buyers shopping"
- Market name prominent, tappable to open market picker
- Stats row: live / hold / sold counts
- Top-aligned price with thumbnail in item rows

4.3 **Market picker**
- "Switch event" not "Select market"
- Two dates: event date (part of name) + drop countdown
- Shows which markets you're registered for

4.4 **Add item**
- Remove condition field
- Remove market picker (context from current market)
- Show "Adding to Downtown Modernism · Apr 26" at top
- Replace price posture with simple "Price Firm" toggle (defaults off)
- Post button pinned to bottom, disabled until photo + price filled
- Plus button = last square in grid (bottom right)
- Best-in-class drag reorder for photos
- First photo = main photo indicator

---

### Phase 5: Landing + Onboarding + Pre-Auth

5.1 **Landing (buyer)**
- Remove chevrons on market rows
- Countdown right-aligned, no "drops in" prefix
- "Click Here" capitalization
- Logged-in version: replace auth section with relevant content for returning users

5.2 **Landing (dealer)**
- Add EB logo in header
- Copy: "items drop the evening before the show"

5.3 **Onboarding**
- Left-align everything
- Square rounded avatar, not circle
- "Get set up to pre-buy" not "Almost there"
- Better text contrast
- EB logo in header position

5.4 **Verify**
- Magic links don't expire (remove expiry or extend to 30 days)

---

### Phase 6: Conversation UX Polish

6.1 iMessage auto-expand textarea
6.2 Darker divider above reply input
6.3 Larger dealer info + avatar in conversation header
6.4 Consistent back link (← Back) on all detail screens
6.5 Consistent left padding (no random indentation)

---

### Phase 7: Feed Polish

7.1 Bigger dealer avatar on feed cards
7.2 Contact button drawer on each item (SMS / Call options)
7.3 Photo fills container (no gap)
7.4 Filter sheet: searchable dealer list (not plain dropdown for 100+ dealers)
7.5 Filter sheet opens taller

---

### Phase 8: QA Tool Fixes

8.1 Add screens for new architecture (Watching tab, transformed item detail states)
8.2 Fix broken screens (compose, booth-active, booth-picker)
8.3 Add admin QA screens
8.4 Ensure every screen loads correct state

---

### Phase 9: Deploy + Verify

9.1 Full screenshot pass on all 38+ screens
9.2 Deploy worker + push to Pages
9.3 Update VERSION to 0.6.0

---

## API Changes Needed

- `GET /api/watching` — items user has favorited OR has conversations about, with last message + price history
- `POST /api/items/:id/price-drop` — lower price + notify watchers
- `PATCH /api/items/:id` — add price history tracking (old_price field or price_history array)
- Update `GET /api/conversations` — may be deprecated for the UI, but keep for SMS reply flow

## Database Changes

- Add `price_history JSONB` column to items (or a `price_changes` table)
- Consider `watchers` view: UNION of favorites + conversation participants per item

## Files Modified
- `index.html` — everything (CSS components, HTML structure, JS logic)
- `worker/index.js` — new endpoints, price drop flow
- Supabase migration for price history
