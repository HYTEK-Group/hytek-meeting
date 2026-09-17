---
app: hytek-meeting
url: https://hytek-meeting.vercel.app
status: side-tool                    # Scott, 17/09/2026 (decision 16) — not archived; NOT part of the live business system
live_system: false
role: none                           # uses its own project's service key, not a suite Postgres role
unattended: none                     # no cron, no vercel.json, no scheduled task — it only runs when a person opens it
shared_tables_owned: []              # owns no SHARED table; its two tables live in its OWN Supabase project
credential_names: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_PIN]   # FINDING: on the Vercel project (Production) and in the local .env.local (a placeholder URL there). Values not read. The key is for the meeting app's own project, not SHARED
supabase:
  project_refs: []                   # no literal ref in code. Its own project: the account has hytek-meeting (anshfknakgrgejavajvq) and hytek-meeting-cost (nquflhmisvzzinymkdzp); which one SUPABASE_URL names was not read
  env:
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE_KEY
tables:
  owns:                              # in its OWN project; neither table exists on SHARED (checked 17/09/2026)
    - staff                          # names and hourly rates for the cost meter
    - meeting_log                    # past meetings and what they cost
  reads: []
  rpcs: []
hosts:
  approved: []
env:
  privileged:
    - SUPABASE_SERVICE_ROLE_KEY      # own project only; server routes behind OWNER_PIN
crons: []
events:
  out: []
  in: []
exemptions: []
---

# hytek-meeting — passport

**Status: side tool (Scott, 17/09/2026) — not archived; not part of the live system.**

**Last checked: 17/09/2026**

## What it is

"Meeting $" — a phone-friendly meter that shows what a meeting is costing while it
runs. The organiser ticks who is in the room and the meter counts up from their
hourly rates. The owner screen, behind `OWNER_PIN`, manages the staff list and
rates and keeps a log of past meetings.

## Who uses it

Scott (the owner PIN) and whoever he hands the organiser screen to. It is not a
Hub tile and no other app links to it.

## What it touches

- **Database:** its own Supabase project only, with two tables, `staff` and
  `meeting_log` (`scripts/schema.sql`). Neither table exists on SHARED. The
  staff list here is its own copy, not the Hub's people list.
- **Credentials (finding):** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and
  `OWNER_PIN` are set on Vercel (Production). The service key is for this app's
  own project and is only used in server routes. It holds no credential for any
  live-system database.
- **Schedules:** none. The GitHub repo holds only the `ANTHROPIC_API_KEY` secret
  for the org-wide "ai-fix" workflow (runs only when an issue is labelled).

## Checks

`npm test` (vitest). No typecheck script. The canonical
`hytek-brain/tool/architecture-check.ts --root <this repo>` passes against this
passport.
