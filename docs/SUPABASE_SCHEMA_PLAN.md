# SATOMI Supabase Schema Plan

Last updated: 2026-06-04

Current phase: Phase 12 - Supabase backend planning.

This is a planning document only. It does not contain executable SQL and does
not implement Supabase in the app.

## Goals

The Supabase schema must support:

- Browser/PWA mode.
- Future Capacitor remote URL mode.
- User-owned financial data.
- Chat-based transaction extraction.
- Smart Pockets.
- Goals.
- Bills.
- AI messages.
- AI extraction logs.
- Nudges.
- Future notification transaction candidates.

All user-owned tables must be protected by Row Level Security.

## Naming And Type Conventions

- Primary keys use UUIDs.
- User-owned rows include `user_id uuid references auth.users`.
- Timestamps use timezone-aware timestamps in the final SQL.
- Amounts use numeric values, not formatted currency strings.
- UI labels can stay in Bahasa Indonesia, but database status values should use
  stable lowercase enum-like text values where practical.
- The first SQL pass can use text columns with check constraints before moving
  to Postgres enum types.

## Table Plan

### profiles

Purpose: stores user-facing profile, persona, and SATOMI preference settings.

Columns:

- `id uuid primary key references auth.users`
- `name text`
- `email text`
- `avatar_url text nullable`
- `status text nullable`
- `language_style text`
- `persona_style text`
- `nudge_intensity text`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- `id` maps directly to Supabase Auth user id.
- `language_style` can default to Indonesian app copy.
- `persona_style` maps to UI options such as supportive, firm, casual, or
  minimal.
- `nudge_intensity` controls how often SATOMI warns the user.

### pockets

Purpose: stores Smart Pockets budget containers.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `name text`
- `type text`
- `budget_limit numeric`
- `current_amount numeric`
- `color text`
- `icon text`
- `warning_threshold numeric`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- `type` can support values such as spending, saving, bill, emergency, or
  custom.
- `current_amount` can be stored for fast UI reads, but should be recalculated
  or reconciled from transactions in backend jobs or safe server logic later.
- `warning_threshold` can represent a percentage such as `0.8` or `80`; final
  SQL should choose one convention and validate it.

### transactions

Purpose: stores confirmed user financial transactions.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `amount numeric`
- `type text: income/expense`
- `category text`
- `pocket_id uuid nullable`
- `description text`
- `transaction_date timestamp`
- `source text: chat/manual/notification`
- `confidence numeric nullable`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- `amount` should be positive; `type` determines income or expense.
- `pocket_id` should reference `pockets.id` in final SQL.
- `source` records whether the row came from manual entry, chat extraction, or
  confirmed notification candidate.
- `confidence` is only meaningful for AI or notification-derived suggestions.
- Transactions are saved only after explicit user confirmation.

### goals

Purpose: stores user financial goals.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `name text`
- `goal_type text`
- `target_amount numeric`
- `current_amount numeric`
- `target_date date nullable`
- `strategy text nullable`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- `goal_type` can support travel, emergency, debt, savings, spending-control,
  or custom.
- `strategy` maps to current UI strategy labels such as Save More Tomorrow,
  50/30/20, Debt Snowball, and Loss Aversion Reminder.

### bills

Purpose: stores recurring or one-time bills.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `name text`
- `amount numeric`
- `due_date date`
- `frequency text`
- `status text`
- `pocket_id uuid nullable`
- `reminder_days integer nullable`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- `frequency` can support monthly, weekly, yearly, one_time, or custom.
- `status` can support unpaid, paid, scheduled, skipped, or archived.
- `pocket_id` should reference the bill payment pocket when available.

### ai_messages

Purpose: stores chat messages for SATOMI context and user history.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `role text`
- `content text`
- `created_at timestamp`

Notes:

- `role` should support user, assistant, system, or tool in final validation.
- Keep content user-owned and protected by RLS.
- Add retention and deletion controls before production if chat history becomes
  sensitive.

### ai_extractions

Purpose: logs AI extraction attempts from chat or other text input.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `raw_input text`
- `extracted_json jsonb`
- `confidence numeric`
- `status text`
- `created_at timestamp`

Notes:

- `status` can support pending, proposed, confirmed, rejected, failed.
- `extracted_json` stores the model proposal, not trusted final data.
- AI output must be validated server-side and confirmed by the user before
  creating a transaction.

### nudges

