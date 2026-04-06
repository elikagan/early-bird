# Early Bird — Functional Specification

## What This Is
Pre-market marketplace where flea market dealers post what they're bringing so buyers can BUY items before the general public gets access. LA flea market scene (Downtown Modernism, Rose Bowl, Long Beach, etc.)

## Product Tone
- Insider access. Like finding out about something good through word of mouth.
- Not a startup, not a gallery. Not democratic ("everyone gets access"). Exclusive ("you get first crack").
- SMS-native. Phone number auth. Magic links, no OTP codes.

## Architecture
- Single-file HTML app (`index.html`) — all CSS, HTML, JS in one file
- API: Cloudflare Worker at `https://early-bird.objectlesson.workers.dev`
- Backend: Supabase (Postgres)
- Mobile-first, responsive desktop
- GitHub Pages hosting at earlybird.la

## Screens

### 1. Buyer Landing Page (`#landing`)
**Purpose:** Get phone number, explain the product, build urgency.

**Content (above fold):**
- Logo: "EARLY BIRD" (stacked wordmark, no icon)
- "I'm a dealer" link (top right, navigates to dealer landing)
- Event context: "Early access to the best stuff at"
- Event name + date: e.g. "DOWNTOWN MODERNISM 4.26" (pulled from API)
- Countdown: "Inventory drops in" → days : hrs : min (live updating, counts to drop_time)
- Phone input (tel, formatted as (310) 555-1234)
- CTA button: "REGISTER FOR EARLY ACCESS"
- Fine print: "We'll text you when inventory goes live."

**Content (below fold):**
- Hero image (admin-curated, hidden until set)
- How It Works (3 steps):
  1. Register with your phone number. We'll text you a link when inventory drops before each market.
  2. Shop before the gates open. See what dealers are bringing — photos, prices, details — and buy the pieces you want before anyone else can.
  3. Pick up at the market. Pay the dealer directly and grab your item at their booth. It's already yours.
- FAQ (5 items): What is Early Bird? / Is this free? / How do I pay? / Is this affiliated with the markets? / What markets are listed?
- Disclaimer: "Early Bird is not affiliated with or endorsed by any market listed here. All listings are posted by independent dealers."

**Behavior:**
- On load: calls `/api/markets`, finds first non-test market, populates event name + date + countdown
- Phone input auto-formats as user types
- Submit: POST `/api/auth/request` with phone → shows spinner → success ("Check your texts for a link") or error
- If user already has `eb_dealer_id` in localStorage, auto-redirects to app

### 2. Dealer Landing Page (`#dealer-landing`)
**Purpose:** Get dealers to sign up. Separate value prop from buyer page.

**Content:**
- "← Back" link
- Headline: "SELL TO SERIOUS BUYERS / BEFORE THE GATES OPEN"
- Sub: "Post what you're bringing to the market. Buyers buy it before the crowd shows up. You show up with sales already made."
- Badge: "100% FREE FOR DEALERS"
- Phone input + "GET STARTED" button
- How It Works (3 dealer-specific steps)
- FAQ for Dealers (5 items)
- Disclaimer

**Behavior:** Same auth flow as buyer, different copy.

### 3. Verify Screen (`#verify`)
**Purpose:** Magic link destination. Verifies token, creates session.

**Content:** Logo + "Verifying..." status

**Behavior:**
- URL: `#/verify/{token}`
- Calls `/api/auth/verify/{token}`
- On success: stores dealer_id, checks if name is set → onboarding or app
- On failure: shows error

### 4. Onboarding Screen (`#onboarding`)
**Purpose:** Collect name + optional selfie after first auth.

**Content:**
- "ALMOST THERE" title
- Selfie upload (circular preview, camera capture)
- Name field
- "LET'S GO" button

**Behavior:**
- PATCH `/api/auth/me` with name
- Then enters app

### 5. Feed Screen (`#feed`)
**Purpose:** Browse items posted by dealers for the current market.

**Content:**
- Sticky header: "EARLY BIRD" logo + market name
- 2-column image grid (1:1 aspect ratio thumbnails)
- Each card: photo, price (bold, tabular nums), dealer name, firm badge, hold/sold status
- Empty state: "NOTHING YET — Dealers are still posting their inventory."

**Behavior:**
- Calls `/api/items?market_id={id}`
- Bottom nav visible (Browse / Messages / My Items)

### 6. Dealer Home (`#dealer-home`)
**Purpose:** Dealer's booth management.

**Content:**
- Market name + date + countdown
- Free notice: "Selling on Early Bird is 100% free."
- "+ ADD ITEM" button (full width)
- My items list (thumbnail + price + status)
- Empty state: "YOUR BOOTH IS EMPTY"

### 7. Messages (`#messages`)
**Purpose:** Buyer-dealer communication.
**Content:** Title + empty state (placeholder, not yet built)

## Navigation
- Bottom nav (3 tabs): Browse, Messages, My Items
- Only visible after auth
- Tab switching calls showScreen() + loads data

## API Endpoints Used
- `GET /api/markets` — list markets
- `POST /api/auth/request` — request magic link (body: { phone })
- `GET /api/auth/verify/{token}` — verify magic link
- `GET /api/auth/me` — current user info
- `PATCH /api/auth/me` — update user (body: { name })
- `GET /api/items?market_id={id}` — list items for a market

## Data Model (as reflected in UI)
- **Market:** id, name, market_date, drop_time
- **Dealer/User:** dealer_id (stored in localStorage as `eb_dealer_id`), name, business_name
- **Item:** id, price (cents), photos[], status (active/hold/sold), firm (boolean), dealer (nested)

## Design Constraints
- No icon/mascot for the logo. "Early Bird" is text only.
- Mono/tabular-nums font for prices and phone numbers only, never for descriptive text
- Single accent color — when it appears, it means something
- Mobile-first, 540px max-width on mobile, responsive desktop layout at 768px+
- Desktop: white card on warm gray background, two-column grid for hero area and info sections
- CTA + phone input must be above the fold on mobile
- SMS is the communication channel, not in-app chat
- Magic links only, no OTP codes
- Disclaimer required on both landing pages (legal protection from market organizers)
