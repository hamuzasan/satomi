# SATOMI Auth Flow

Last updated: 2026-06-04

## Scope

Phase 14 adds the authentication foundation only:

- Supabase browser and server clients
- email/password login
- email/password register
- forgot-password request flow
- middleware protection for authenticated app routes

This phase does not yet connect dashboard data, transactions, pockets, goals, bills, AI extraction, or notification ingestion.

## Runtime Model

SATOMI uses Supabase Auth with `@supabase/ssr` so the same session can be recognized in:

- Client Components
- Server Components
- Next.js middleware

Environment variables required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`SUPABASE_SERVICE_ROLE_KEY` must never be exposed to browser code and is not used in this phase.

## Login Flow

Route: `/login`

1. User enters email and password.
2. Client calls `supabase.auth.signInWithPassword()`.
3. If login succeeds, SATOMI attempts a non-blocking `profiles` upsert for backfill safety.
4. User is redirected to:
   - `redirectedFrom` query param if present and local
   - otherwise `/dashboard`
5. Protected pages become accessible through the Supabase session cookie.

If the credentials fail, SATOMI shows a Bahasa Indonesia error state.

## Register Flow

Route: `/register`

1. User enters name, email, password, and password confirmation.
2. User must agree to the privacy checkbox before submit.
3. Client calls `supabase.auth.signUp()` with:
   - email
   - password
   - `options.data.name`
   - `emailRedirectTo` back to `/login`
4. If Supabase returns an immediate session, SATOMI attempts a non-blocking `profiles` upsert and redirects to `/onboarding`.
5. If email confirmation is required, SATOMI shows a success state asking the user to verify email first.

## Forgot Password Flow

Route: `/forgot-password`

1. User enters email.
2. Client calls `supabase.auth.resetPasswordForEmail()`.
3. The redirect target currently points back to `/login`.
4. SATOMI shows a generic success message without exposing whether the email exists.

Note: a dedicated update-password page is still not implemented in this phase.

## Route Protection

Middleware now protects:

- `/dashboard`
- `/chat`
- `/transactions`
- `/pockets`
- `/goals`
- `/bills`
- `/insights`
- `/settings`

If the user is not authenticated, SATOMI redirects to `/login?redirectedFrom=<route>`.

Nested routes under those prefixes are included automatically.

## Auth Page Behavior

When Supabase env vars are present and a valid session already exists:

- `/login` redirects to `/dashboard`
- `/register` redirects to `/dashboard`
- `/forgot-password` redirects to `/dashboard`

This avoids authenticated users getting stuck on public auth screens.

## Dummy Data Compatibility

Dashboard and other app pages may still rely on local dummy data after login.

This is intentional for Phase 14. Authentication is wired first so the later data-integration phases can replace dummy sources incrementally without reworking session handling.

## Manual Supabase Dashboard Setup

Before local auth testing will work end-to-end:

1. Create the Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Enable Email auth provider.
4. Add local redirect URLs such as:
   - `http://localhost:3000/login`
   - `http://localhost:3001/login`
   - `http://localhost:3002/login`
5. Confirm Site URL and redirect URLs are correct for your local port and future Vercel domain.
6. Decide whether email confirmation is required during development.

## Known Gaps After Phase 14

- No logout UI yet
- No update-password page yet
- No route handlers or server actions for app CRUD yet
- No dashboard aggregation from Supabase yet
- No AI extraction/authenticated API route integration yet
