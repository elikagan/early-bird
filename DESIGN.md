# Early Bird — Design & Product Spec

## What This Is
Pre-market marketplace where flea market dealers post what they're bringing so buyers can BUY items before the general public gets access. This digitizes something that already happens physically — people waking up at 4am with flashlights. That's the demand signal.

**Domain:** earlybird.la
**Markets:** Rose Bowl, Long Beach, Downtown Modernism, PCC Flea, Palm Springs Vintage Market
**Target launch:** April 26 Downtown Modernism (test event before that with 5-6 people for QA)

## Product Tone
- Insider access. Like finding out about something good through a text from someone who knows.
- NOT a startup, NOT a gallery. NOT democratic ("everyone gets access"). Exclusive ("you get first crack").
- DIY and craigslisty — not startup-y. The rawness IS the brand.
- We don't need to convince people to use this yet. The target first customers already get this.
- DO NOT announce future paid pricing. Seduction and anticipation, not transparency about monetization.

## Roles

### Dealers (invite-only, vetted by founder)
- Can post items AND buy. Dealer is a **permission level**, not a toggle.
- See a prominent **Shop / Sell** segmented control (iOS-style pill) to switch context.
- **Shop mode:** Full buyer experience — feed, favorites, messages.
- **Sell mode:** Seller tools — my items, add item, messages.
- **Messages tab is unified** — always visible in both modes. Never split into two inboxes.

### Buyers (open registration)
- Can browse, buy, save favorites, message dealers.
- Cannot post items. Cannot become a dealer without founder approval.
- Do NOT see the Shop/Sell toggle. Buyer-only experience.

### Bottom Nav (reconfigures by mode)
- **Buyer / Shop mode:** Shop · Saved · Messages
- **Sell mode:** My Items · Messages
- Messages tab is ALWAYS visible regardless of mode.

## Pricing
- **Buyers:** Free during launch. Future: paid (subscription or per-event ticket, like early bird flea market tickets). DO NOT promise "always free." DO NOT announce paid plans on the landing page.
- **Dealers:** Free. Likely stays free forever (supply side).

## Auth
- Phone number → magic link via SMS. **No OTP codes. No passwords. No accounts.** Magic links only.
- Buyers auto-register on first auth attempt.
- Dealers are invite-only (admin creates dealer record first).
- Magic link lands on `#/verify/{token}`, sets session, redirects to onboarding or app.

## Onboarding
- **Selfie required** — persists forever, don't ask again. Buyer faces must be visible on inquiries.
- Confirm display name.
- Dealers: add first item.
- Buyers: subscribe to specific markets (not all buyers do all markets).

---

## Design System: "The Text Message"

### Typography
- **One font:** JetBrains Mono — everything. Headlines, body, buttons, labels, prices.
- Hierarchy through size and weight only, not font changes.
- Scale: Logo 20px/700, Market names 24px/700, Section titles 11px/600 uppercase 0.15em, Body 13px/400, Labels 11px, CTA 13px/600 uppercase 0.15em
- Prices: Weight 700, font-variant-numeric: tabular-nums

### Color
- Background: `#FAFAF8`
- Text: `#1A1A1A` / Muted: `#888888` / Dim: `#CCCCCC`
- Input bg: `#F0EFEC`
- Accent: `#0066FF` (like a link in a text message)
- Error: `#D32F2F` / Success: `#2E7D32` / Hold/Pending: `#B8960C`

### Spacing
- Spacing is the ONLY structural element. No borders, no dividers, no rules.
- Between items: 32px. Between groups: 48px. Between zones: 64px. Screen padding: 24px.

### Layout
- Single column, mobile-first. Max 480px on mobile.
- Border radius: 6px on inputs/buttons.
- Desktop 768+: White card on #F0F0EC, max 720-900px, two-column grid for hero/info.

### Logo
- "EARLY BIRD_" — one line, JetBrains Mono 700, 20px. Underscore blinks like a cursor (1s step-end infinite).
- No icon. No mascot. No stacked wordmark.

### Motion
- Minimal-functional. Blinking cursor is the only animation. Countdown is live-updating text, no transition effects.

---

## Screens

### 1. Buyer Landing Page
- **"Dealer? Click here"** link — top right, small, plain text. NOT "I'm a dealer."
- Multiple upcoming markets listed (not just one). Each: name + date (M.DD) + countdown ("drops in Xd Xh Xm").
- CTA + phone input above the fold on mobile.
- Below fold: How it works (3 steps), FAQ, disclaimer.
- Disclaimer required: "Early Bird is not affiliated with or endorsed by any market listed here."
- Framing: "See what top dealers are bringing to [Market]" — NOT advertising the market itself.

