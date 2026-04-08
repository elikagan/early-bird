# Early Bird — Product Roadmap

## What This Document Is
This is the source of truth for what Early Bird needs to become. It captures architecture decisions, feature specs, and design feedback from a thorough QA review (April 2026). These changes have NOT been implemented — multiple attempts to implement them failed due to lack of discipline and verification. They will be implemented using the EDS (Eli Design Studio) tool once it's built.

## Current State: v0.5.1
The app is functional but visually inconsistent and missing key features. See `HANDOFF.md` for technical details of what exists.

---

## Architecture Decisions (User-Approved)

### 1. Kill the Messages Tab
The standalone Messages tab is being eliminated. Communication moves to item detail pages. This is the most significant architecture change.

**Rationale:** Messages disconnected from context. A dealer with 30 conversations across 10 items had no way to manage them. Buyers had to leave the item they were looking at to check messages. The inbox was a sloppy flat list that would become unusable at scale.

**What replaces it:** Every item detail page becomes a communication hub. When a buyer sends a message about an item, the item detail page transforms — the item info compresses to a compact header, and the conversation becomes the main content. For dealers viewing their own items, all buyer inquiries appear as threaded conversations on that item's page.

### 2. Watching Tab (Replaces Messages + Favorites)
A new tab called "Watching" replaces both the Messages tab and the Favorites/Saved feature. It shows every item you have a relationship with — either favorited or messaged about.

