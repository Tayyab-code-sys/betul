# Betul - Survey and Dashboard

A survey website plus a private dashboard. It tests one idea for the client, Betul:
a website where Turkish people who want to go abroad (for residence, work, study, or a passport)
can find the visas each country offers, all in one place. Friends fill a short survey so Betul
can see if the idea is worth building.

The survey and landing page are in **Turkish**. The private dashboard chrome is in **English**.

Built by TFH Software (https://tfhsoftware.com).

## Parts
1. `index.html` - the survey landing page (Turkish). 15 questions, all multiple choice, plus name and optional contact.
2. `dashboard.html` - the owner dashboard ("Control Tower"). Password gate, stats, charts, and a table of every answer.
3. `api/` - serverless functions that talk to Airtable. The secret token lives here as an env var, never in the browser or the repo.

## Airtable (the database)
- Base: `appw2YRB8ziLp5Hhs` (the client's existing "Main" base)
- Table name: `Betul Survey`
- Field names are English; answer values are Turkish. If you rename a field in Airtable, rename it in `assets/survey.js` and `assets/dashboard.js` too.

## How the data flows
- Survey submit -> `POST /api/submit` -> Airtable create record (server adds the `Submitted` time).
- Dashboard -> `GET /api/responses` with header `x-dash-password` -> server checks the password, then returns all records.

## Step 1 - Make your Airtable token
1. Go to https://airtable.com/create/tokens
2. Create a token with scopes `data.records:read` and `data.records:write`.
3. Give it access to the **Main** base (the one with the `Betul Survey` table).
4. Copy the token. It starts with `pat`.

## Step 2 - Test on your computer
1. Copy `.env.example` to a new file named `.env`.
2. Paste your token after `AIRTABLE_TOKEN=`.
3. Run:
   ```
   node dev-server.js
   ```
4. Open:
   - Survey: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard.html

## Step 3 - Put it online with Vercel
1. Import the GitHub repo in Vercel.
2. Add these Environment Variables, then Deploy:

   | Name | Value |
   |------|-------|
   | `AIRTABLE_TOKEN` | your token |
   | `AIRTABLE_BASE` | `appw2YRB8ziLp5Hhs` |
   | `AIRTABLE_TABLE` | `Betul Survey` |
   | `DASH_PASSWORD` | your dashboard password |

## Step 4 - GitHub
Repo: https://github.com/Tayyab-code-sys/betul

```
git init
git add .
git commit -m "Betul survey and dashboard"
git branch -M main
git remote add origin https://github.com/Tayyab-code-sys/betul.git
git push -u origin main
```

The `.env` with your token is never pushed. That is on purpose.

## Contact
Betul WhatsApp: +90 533 508 2900
