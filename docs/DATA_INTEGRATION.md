# SATOMI Data Integration

Last updated: 2026-06-04

## Scope

Phase 15 connects the first authenticated finance data flows directly from the frontend to Supabase:

- transactions CRUD
- pockets CRUD
- pocket detail data
- dashboard summary, recent transactions, and pocket overview

This phase still does **not** implement:

- AI extraction
- goals CRUD
- bills CRUD
- notification candidates
- Next.js API route handlers
- service-role server actions

## Runtime Approach

For this phase, SATOMI reads and writes data directly with the authenticated Supabase browser client.

That means:

- user identity comes from the Supabase session
- RLS remains the main ownership boundary
- no `SUPABASE_SERVICE_ROLE_KEY` is exposed
- no `/api/*` layer is required yet

## Tables Used

### `transactions`

Used for:

- list transactions
- create transaction
- update transaction
- delete transaction
- dashboard income/expense summary
- pocket-related transaction lists

### `pockets`

Used for:

- list pockets
- create pocket
- update pocket
- safe delete pocket
- dashboard pocket overview
- pocket detail page

### `profiles`

Used only for:

- greeting name on dashboard when available

## UI Mapping Strategy

Supabase rows are mapped into SATOMI UI models before rendering:

- raw numeric values become formatted Rupiah strings
- pocket progress is derived from linked transactions
- pocket status (`Aman`, `Waspada`, `Hampir Habis`, `Lewat Batas`) is computed from progress
- category and pocket icon visuals are derived from local mapping helpers

This keeps the SATOMI neon UI intact while replacing dummy content with real data.

## Pocket Usage Logic

Current UI logic derives pocket usage from transactions:

- spending, bill, and custom pockets primarily count linked expense transactions
- saving, emergency, and income pockets use linked inflow minus outflow when available

This keeps pocket progress reactive without waiting for server-side aggregation.

## Safe Delete Rule

Pocket deletion is intentionally conservative:

- a pocket cannot be deleted if there are still transactions linked to it
- user must first move or remove the related transactions

This avoids accidental orphaned finance structure from the UI layer.

## Loading, Empty, and Error States

Implemented in Bahasa Indonesia for:

- transactions page
- pockets page
- pocket detail page
- dashboard page

The UI now has explicit states for:

- loading from Supabase
- empty data
- failed fetch
- failed mutation
- successful create/update/delete

## Service Worker Boundary

This phase still avoids caching sensitive finance responses.

Current behavior is safe because:

- direct Supabase browser requests are not routed through SATOMI's same-origin `/api/*` cache surface
- the service worker already avoids aggressive caching for sensitive app flows

If transactions or pockets move into `/api/*` routes later, those responses must keep `Cache-Control: no-store`.

## Remaining Gaps After Phase 15

- no optimistic cross-page data sync beyond refresh
- no logout UI yet
- no profile settings persistence UI yet
- no goals integration
- no bills integration
- no AI-assisted transaction extraction
- no route-handler validation layer yet

## Recommended Next Step

Phase 16 should connect:

1. profile settings read/write
2. goals and bills data
3. richer dashboard aggregation
4. optional API route boundary for server-side validation where needed
