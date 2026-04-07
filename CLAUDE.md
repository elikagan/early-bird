# Early Bird

## Development Rules

Research the codebase before editing. Never change code you haven't read.

## Stack
- Single-file HTML app: `index.html`
- Cloudflare Worker API: `worker/index.js`
- Supabase Postgres via REST API
- Deploy: `cd worker && wrangler deploy` (API) + `git push` (Pages)

## Design System
Always read the CSS section of index.html before making any visual or UI decisions.
All font choices, colors, spacing, and layout decisions must be consistent across screens.
Do not deviate without explicit user approval.
