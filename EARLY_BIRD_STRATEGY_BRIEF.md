# Early Bird — Strategy Brief

Paste this into any LLM for a strategy conversation about this product.

---

## What It Is

Early Bird is a trade-only pre-market marketplace for antique/vintage flea market dealers in Los Angeles. Before flea markets open, dealers race around in the dark with flashlights trying to see what other dealers brought. Early Bird digitizes this: dealers post what they're bringing, other dealers browse and buy before market day. It's a pre-sale tool, not just a preview.

## The Founder

Eli Kagan runs Object Lesson, a vintage/art shop in Pasadena, CA. He is a dealer himself. He wakes up at 4am weekly to shop at LA flea markets (Rose Bowl, Long Beach, etc.). He buys from other dealers and resells through his shop and online. He has deep personal relationships with ~90 dealers in the LA market scene. He's also a product designer and has built a full e-commerce platform (objectlesson.la) using Cloudflare Workers + Supabase.

## The Problem

1. Dealers wake up at 4am, drive 45+ minutes to a market, and have no idea what's there until they arrive.
2. The "pre-opening rush" (dealers shopping from other dealers before the public arrives) is so valuable that market organizers sell early-access passes for $20-25.
3. Some dealers already post Instagram teasers before markets, but Instagram isn't built for this. No pricing, no holds, no structure.
4. Flea markets are declining. Foot traffic is less reliable. Dealers are leaving for antique malls. Guaranteed pre-market sales make the flea market proposition stronger.
5. Every trip is a gamble. You might drive 45 minutes and find nothing worth buying.

## The Insight

The sell-side value prop isn't just "sell before you set up your booth." It's "sell before you LOAD YOUR TRUCK." An antique dresser that's pre-sold is a dresser that doesn't need to be loaded, driven, unloaded, displayed, and potentially loaded back up unsold. The labor savings are the real hook.

## Demand Evidence

- **N=1 founder demand:** Eli would be "insanely interested" in seeing other dealers' inventory in advance.
- **Market-validated behavior:** Early-access passes ($20-25) already exist. The pre-opening rush is monetized.
- **Instagram teasers:** Some dealers already post previews. The behavior exists on the wrong platform.
- **Industry decline signal:** Dealers leaving flea markets for antique malls. Pre-market sales could reverse this.

## The #1 Risk

"I'm not really sure that dealers want a digital solution." Demand on the sell side is unproven. Many dealers are older and not tech-savvy. The founder is a buyer describing what he'd want as a buyer. Getting sellers to post is the whole game.

## Target Users

**No buyer/seller distinction.** Everyone is a "dealer." Most sellers are also buyers.

- **Posting dealers:** People who bring inventory to markets. They're the supply side.
- **Super buyers:** Higher-end resellers with shops, online sellers, people who buy from flea market dealers and resell at a markup. The most motivated buy-side users. These include the founder.
- **The narrowest wedge:** ~90 dealers, invite-only, curated from the founder's personal network. Scarcity creates value. "You have to be invited."

## Categories

Art, objects, furniture, decor, lighting. No clothing, jewelry, or ephemera.

## Design Principles

1. **DIY and Craigslisty.** Not polished, not startup-y. Raw, useful, built by a dealer for dealers. That's what gives it credibility in this community.
2. **Text is the transaction layer.** Dealers text. The app connects people and gets out of the way. All negotiation, deposits, and deals happen in iMessage.
3. **As much structure as the seller wants.** Deposits optional. Condition notes optional. The app adapts to the seller's comfort level.
4. **Super insidery.** This is a private channel for people in the trade. The language, design, and feel should all signal: you're in the club.
5. **Encourage condition honesty.** Antiques have condition issues. The app should nudge honest disclosure since buyers can't inspect digitally.
6. **FOMO is a feature, not a side effect.** Sold badges with buyer names, hold notifications, listing counts, "new" badges... all designed to make dealers feel like activity is happening without them.

## V1 Product

### Auth: Magic Links
Each dealer gets a unique permanent URL (e.g., `earlybird.com/d/abc123`). This IS their identity. Founder texts it once. They bookmark it. No password, no email login, no account creation. First visit: "What's your name?" + "Phone number?" + optional Venmo/Zelle info.

### Posting (Seller Side)
One item at a time. Repeat as needed.
1. 1-5 photos (client-side compressed)
2. Price
3. Optional notes (free text, e.g., "small chip on base")
4. Condition: Mint / Good / Fair / As-Is
5. Firm / Open to Offers
6. Deposit: None / Required (if required, enter amount)
7. Select market date
No titles, no categories required. The photos ARE the listing.

### Browsing (Buyer Side)
TikTok-style vertical scroll. One item fills the screen. Swipe up for next. Left/right swipe = photo carousel. Two buttons: Save (heart) and Text Seller (opens iMessage with pre-filled message). Filters by market date, by dealer, by category. "New" badges on items posted since last visit.

