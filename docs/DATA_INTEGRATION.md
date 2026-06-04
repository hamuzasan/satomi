# SATOMI Data Integration

Last updated: 2026-06-04

## Scope

Phase 17 now connects the main authenticated finance data flows directly from the frontend to Supabase:

- transactions CRUD
- pockets CRUD
- pocket detail data
- goals CRUD
- goal detail data
- bills CRUD
- bill paid-state updates
- dashboard summary, recent transactions, and pocket overview
- dashboard goal progress and bills due soon
- insights category, weekly trend, top-category, and nudge-history aggregation

This phase still does **not** implement:

- AI extraction
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

### `goals`

Used for:

- list goals
- create goal
- update goal
- delete goal
- goal detail page
- dashboard target-progress panel

### `bills`

Used for:

- list bills
- create bill
- update bill
- delete bill
- mark bill as paid
- dashboard bills due soon panel

## UI Mapping Strategy

Supabase rows are mapped into SATOMI UI models before rendering:

- raw numeric values become formatted Rupiah strings
- pocket progress is derived from linked transactions
- pocket status (`Aman`, `Waspada`, `Hampir Habis`, `Lewat Batas`) is computed from progress
- goal progress is derived from `current_amount / target_amount`
- goal deadline and required saving pace are computed on the client from `target_date`
- bill due labels and urgency tone are derived from due date plus bill status
- category and pocket icon visuals are derived from local mapping helpers

This keeps the SATOMI neon UI intact while replacing dummy content with real data.

## UI Primitive Direction

Starting in Phase 16, touched finance forms are also moving away from raw browser primitives.

Current direction:

- use Radix-backed SATOMI-styled dialog and select components
- keep the neon glass SATOMI look
- avoid unstyled default browser dropdowns on newly edited surfaces

This pass upgrades:

- goals editor
- bills editor

Transactions and pockets still work, but their older form controls should be modernized in a later UI cleanup pass.

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

## Remaining Gaps After Phase 16

- no optimistic cross-page data sync beyond refresh
- no logout UI yet
- no profile settings persistence UI yet
- no AI-assisted transaction extraction
- no route-handler validation layer yet
- transactions and pockets forms still need the same modern primitive upgrade applied to goals and bills

## Recommended Next Step

Phase 18 should connect:

1. profile settings read/write
2. transactions and pockets form modernization onto the new UI primitive base
3. optional API route boundary for server-side validation where needed
4. AI extraction planning only after the finance CRUD surfaces feel stable