### 2. Dealer Landing Page
- Separate value prop. "Selling is 100% free for dealers."
- Same auth flow, different copy.

### 3. Feed (Shop Mode)
- **Mobile:** TikTok-style vertical scroll. One item fills the screen. Scroll-snap. Single column.
- **Desktop 768+:** Two-column grid.
- Each card: full-bleed photo, price overlay, dealer name, firm/offers badge, sold/hold status.
- Instagram-style carousel for multiple photos (swipe left/right within an item).
- **Sold items show buyer name + face** (buyer can opt out via `show_name_on_sold`).

### 4. Item Detail
- Photo(s), price, firm/offers, condition, notes, dealer name + business name.
- **Primary CTA: "I want this"** — opens message compose flow.

### 5. Message Compose (on item detail)
**This is the core interaction. Get it right.**

When buyer taps "I want this":
- Three boilerplate options appear: **Buy** / **Make an offer** / **Ask a question**
- "Buy" is pre-selected. Textarea is prepopulated with: `I want to buy [item title] for $[price]`
- "Make an offer" prepopulates: `I'd like to make an offer on [item title]`
- "Ask a question" prepopulates: `I have a question about [item title]`
- Buyer can modify the text. It's clearly understood as editable.
- Send button submits the message.
- **NEVER use "Is this still available?" — that phrase is the opposite of what this product does.**

### 6. Conversation View
- Item thumbnail + price at top for context.
- Other party's name + **phone number** (clickable tel: link). Show both parties' numbers.
- Seller's payment info (Venmo/Zelle) visible to buyer.
- Chat bubbles: blue (sent) / gray (received).
- Reply input at bottom.
- **Default pickup:** Buyer picks up from seller's booth at the market. Clearly communicated but allow alternate arrangements.

### 7. Messages List
- Unified inbox — all conversations regardless of Shop/Sell mode.
- Shows: item thumbnail, other party name, last message preview, timestamp.
- Both "as buyer" and "as seller" conversations in one list, sorted by recency.

### 8. Favorites (Saved)
- Items the buyer has hearted/saved.
- Heart toggle on item cards in the feed.
- Separate "Saved" tab in bottom nav (Shop mode only).

### 9. Dealer Home (Sell Mode → My Items)
- Market name + date + countdown.
- "Selling on Early Bird is 100% free."
- "+ ADD ITEM" button.
- List of dealer's items: thumbnail + price + status badge.
- Empty state when no items posted.

### 10. Add Item
- **Required:** Photos (1 min, 5 max) and price. That's it.
- **Optional:** Title, notes, condition (mint/good/fair/as-is), price posture (firm/flexible/make me an offer).
- Photo order matters — drag to reorder, first = primary.
- Prompt dealers to include condition-type photos.
- Market selector (which event is this for).
- Client-side image compression: 1200px max, q82 JPEG, thumbnails 400px.

---

## Messaging System

### Flow
1. Buyer taps "I want this" → compose view with prepopulated boilerplate → sends message.
2. Worker creates conversation + message record → sends SMS to seller.
3. **SMS to seller includes:** buyer name, message text, buyer's phone number, and a reply link.
4. Seller taps reply link → **no login required** (link contains conversation token that authenticates).
5. Seller sees item + all inquiries from different buyers (with buyer faces/photos visible). Seller chooses who gets the item.
6. Seller replies via web → SMS notification sent to buyer with seller's reply + link back.
7. **Phone numbers visible to both parties** — they shouldn't feel trapped by our communication system.

### SMS Format (to seller)
```
[Buyer Name] messaged you about your $[price] item on Early Bird:

"[message text]"
Buyer's number: [phone]

Reply: [link]
```

### Key Rules
- SMS is the notification channel. Conversations happen on the web page.
- Both parties have lots of conversations at once — this must be fast and clear.
- No in-app payments. Venmo/Zelle/cash preferred by dealers.
- No deposit handling through the app. Dealers handle deposits via SMS directly.

---

## Item States
- **Live** — available for purchase
- **Hold** — courtesy hold, dealer's choice (not mandatory)
- **Sold** — purchased, shows buyer name/face (opt-out available)
- Items are **tied to specific events** and disappear 1-2 days after the event ends. They do NOT roll over.