Purpose: stores contextual SATOMI recommendations and warnings.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `type text`
- `title text`
- `message text`
- `related_transaction_id uuid nullable`
- `related_pocket_id uuid nullable`
- `related_goal_id uuid nullable`
- `severity text`
- `action_status text`
- `created_at timestamp`

Notes:

- `type` can support budget_warning, goal_progress, bill_reminder,
  positive_reinforcement, spending_trend, or privacy_notice.
- `severity` can support info, success, warning, critical.
- `action_status` can support new, seen, dismissed, acted.
- Related ids should become foreign keys in final SQL where possible.

### notification_sources

Purpose: stores user-approved Android notification source app settings for a
future Capacitor native plugin.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `app_name text`
- `package_name text`
- `enabled boolean`
- `created_at timestamp`
- `updated_at timestamp`

Notes:

- The user chooses allowed apps explicitly.
- SATOMI should not collect unrelated notifications.
- Native permission state and allowed source apps should be visible in settings.

### notification_candidates

Purpose: stores sanitized pending transaction candidates from allowed
notification sources.

Columns:

- `id uuid primary key`
- `user_id uuid references auth.users`
- `source_app text`
- `source_package text`
- `raw_text_sanitized text`
- `parsed_json jsonb`
- `status text: pending/confirmed/rejected`
- `created_transaction_id uuid nullable`
- `created_at timestamp`

Notes:

- Store sanitized notification text only.
- Do not store OTP, PIN, passwords, one-time codes, or unrelated notification
  content.
- A candidate must remain pending until the user confirms it.
- `created_transaction_id` links to the transaction created after confirmation.

## Relationship Plan

- `profiles.id` -> `auth.users.id`
- `transactions.user_id` -> `auth.users.id`
- `transactions.pocket_id` -> `pockets.id`
- `pockets.user_id` -> `auth.users.id`
- `goals.user_id` -> `auth.users.id`
- `bills.user_id` -> `auth.users.id`
- `bills.pocket_id` -> `pockets.id`
- `ai_messages.user_id` -> `auth.users.id`
- `ai_extractions.user_id` -> `auth.users.id`
- `nudges.user_id` -> `auth.users.id`
- `nudges.related_transaction_id` -> `transactions.id`
- `nudges.related_pocket_id` -> `pockets.id`
- `nudges.related_goal_id` -> `goals.id`
- `notification_sources.user_id` -> `auth.users.id`
- `notification_candidates.user_id` -> `auth.users.id`
- `notification_candidates.created_transaction_id` -> `transactions.id`

Foreign keys that point to user-owned child tables should be validated so a user
cannot link their row to another user's data.

## RLS Plan

Enable Row Level Security on every user-owned table.

Each table should have policies for:

- select own rows
- insert own rows
- update own rows
- delete own rows

Policy rule shape:

- select: `user_id = auth.uid()`
- insert: `user_id = auth.uid()`
- update: `user_id = auth.uid()`
- delete: `user_id = auth.uid()`

For `profiles`:

- select: `id = auth.uid()`
- insert: `id = auth.uid()`
- update: `id = auth.uid()`
- delete: usually disallow direct delete or allow `id = auth.uid()` depending on
  account deletion design

Final SQL should also include safeguards for nullable relationship fields and
prevent cross-user joins through foreign key references.

## Index Plan

Recommended indexes for the SQL phase:

- `profiles(id)`
- `transactions(user_id, transaction_date desc)`
- `transactions(user_id, pocket_id)`
- `transactions(user_id, source)`
- `pockets(user_id, created_at desc)`
- `goals(user_id, created_at desc)`
- `bills(user_id, due_date)`
- `bills(user_id, status)`
- `ai_messages(user_id, created_at desc)`
- `ai_extractions(user_id, created_at desc)`
- `nudges(user_id, created_at desc)`
- `nudges(user_id, action_status)`
- `notification_sources(user_id, package_name)`
- `notification_candidates(user_id, status, created_at desc)`

## Security Principles

- Validate all writes server-side.
- Do not trust AI output directly.
- Require user confirmation before saving an extracted transaction.
- Require user confirmation before saving a notification candidate.
- Store sanitized notification text only.
- Do not process OTP, PIN, password, or one-time-code notifications.
- Never expose the Supabase service role key to the client.
- Prefer least-privilege client access with RLS.
- Keep future service-role operations inside server-only API routes or backend
  jobs.
