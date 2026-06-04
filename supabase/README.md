# SATOMI Supabase Schema

This folder contains the initial SQL schema for SATOMI.

## Files

- `schema.sql`: initial schema draft for Supabase Postgres

## How To Run In Supabase SQL Editor

1. Create a Supabase project.
2. Open the project dashboard.
3. Open `SQL Editor`.
4. Create a new query.
5. Paste the contents of `supabase/schema.sql`.
6. Review the SQL one more time.
7. Run it in a development project first.

Do not run unreviewed schema changes directly in production.

## Required Environment Variables

Frontend and API integration are not implemented yet, but the future app will
need:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If server-side service-role operations are introduced later, keep that key in
server-only environment configuration.

## Security Rule

Never expose the Supabase service role key to the browser, client components,
or public environment variables.

Only the anon public key may be exposed to the frontend.

## Resetting Schema During Development

In a disposable development project, you can reset in one of these ways:

1. Create a fresh Supabase project and re-run `schema.sql`.
2. Use the Supabase dashboard database reset tools if you intentionally want a
   clean database.
3. Manually drop tables in reverse dependency order, then re-run `schema.sql`.

Use caution with resets because all development data will be removed.

## Notification Tables

`notification_sources` and `notification_candidates` are included now only to
reserve the schema for a future Capacitor native notification feature.

They are not active yet.

They must not be used to process OTP, PIN, password, or unrelated notification
content.

Only sanitized transaction-related notification text should ever be stored
later, and only after the native feature is explicitly implemented.
