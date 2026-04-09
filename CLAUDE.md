# Early Bird

## Development Rules

1. Read `ROADMAP.md` before making any changes. It contains all approved architecture decisions.
2. Read `QA-NOTES.md` for screen-by-screen design feedback.
3. Read `HANDOFF.md` for the current technical state of the app.

## Critical Constraints

- **No inline styling.** All CSS must be in classes, never `style=""` attributes.
- **Design system is the source of truth.** When `design-system.css` exists, all styling goes there. Until then, the `<style>` block in `index.html` is the CSS source — but the goal is to migrate everything out.
- **JetBrains Mono everywhere.** Do not use any other font. This is the brand.
- **Material Design 3 structure.** Components follow M3 specs customized with our theme. See ROADMAP.md "Design System" section.
- **Verify every change visually.** Screenshot or preview before claiming done. The QA tool is at `/qa/`.

## Stack
- Single-file HTML app: `index.html` (~5500 lines)
- Cloudflare Worker API: `worker/index.js` (~1100 lines)
- Supabase Postgres via REST API (project ref: `hfvfmndjknxvhwrstkrg`)
- Deploy: `cd worker && wrangler deploy` (API) + `git push` (Pages)
- QA tool: `qa/index.html` (live at `elikagan.github.io/early-bird/qa/`)

## Design System (EDS)
This project will be built using [EDS (Eli Design Studio)](https://github.com/elikagan/eds). EDS enforces component-based development through a structured ticket system.

### EDS Contract — MUST FOLLOW
When building or modifying screens in this repo:
1. **Read `design-system.css` first.** Know what components exist (marked with `@eds-` comments).
2. **Use only classes from the design system.** Never write inline `style=""` attributes. Never create ad-hoc CSS classes.
3. **Need a new component?** Create an EDS ticket — do not build it yourself. The ticket text should describe what you need (e.g., "Need a compact item row for Watching tab: thumbnail 48px, price, dealer name, status pill").
4. **After creating/restructuring a screen**, update `eds/projects/early-bird.json` with the screen entry (id, name, section, desc, setup).
5. **`design-system.css` is the styling source of truth.** `@eds-` comments tell you what components exist and what classes to use. Read them.

EDS handles design/styling. Claude Code handles structure/features. The contract between them is `design-system.css` (styling) and `eds/projects/early-bird.json` (screens).

### Running EDS for Early Bird
```bash
# EDS repo is at: /Users/elikagan/Desktop/Claude stuff/eds/
# Start the server (serves both the app and EDS studio):
node "/Users/elikagan/Desktop/Claude stuff/eds/studio/server.js" early-bird 8097

# Open EDS studio:
open http://localhost:8097/eds/

# The app is also directly accessible at:
open http://localhost:8097/
```

### EDS Screen Config
The screen definitions live at `eds/projects/early-bird.json` (in the EDS repo, NOT this repo). Each screen entry tells EDS how to set up the iframe (which user to auth as, what JS to eval). When you create or restructure a screen in this repo, update that config file so EDS knows about it.

Screen entry format:
```json
{
  "id": "screen-id",
  "name": "Human Readable Name",
  "section": "Buyer",
  "desc": "What this screen shows and why",
  "setup": { "user": "loubna", "eval": "switchTab('feed');" }
}
```

## Test Users
| Role | Name | ID |
|------|------|----|
| Fresh buyer | (no name) | `99db7c21-d996-4ef0-8024-e4b2f67849bc` |
| Active buyer | Loubna Maher | `9cc49ca0-1235-43aa-bbcb-93a0742b9aea` |
| Active buyer 2 | Marco Rivera | `5a021f0e-4b9b-40bb-9786-595629acfb0a` |
| Fresh dealer | Sarah Chen | `fc1df7fa-2247-4d7a-94dd-9a84d1abd8b1` |
| Active dealer | Eli | `8935f2ac-4998-4e6d-9c31-47dbbce896fd` |

These users exist in the Supabase database. Conversations exist between Loubna→Eli and Marco→Eli.
