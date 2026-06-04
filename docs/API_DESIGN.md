# SATOMI API Design

Last updated: 2026-06-04

Current phase: Phase 12 - Supabase backend planning.

This document plans API routes only. It does not implement route handlers.

## API Principles

- All mutating routes require an authenticated Supabase user.
- Every route must validate input server-side.
- Every user-owned read must be scoped to the authenticated user.
- Never trust client-provided `user_id`.
- Never trust AI output directly.
- Return proposed extracted data first; save only after explicit confirmation.
- Never expose Supabase service role keys to the browser.
- Service worker must not cache API responses.

## Runtime Modes

### Browser/PWA

- The user opens the production website.
- Frontend calls relative `/api/*` routes.
- API routes use the Supabase session and RLS.

### Capacitor Remote URL

- The Android app later loads the production website URL.
- Frontend calls the same relative `/api/*` routes.
- Native notification plugin later sends sanitized candidates to the web layer
  and/or the same API routes.

## Planned Routes

### `/api/transactions`

Purpose: manage confirmed user transactions.

Methods:

- `GET`: list current user's transactions
- `POST`: create a confirmed transaction

Future child route:

- `/api/transactions/[id]`
  - `GET`: read one transaction
  - `PATCH`: update one transaction
  - `DELETE`: delete one transaction

Query parameters:

- `from`
- `to`
- `type`
- `category`
- `pocket_id`
- `limit`
- `cursor`

POST body:

- `amount`
- `type`
- `category`
- `pocket_id`
- `description`
- `transaction_date`
- `source`
- `confidence`

Validation:

- amount must be numeric and positive
- type must be income or expense
- source must be chat, manual, or notification
- linked pocket must belong to the current user
- confidence must be nullable or between 0 and 1

### `/api/pockets`

Purpose: manage Smart Pockets.

Methods:

- `GET`: list current user's pockets
- `POST`: create a pocket

Future child route:

- `/api/pockets/[id]`
  - `GET`: read one pocket
  - `PATCH`: update one pocket
  - `DELETE`: delete one pocket

POST/PATCH body:

- `name`
- `type`
- `budget_limit`
- `current_amount`
- `color`
- `icon`
- `warning_threshold`

Validation:

- name is required
- budget limit must be numeric and non-negative
- warning threshold must be bounded
- user can only update own pockets

### `/api/goals`

Purpose: manage financial goals.

Methods:

- `GET`: list current user's goals
- `POST`: create a goal

Future child route:

- `/api/goals/[id]`
  - `GET`: read one goal
  - `PATCH`: update one goal
  - `DELETE`: delete one goal

POST/PATCH body:

- `name`
- `goal_type`
- `target_amount`
- `current_amount`
- `target_date`
- `strategy`

Validation:

- target amount must be positive
- current amount must be non-negative
- target date is optional but must be a valid date
- user can only update own goals

### `/api/bills`

Purpose: manage bills and recurring obligations.

Methods:

- `GET`: list current user's bills
- `POST`: create a bill

Future child route:

- `/api/bills/[id]`
  - `GET`: read one bill
  - `PATCH`: update one bill
  - `DELETE`: delete one bill

Query parameters:

- `status`
- `from`
- `to`

POST/PATCH body:

- `name`
- `amount`
- `due_date`
- `frequency`
- `status`
- `pocket_id`
- `reminder_days`

Validation:

- amount must be numeric and positive
- due date must be valid
- linked pocket must belong to current user
- reminder days must be nullable or non-negative

### `/api/chat/extract`

Purpose: turn Indonesian chat input into a proposed transaction.

Methods:

- `POST`: create an extraction attempt and return a transaction proposal

POST body:

- `message`
- `context`

Response:

- `extraction_id`
- `proposal`
- `confidence`
- `needs_confirmation`
- `warnings`

Proposal shape:

- `amount`
- `type`
- `category`
- `pocket_id`
- `description`
- `transaction_date`
- `source`

Validation and safety:

- authenticated user required
- raw input is stored in `ai_extractions`
- user message may be stored in `ai_messages`
- model output is treated as untrusted
- server validates amount, type, date, category, and pocket ownership
- transaction is not saved until user confirms

Future confirmation route:

- `/api/chat/confirm-extraction`
  - creates a transaction from a validated extraction proposal

### `/api/nudges`

Purpose: list and update SATOMI nudges.

Methods:

- `GET`: list current user's nudges
- `POST`: create a rule-based or server-generated nudge

Future child route:

- `/api/nudges/[id]`
  - `PATCH`: mark seen, dismissed, or acted
  - `DELETE`: delete a nudge

Query parameters:

- `action_status`
- `severity`
- `type`

POST body:

- `type`
- `title`
- `message`
- `related_transaction_id`
- `related_pocket_id`
- `related_goal_id`
- `severity`
- `action_status`

Validation:

- related records must belong to the current user
- severity must be an allowed value
- action status must be an allowed value

### `/api/notification-candidates`

Purpose: manage future Android notification-derived transaction candidates.

Methods:

- `GET`: list current user's candidates
- `POST`: create a pending sanitized candidate

Future child route:

- `/api/notification-candidates/[id]`
  - `PATCH`: confirm or reject candidate
  - `DELETE`: delete candidate

POST body:

- `source_app`
- `source_package`
- `raw_text_sanitized`
- `parsed_json`
- `status`

Validation and safety:

- source package must be enabled by the user in `notification_sources`
- raw text must be sanitized before storage
- OTP, PIN, password, and unrelated notification content must be rejected
- status starts as pending
- confirmation creates a transaction only after user action

Future confirmation behavior:

- validate candidate ownership
- validate parsed transaction proposal
- create transaction with `source = notification`
- set candidate status to confirmed
- set `created_transaction_id`

## Error Response Shape

Recommended JSON shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid.",
    "details": {}
  }
}
```

Use Bahasa Indonesia for user-facing messages and stable uppercase English codes
for programmatic handling.

## Success Response Shape

For collection routes:

```json
{
  "data": [],
  "meta": {
    "next_cursor": null
  }
}
```

For single writes:

```json
{
  "data": {}
}
```

## Caching Policy

API routes should set conservative headers for sensitive responses:

```text
Cache-Control: no-store
```

The service worker must continue excluding `/api/` and future AI/auth paths from
cache handling.