### Deal Flow
1. Buyer taps "Text Seller" → iMessage opens with pre-filled message
2. If seller requires deposit: app shows Venmo/Zelle instructions, then opens iMessage
3. Seller marks deposit received → item shows "Held for [buyer]"
4. Deal settles in person at market (cash/Venmo/Zelle)
5. App never processes payments

### Item Lifecycle
Three states: **Live** → **Hold** (deposit received) → **Sold** (seller marks it, buyer name displayed: "SOLD to Eli — Object Lesson")
Items auto-expire after market day. No re-posting, no inventory persistence. Every market is a fresh slate. Buyers can opt out of being named on sold items, but most won't... good scores are bragging rights.

### Posting Window & Drop Model
Posting opens ~4 days before a market, but the launch strategy uses synchronized drops. Founder coordinates a specific drop time (e.g., "Thursday 7pm for Rose Bowl"). Feed goes from empty to full in an hour, creating immediate perception of liquidity. After the initial drop, additional listings continue until market day.

### Accountability
No formal ratings at 90 people (social pressure handles flakers). Optional deposit system for high-value items. Future: transaction ratings, reputation scores when community grows beyond personal network.

### Admin CMS (Founder Only)
Create/manage market dates. Generate invite links. View activity. **Post on behalf of any dealer** (cold-start hack: founder photographs dealers' stuff at the market, posts it for them. They see inquiries come in. Now they're posting themselves next month).

## What V1 Does NOT Have
- No in-app payments
- No in-app messaging (text handles this)
- No ratings/reviews
- No search (browse + filters is enough at ~90 dealers)
- No push notifications
- No national expansion

## Constraints
- **Cash/Venmo/Zelle culture.** Dealers don't use Square. App doesn't touch money.
- **Tech-unsavvy sellers.** Many dealers are older. Dead simple or it won't get used.
- **One-of-a-kind inventory.** No SKUs, no reorders. Every item is unique.
- **Trade pricing tension.** Sellers may prefer holding items for retail markup. Pre-selling at trade price requires certainty + labor savings to outweigh potential premium.

## Revenue Model (Open)
Free until critical mass. Then what? Options: subscription (premium access, priority notifications for super buyers), featured placement, listing fees. Not decided.

## Market Organizer Relationship (Open)
Ally or competitor? Partnership opportunity with RG Canning (Rose Bowl organizer)?

## Success Criteria
- 15+ of 30 invited sellers post items before one Rose Bowl market
- 5+ inquiries happen through the app
- At least 3 deals close in person
- Sellers who post once continue posting (>50% retention)
- Dealers outside the invite list ask to join

## Technical Stack
- Cloudflare Workers (API/backend)
- Supabase (database, auth-adjacent storage)
- Cloudflare CDN (image hosting)
- Resend (email notifications if needed)
- Native `sms:` links for iMessage (no SMS provider needed)
- Mobile-first web app (just a URL, not app store)

## Distribution
Invite-only via founder texting unique links to dealers. Word of mouth within the dealer community.

## The Assignment (Pre-Build Validation)
Text 10 dealers. Don't ask "would you use this?" — everyone says yes to hypotheticals. Instead: **"Would you post 3 items by Thursday for the April Rose Bowl?"** Count the yeses for a specific commitment. If 7+ commit, the demand is real. Backup: admin CMS lets founder post on behalf of dealers to bootstrap supply.

## Key Strategic Questions for Discussion

1. **Supply-side chicken-and-egg:** How do you get sellers to post when there aren't buyers yet, and buyers to check when there aren't listings yet? The founder's personal network is the cold-start hack, but what's the scaling strategy?

2. **Seller motivation beyond labor savings:** Is "sell before you load your truck" enough to change behavior for dealers who've done this the same way for decades?

3. **Revenue timing:** When does free-to-paid happen? What's the trigger? Is it user count, transaction volume, or competitive pressure?

4. **Market organizer dynamics:** Does Early Bird help or hurt market organizers? If dealers pre-sell everything, do fewer dealers show up to the physical market? Or does it make the market more attractive because dealers can guarantee sales?

5. **Geographic expansion:** LA first, obviously. But what's the playbook for expanding to other markets (Brooklyn, Portland, Austin)? Does the invite-only model scale, or does it need to shift?

6. **Platform risk:** If this works, what stops Instagram or Facebook Marketplace from copying it? The answer is probably "trade-only verification" but how strong is that moat really?

7. **Pricing transparency:** Trade pricing is usually private. Posting prices publicly (even within a closed network) changes social dynamics. Is this good or bad for adoption?

8. **Super buyer monetization:** The "super buyers" (high-volume resellers) get the most value. They're the most likely to pay. What does a premium tier look like for them?
