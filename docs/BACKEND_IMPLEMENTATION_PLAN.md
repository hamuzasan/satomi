# SATOMI Backend Implementation Plan

Last updated: 2026-06-04

Current phase: Phase 12 - Supabase backend planning.

This plan describes implementation order only. It does not implement Supabase,
create SQL, add AI extraction, or install Capacitor.

## Backend Direction

SATOMI should use Supabase for:

- authentication
- Postgres database
- Row Level Security
- user-owned financial data
- storage later if avatar uploads are needed

The Next.js app should remain the main product surface for:

- browser/PWA mode
- future Capacitor remote URL mode

## Runtime Strategy

### Browser/PWA Mode

- The website runs from the deployed production URL.
- Relative Next.js `/api/*` routes work normally.
- Supabase client uses `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- The service worker must not cache sensitive API, auth, Supabase, AI, or
  finance responses.

### Capacitor Remote URL Mode

- The Android app later loads the same production URL.
- The same Next.js routes and `/api/*` endpoints remain available.
- Native notification plugins communicate through the Capacitor bridge and then
  pass confirmed or pending candidates into the web layer and/or API.
- Browser-only UI such as PWA install prompts remains hidden in Capacitor mode.

Static export mode is not recommended because SATOMI will need auth, API routes,
AI extraction, dynamic data, and native plugin communication.

## Implementation Order

### Step 1: Supabase Client

Goal: add Supabase runtime configuration without changing user-facing behavior.

Tasks:

- Install Supabase client package in a later implementation phase.
- Add browser client helper for client components.
- Add server helper for route handlers/server components if needed.
- Read env vars from `.env.local` and Vercel project settings.
- Keep service role key server-only if introduced later.

No database UI should depend on Supabase until auth is ready.

### Step 2: Auth

Goal: replace static auth screens with real Supabase Auth.

Tasks:

- Wire login/register/forgot-password to Supabase Auth.
- Add session handling.
- Protect authenticated app routes.
- Keep unauthenticated public routes available.
- Decide redirect rules:
  - logged out user -> `/login`
  - logged in user -> `/dashboard`

Do not add social login until email/password flow is stable.

### Step 3: Profiles

Goal: persist user persona and preference settings.

Tasks:

- Create profile row after signup.
- Load profile in settings.
- Save persona style, language style, and nudge intensity.
- Keep profile reads/writes protected by RLS.

### Step 4: Transactions

Goal: replace dummy transactions with user-owned CRUD.

Tasks:

- Implement list, create, update, delete flows.
- Store numeric amounts.
- Store transaction type as income/expense.
- Link transactions to pockets when selected.
- Keep transaction creation confirmation-first.

### Step 5: Pockets

Goal: persist Smart Pockets.

Tasks:

- Implement pocket list and detail reads.
- Implement pocket create/update/delete.
- Link transactions to pockets.
- Decide whether `current_amount` is stored, calculated, or periodically
  reconciled.

### Step 6: Goals

Goal: persist goals and progress.

Tasks:

- Implement goal list and detail reads.
- Implement goal create/update/delete.
- Allow manual current amount updates first.
- Add derived progress in dashboard later.

### Step 7: Bills

Goal: persist recurring and one-time bill records.

Tasks:

- Implement bill list.
- Implement bill create/update/delete.
- Link bills to a payment pocket when available.
- Add reminder metadata without push notifications yet.

### Step 8: Dashboard Aggregation

Goal: replace dashboard dummy summaries with user data.

Tasks:

- Aggregate income and expense totals by period.
- Aggregate spending by category.
- Aggregate pocket usage.
- Aggregate goal progress.
- Surface bill urgency.
- Generate simple rule-based nudges before AI nudges.

### Step 9: AI Extraction

Goal: parse Indonesian chat input into transaction proposals.

Tasks:

- Add `/api/chat/extract`.
- Store user chat message in `ai_messages`.
- Store extraction attempt in `ai_extractions`.
- Return a proposed transaction preview.
- Require user confirmation before writing to `transactions`.
- Never trust model output without server-side validation.

AI extraction should start only after transaction CRUD and confirmation UI are
stable.

### Step 10: Notification Candidates Later

Goal: support future Android notification-derived transaction candidates.

Tasks:

- Keep notification source settings user-controlled.
- Accept sanitized candidate payloads only.
- Store candidates as pending.
- Show pending candidates in the web UI.
- Require user confirmation before creating a transaction.
- Allow rejection and deletion.

Do not implement native notification reading until Capacitor and Android
permission UX are explicitly started.

## Data Migration Strategy

The first backend implementation should:

- keep dummy data available as fallback during development
- map dummy records to future seed data only if useful
- avoid migrating fake data into production user accounts automatically
- add SQL in a dedicated schema migration document or migration file after this
  planning phase

## Validation Strategy

Server-side validation should check:

- authenticated user exists
- request body shape
- numeric amount format
- allowed transaction type
- allowed source value
- valid date formats
- user owns any linked pocket, goal, transaction, or bill
- AI extraction confidence is numeric and bounded
- notification text is sanitized and not OTP/PIN/password-like

Client-side validation can improve UX but must not be the source of truth.

## Service Worker Boundary

The service worker must keep these paths network-only:

- `/api/`
- `/auth/`
- `/supabase/`
- `/functions/`
- `/ai/`
- `/chat/extract`

No sensitive financial, auth, AI, or notification candidate response should be
stored in cache.

## Manual Supabase Setup Steps

When implementation begins:

1. Create a Supabase project.
2. Copy the project URL.
3. Copy the anon public key.
4. Add values to local `.env.local`.
5. Add values to Vercel environment variables.
6. Create SQL schema and RLS policies from the approved schema plan.
7. Enable email auth settings.
8. Configure production site URL and redirect URLs.
9. Test signup, login, logout, and session refresh.
10. Verify RLS with two separate test users.

Do not add a service role key to browser-accessible variables.

## Completion Criteria For Backend Phase

Phase 12 planning is complete when:

- schema plan exists
- API route plan exists
- implementation order exists
- security principles are documented
- next prompt for SQL schema exists

Backend implementation begins only after the SQL schema prompt is approved.
