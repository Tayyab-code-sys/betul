# Betul - Project Context

## What this is
A survey website plus a private dashboard. It tests one idea for the client, Betul:
a website where Turkish people who want to go abroad (residence, work, study, or a passport)
can find the visas each country offers (Germany, USA, Canada, Australia, UK, and more), all in one place.
Friends fill a short survey so the client can judge the idea.

Built by TFH Software (https://tfhsoftware.com).

## Language
The survey/landing page has a TR / EN toggle (top-right). Default is Turkish. `setLang()` in
`assets/survey.js` swaps all text via `data-i18n` keys and the `I18N` dictionary. A
`<meta name="google" content="notranslate">` stops the browser from auto-translating and fighting the toggle.

IMPORTANT: answer VALUES saved to Airtable are always ENGLISH, no matter which language the visitor
picked (each option is `O(turkishLabel, englishLabel)` and stores the English label). So the Airtable
data and the whole dashboard are English. Dashboard chrome is English too.

## Parts
1. `index.html` - Turkish survey landing page. 15 questions, all multiple choice, plus name + optional contact. Has a sticky progress bar and a boarding-pass hero visual.
2. `dashboard.html` - owner dashboard ("Control Tower"), dark departures-board theme. Password gate, stats, charts, table.
3. `api/submit.js`, `api/responses.js` - talk to Airtable; token stays server-side.

## Airtable
- Base: `appw2YRB8ziLp5Hhs` (client's existing "Main" base; same base as the Khalilullah project, different table)
- Table: `Betul Survey` (id `tblZ2I8OkbdN0G9mb`). Referenced by NAME in code, so the id can change safely.
- Field names AND answer values are English (e.g. field "Overall opinion", value "Great idea"). Keep `assets/survey.js` and `assets/dashboard.js` in sync with the Airtable column names and choice values.

## Dashboard visuals
Uses Chart.js (CDN) — doughnut charts for sentiment questions (top section) and horizontal bar charts for the rest, plus a stat band and a full response table. See `assets/dashboard.js` (DONUT_FIELDS / BAR_* arrays).

## Environment variables (`.env` locally and Vercel)
- `AIRTABLE_TOKEN` - secret `pat...` token, NOT committed.
- `AIRTABLE_BASE` = `appw2YRB8ziLp5Hhs`
- `AIRTABLE_TABLE` = `Betul Survey`
- `DASH_PASSWORD` - dashboard login password (default `betul2026`).
Base/table have code fallback defaults, so only token + password must be set.

## Run locally
```
node dev-server.js
```
Survey: http://localhost:3000  |  Dashboard: http://localhost:3000/dashboard.html

## Deploy
Vercel, no build step. `/api/*.js` become serverless functions; everything else static.

## Repo and accounts
- GitHub: https://github.com/Tayyab-code-sys/betul (push only from the `Tayyab-code-sys` account).
- Set a repo-local git identity `Tayyab-code-sys` before committing (the machine's global git identity is a different account).

## Design
- Landing/survey (`index.html`): the "Bold" theme (Wise-inspired). Off-white bg, huge uppercase Archivo
  headline, green accent, a 3-step "journey" idea block. Styles: `assets/core.css` (shared, themeable via
  CSS variables) + `assets/theme-3.css` (the chosen theme). The client picked this from several options;
  the other variants and their theme files were removed.
- Dashboard (`dashboard.html`): dark "control tower / departures board" (midnight navy, gold + teal glow),
  JetBrains Mono numerals, Chart.js doughnut + bar charts.
This is a sibling of the Khalilullah project (same architecture), but a completely different look.

## Contact
Betul WhatsApp: +90 533 508 2900 (set in `config.js`).
