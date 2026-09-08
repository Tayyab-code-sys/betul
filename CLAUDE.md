# Betul - Project Context

## What this is
A survey website plus a private dashboard. It tests one idea for the client, Betul:
a website where Turkish people who want to go abroad (residence, work, study, or a passport)
can find the visas each country offers (Germany, USA, Canada, Australia, UK, and more), all in one place.
Friends fill a short survey so the client can judge the idea.

Built by TFH Software (https://tfhsoftware.com).

## Language
Survey + landing page are in TURKISH. Dashboard chrome (labels, headings) is in ENGLISH.
Airtable field/column names are English; the stored answer VALUES are Turkish.

## Parts
1. `index.html` - Turkish survey landing page. 15 questions, all multiple choice, plus name + optional contact. Has a sticky progress bar and a boarding-pass hero visual.
2. `dashboard.html` - owner dashboard ("Control Tower"), dark departures-board theme. Password gate, stats, charts, table.
3. `api/submit.js`, `api/responses.js` - talk to Airtable; token stays server-side.

## Airtable
- Base: `appw2YRB8ziLp5Hhs` (client's existing "Main" base; same base as the Khalilullah project, different table)
- Table: `Betul Survey` (id `tblD2zvgLuAcXJBrP`)
- Field names are English (e.g. "Overall opinion"), values are Turkish (e.g. "Harika fikir"). Keep `assets/survey.js` and `assets/dashboard.js` in sync with the Airtable column names.

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
Two distinct aesthetics on purpose:
- Survey/landing: light "departure" theme (ivory, deep navy, gold + coral sunrise, teal), Bricolage Grotesque + Manrope, boarding-pass hero.
- Dashboard: dark "control tower / departures board" (midnight navy, gold + teal glow), JetBrains Mono numerals.
This is a sibling of the Khalilullah project (same architecture), but a completely different look.

## Contact
Betul WhatsApp: +90 533 508 2900 (set in `config.js`).