**What it shows:**
- Item thumbnail, price, dealer name, status (live/held/sold)
- Heart icon = favorited only. Chat bubble = has a conversation.
- PRICE DROP badge when dealer lowers price (see #4 below)
- Sorted by most recent activity (new message or price change)
- Tap any item → opens item detail (with conversation if one exists)

### 3. Bottom Nav: Buy · Watching | Sell | Account
The nav tabs are renamed and restructured:
- **Buy** — browse items from other dealers
- **Watching** — items you've favorited or inquired about
- **Sell** — dealer's booth (hidden for buyer-only users)
- **Account** — settings

Buy and Watching are visually grouped with a subtle divider separating them from Sell and Account. This communicates that Watching is part of the buying experience.

**The buyer/dealer distinction:** Buyers are ONLY buyers. Dealers are buyers AND sellers. A buyer sees: `[ Buy · Watching | Account ]`. A dealer sees: `[ Buy · Watching | Sell | Account ]`.

### 4. Price Drop Notifications (Major Feature)
When a dealer lowers the price of an item, they're prompted: "Notify X watchers of this price drop?" If confirmed, an SMS goes to everyone who favorited or inquired about that item.

**Why this is huge:** One of the biggest challenges at a flea market is when to lower prices as the day ends. Being able to signal to interested buyers that the price dropped creates a marketplace flywheel: browse → favorite → price drop → convert.

**Flow:**
1. Dealer edits price downward on their item
2. Prompt: "Notify X watchers of this price drop?" with preview
3. If confirmed: SMS to all who favorited OR inquired
4. SMS: "Price drop! [Item] now $X (was $Y) — [link]"
5. In Watching tab: item shows PRICE DROP badge

### 5. Item Detail Page States
The item detail page transforms based on the viewer's relationship to the item:

**State 1 — Browsing (no relationship):**
Full item detail: photos (large), price, title, dealer info, compose buttons ("I'll take it" / "Make an offer" / "Ask a question")

**State 2 — Active conversation (buyer sent a message):**
Item info compresses to a compact card header (thumbnail + price + status + dealer name). The conversation thread becomes the main content. Expandable chevron to see full item details. Reply input at bottom (iMessage-style auto-expand).

**State 3 — Dealer viewing own item (no inquiries):**
Item info + edit button. Status controls (live/hold/sold). Market context ("Listed in Downtown Modernism · Apr 26"). No compose area.

**State 4 — Dealer viewing own item (has inquiries):**
Item info compresses to compact header. Inquiry threads from multiple buyers shown below — each buyer is a collapsible accordion section with their messages. Reply input per buyer thread.

When a dealer taps Hold or Sold, the system asks WHICH BUYER to hold/sell to — directly connecting the communication to the action.

### 6. Dealer Inquiry Threading
On the dealer's item detail page (State 4), inquiries are organized by buyer:

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
│ "Is this still available?"  │
│                    [Reply]   │
│                              │
│ ── Jane Smith         1d    │
│ "Would you take $120?"      │
│                    [Reply]   │
├─────────────────────────────┤
│ [LIVE]  [HOLD ▾]  [SOLD ▾]  │
└─────────────────────────────┘
```

Green dot = unread. Tap Reply → expands inline (accordion). Only one thread expanded at a time. Hold/Sold buttons ask which buyer.

---

## QA Feedback (Not Yet Implemented)
See `QA-NOTES.md` for the complete screen-by-screen review. Key themes:

### Global Issues
- **6 different header implementations** — need one consistent header component
- **Text too light** — `--muted: #666` and `--dim: #AAA` are illegible on many screens
- **Nav labels wrong** — still says Shop/Booth/Messages/Account

### Per-Screen Issues (Summary)
- **Landing (buyer):** Remove chevrons on markets. Countdown right-aligned. Needs logged-in state.
- **Landing (dealer):** Needs EB logo in header. "Evening before the show" copy.
- **Onboarding:** Left-align. Square avatar not circle. "Get set up to pre-buy." Needs structure.
- **Feed:** Bigger dealer avatar. Contact button on every item. Photo gap at bottom of container.
- **Item detail:** Status inline with price. Missing dealer avatar. Missing nav.
- **Booth (fresh):** Payment setup inline. Disabled button until filled. Countdown to drop with seconds.
- **Booth (active):** Items in cards with bg. Top-aligned price. "Market is live" after drop.
- **Add item:** Remove condition. Remove price posture → "Price Firm" toggle. Pin post button. Market context.
- **Conversation:** iMessage auto-expand input. Larger dealer info. Consistent back button.
- **Messages:** Being replaced by Watching tab (see Architecture Decision #2).

---

## Technical Debt
- All styling is in a single `<style>` block in index.html (~2000 lines of CSS mixed with HTML and JS)
- No external design system CSS file — components are defined as classes but not enforced
- Multiple attempts to create a consistent design system have failed (see Development History below)

---

## Development History
This app has been through 5 failed design system implementation attempts:

1. **Attempt 1:** "Rebuild entire design system" — actually just unified some toggles and CSS variables
2. **Attempt 2:** 39-step plan — claimed 100% complete at ~35% actual completion
3. **Attempt 3:** PLAN-v2 "corrective" plan — same pattern, claimed done, wasn't
4. **Attempt 4:** Component library + screen templates — partially built, not verified
5. **Attempt 5:** Rushed v0.6.0 with Watching tab, inline chat, price drop — reverted due to quality

The root cause: Claude Code loses discipline in long sessions, batches too many changes, and claims completion without verification. This is a documented issue (GitHub #6159, #22140).

**Solution:** The EDS (Eli Design Studio) tool is being built to enforce design system compliance through a structured, ticket-based workflow. See the EDS repository for details.

---

## API Changes Needed (for roadmap features)
- `GET /api/watching` — items user has favorited OR has conversations about
- `GET /api/items/:id` — add `my_conversation` field when authenticated
- `PATCH /api/items/:id` — detect price drops, support `notify_watchers` flag
- `previous_price` column on items table (already exists in DB)
- `market_booths` table (already exists in DB)
- `qa_notes` table (already exists in DB)

## Test Users (for development)
| Role | Name | Phone | ID |
|------|------|-------|----|
| Fresh buyer | (no name) | +15555550001 | `99db7c21-d996-4ef0-8024-e4b2f67849bc` |
| Active buyer | Loubna Maher | +12138420721 | `9cc49ca0-1235-43aa-bbcb-93a0742b9aea` |
| Active buyer 2 | Marco Rivera | +13234638274 | `5a021f0e-4b9b-40bb-9786-595629acfb0a` |
| Fresh dealer | Sarah Chen | +15555550003 | `fc1df7fa-2247-4d7a-94dd-9a84d1abd8b1` |
| Active dealer | Eli | +13104985138 | `8935f2ac-4998-4e6d-9c31-47dbbce896fd` |
