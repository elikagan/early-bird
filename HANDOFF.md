# Early Bird — Session Handoff
Date: 2026-04-08

## Current State
App code rolled back to v0.5.1 (pre-v0.6 changes reverted). The bad v0.6 code that was rushed and unverified has been removed. The following are preserved:

- **PLAN-v3.md** — approved architecture: Watching tab, inline chat on item detail, price drop notifications, dealer inquiry threading, Buy·Watching|Sell|Account nav
- **QA-NOTES.md** — all user QA notes from v0.5 review, with obsolete messages notes archived
- **QA tool** — live at `elikagan.github.io/early-bird/qa/` with 35 screens. Notes sync to API at `early-bird.objectlesson.workers.dev/api/qa-notes`
- **Test users** — 4 users at different states (see below)
- **Supabase tables** — `market_booths` and `qa_notes` tables exist. `previous_price` column on items exists.

## Key Decisions (User-Approved)
1. **Nav labels:** Buy · Watching | Sell | Account (with visual divider grouping Buy+Watching)
2. **Kill Messages tab.** Communication lives on item detail pages.
3. **Watching tab** replaces Messages + Favorites. Shows items you've favorited or inquired about.
4. **Item detail transforms by state:** browsing → conversation (compact header + chat) → seller view (inquiry threads)
5. **Price drop notifications:** dealer lowers price → confirm → SMS to all watchers
6. **Dealer inquiry threading:** accordion threads per buyer on dealer's item detail page
7. **Hold/Sold → "which buyer?" prompt** connecting communication to action

## Test Users
| Role | Name | Phone | ID |
|------|------|-------|----|
| Fresh buyer | (no name) | +15555550001 | `99db7c21-d996-4ef0-8024-e4b2f67849bc` |
| Active buyer | Loubna Maher | +12138420721 | `9cc49ca0-1235-43aa-bbcb-93a0742b9aea` |
| Active buyer 2 | Marco Rivera | +13234638274 | `5a021f0e-4b9b-40bb-9786-595629acfb0a` |
| Fresh dealer | Sarah Chen | +15555550003 | `fc1df7fa-2247-4d7a-94dd-9a84d1abd8b1` |
| Active dealer | Eli | +13104985138 | `8935f2ac-4998-4e6d-9c31-47dbbce896fd` |

Conversations exist between Loubna→Eli (token: ZjWgPaD7) and Marco→Eli (token: zaUjFSTf).

## What v0.5.1 Has (working)
- Component classes: `.btn-primary`, `.btn-secondary`, `.btn-chip`, `.btn-danger`, `.fi`, `.fs`, `.fl`, `.status-pill`
- Hash routing with tab persistence (#/shop, #/booth, #/messages, #/account)
- Bottom nav centralized in `showScreen()` via `TAB_SCREENS` set
- Conversation detail with structured header, reply bar fixed above nav
- Messages list with last message preview + timestamp (API returns `last_message`)
- Market picker bottom sheet on dealer home
- Per-market booth setup card with `market_booths` table
- Feed cards with dealer avatar overlay, status pill inline with price
- Back/forward browser navigation working
- Loading button states (`.btn-primary.loading`)
- Error states with retry buttons on 6 screens
- `.btn-chip.active` wired into compose flow
- Auto-save settings on blur

## What v0.5.1 Does NOT Have (from QA notes)
- Consistent headers (6 different implementations)
- Correct nav labels (still says Shop/Booth/Messages/Account)
- Adequate text contrast (--muted #666 too light)
- Watching tab
- Inline chat on item detail
- Price drop UI
- Dealer inquiry threading
- Many screen-specific fixes listed in QA-NOTES.md

## Recommended Approach for Next Session
1. Pick the most complex screen (feed or dealer booth)
2. Build it perfectly — every component, every state, screenshot verified
3. Save it as design-reference.html — the source of truth
4. Each subsequent session propagates the reference to one more screen
5. User verifies each screen in QA tool before moving on

## Files
- `index.html` — the app (~5500 lines)
- `worker/index.js` — Cloudflare Worker API (~1100 lines)
- `worker/wrangler.toml` — Worker config
- `qa/index.html` — QA review tool
- `PLAN-v3.md` — approved architecture plan
- `QA-NOTES.md` — user's QA review notes
- `VERSION` — current version (0.5.1)
- `HANDOFF.md` — this file

## Deploy
- API: `cd worker && wrangler deploy`
- Pages: `git push` (GitHub Pages on main branch)
- QA: lives at `/qa/` on same Pages deploy
