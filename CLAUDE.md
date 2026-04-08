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
This project will be built using [EDS (Eli Design Studio)](https://github.com/elikagan/eds). EDS enforces component-based development through a structured ticket system. See the EDS repo for how it works.

## Test Users
| Role | Name | ID |
|------|------|----|
| Fresh buyer | (no name) | `99db7c21-d996-4ef0-8024-e4b2f67849bc` |
| Active buyer | Loubna Maher | `9cc49ca0-1235-43aa-bbcb-93a0742b9aea` |
| Active buyer 2 | Marco Rivera | `5a021f0e-4b9b-40bb-9786-595629acfb0a` |
| Fresh dealer | Sarah Chen | `fc1df7fa-2247-4d7a-94dd-9a84d1abd8b1` |
| Active dealer | Eli | `8935f2ac-4998-4e6d-9c31-47dbbce896fd` |

These users exist in the Supabase database. Conversations exist between Loubna→Eli and Marco→Eli.