## Drop Model
- **Synchronized drops.** NOT trickle posting. Feed goes from empty → full at drop time.
- **Server-side redaction:** API does NOT return full photo URLs before drop_time. No client-side blur hack.
- **SMS blast schedule:** 1 week before (tease), 1 day before (tease), drop time (it's live).

## Dealer Details
- **Booth/space numbers** (e.g., E25) — usually the same each market, but confirmable per event.
- **Universal settings:** Payment methods (Venmo/Zelle/cash).

## Social / FOMO Features
- Named purchases with buyer faces visible on sold items (opt-out available).
- Visibility into: items held, items sold before market, who is buying.
- "These are the 90 people who matter" — invite-only, tightly curated.

## Admin Capabilities
- Approve buyers and sellers. If dealer is approved as seller, auto-approved as buyer.
- Proxy post on behalf of dealers (photos, price, etc.).
- Admin CMS to get ball rolling initially.
- SMS blast tool with audience targeting (buyers only, sellers only, all). Dealers who are also buyers get seller message only (no duplicates).
- Create events manually. Dealers subscribe to market series, auto-enroll in future events.
- View all conversations.
- Rate/flag transactions for accountability.

---

## Tech Stack
- **Frontend:** Single-file HTML app (index.html) — all CSS, HTML, JS
- **API:** Cloudflare Worker (`early-bird.objectlesson.workers.dev`)
- **Database:** Supabase Postgres (`hfvfmndjknxvhwrstkrg`)
- **SMS:** Telnyx (10DLC, single number +13105848456)
- **Hosting:** GitHub Pages at earlybird.la
- **Domain:** Porkbun
- **CDN:** Cloudflare for images (1-year edge cache)

## Database Schema (current)
- `dealers` — id, phone, name, business_name, role (buyer/dealer), venmo, zelle, photo_url, show_name_on_sold, booth_number, created_at
- `markets` — id, name, market_date, drop_time, created_at
- `items` — id, dealer_id, market_id, title, price (cents), condition, firm, price_posture (firm/flexible/make-offer), notes, category, status (live/hold/sold), buyer_id, photos[], created_at
- `auth_tokens` — id, dealer_id, token, expires_at, used, created_at
- `favorites` — id, dealer_id, item_id, UNIQUE(dealer_id, item_id)
- `conversations` — id, item_id, buyer_id, seller_id, token, active, created_at
- `messages` — id, conversation_id, sender_id, sender_phone, body, direction, created_at

## Explicit DO NOTs
1. No "Is this still available?" — ever, anywhere.
2. No OTP codes. Magic links only.
3. No announcing future paid access on landing page.
4. No "democratizing" language. This is for insiders.
5. No affiliation with flea markets (cease and desist risk).
6. No corny/chummy marketing copy.
7. No "Browse" as a label. It's Shop/Sell.
8. No split mailbox. Messages are unified.
9. No trickle posting. Synchronized drops only.
10. No deposit handling in-app.
11. No inventing features not requested.
12. No client-side blur for pre-drop items. Server-side redaction.
13. No Geist or Bebas Neue fonts.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | JetBrains Mono only | One font. Monospaced = insider/back-channel feel. |
| 2026-04-06 | Single accent color (#0066FF) | Like a link in a text. When it appears, it means something. |
| 2026-04-06 | No borders or dividers | Spacing does all structural work. |
| 2026-04-06 | Multi-market landing page | Shows breadth of what's coming. |
| 2026-04-06 | "The Text Message" aesthetic | Raw, monospaced, anti-design. The lack of polish IS the brand. |
| 2026-04-06 | Logo "EARLY BIRD_" with cursor | One line, blinking underscore. Terminal/text feel. |
| 2026-04-06 | Inline countdown text | "drops in 16d 22h 47m" — anti-urgency urgency. |
| 2026-04-06 | Buyers free now, paid later | Like an early entry ticket. Dealers stay free. |
| 2026-04-06 | Dealers are also buyers | Dealer is a permission level, not a role toggle. |
| 2026-04-06 | TikTok scroll mobile, grid desktop | One-item-at-a-time on mobile. Grid on desktop. |
| 2026-04-06 | Favorites for buyers | Save pieces. Separate Saved tab. |
| 2026-04-06 | Shop/Sell toggle for dealers | Prominent segmented control. Buyers don't see it. |
| 2026-04-06 | Unified Messages | One inbox, both modes. Never split. |
| 2026-04-06 | Buy-first messaging | Prepopulated "I want to buy [item] for $[price]". NOT "is this still available?" |
| 2026-04-06 | Show phone numbers both ways | Don't trap people in the communication system. |
| 2026-04-06 | Buyer faces on inquiries | Seller sees who wants it. Selfie captured at onboarding. |
| 2026-04-06 | Server-side drop redaction | API returns no photo URLs before drop_time. No client-side blur. |
| 2026-04-06 | Items tied to events, no rollover | Listings disappear 1-2 days post-event. |
| 2026-04-06 | "Dealer? Click here" link text | Not "I'm a dealer". Small, top right. |
| 2026-04-06 | No in-app payments | Venmo/Zelle/cash. Dealers handle deposits directly. |
