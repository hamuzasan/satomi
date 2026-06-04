# SATOMI Dashboard Aggregation

Last updated: 2026-06-04

## Scope

Phase 17 connects the dashboard and insights surfaces to real authenticated user data from Supabase.

This document explains how the current frontend aggregation works before any future API route or server-side analytics layer is introduced.

## Data Sources

Current aggregation reads directly from:

- `transactions`
- `pockets`
- `goals`
- `bills`
- `nudges`
- `profiles` for greeting name only

All reads happen through the authenticated Supabase browser client with RLS still enforcing ownership.

## Dashboard Calculations

### Total income this month

Calculated from:

- current user's `transactions`
- only rows where `type = income`
- only rows whose `transaction_date` falls inside the current calendar month

### Total expense this month

Calculated from:

- current user's `transactions`
- only rows where `type = expense`
- only rows whose `transaction_date` falls inside the current calendar month

### Remaining budget

Calculated as:

- `monthly income - monthly expense`

If negative, the UI shows a negative amount and an error tone.

### Risky pockets

Calculated from mapped pocket progress.

Current pocket progress still comes from linked transactions:

- spending, bill, and custom pockets mainly count expense transactions
- saving, emergency, and income pockets use inflow minus outflow where applicable

A pocket is considered risky when:

- `progress >= 70`

### Recent transactions

Currently uses:

- latest transactions sorted by `transaction_date desc`
- top 5 rows for dashboard display

### Active goal progress

Current dashboard logic chooses:

- the goal with the largest `target_amount`

Then shows:

- `current_amount`
- `target_amount`
- progress from `current_amount / target_amount`

### Bills due soon

Current dashboard logic shows:

- bills with `status = unpaid` or `status = scheduled`
- sorted by nearest `due_date`
- top 3 rows

## Insights Calculations

### Spending by category

Calculated from:

- current month expense transactions only
- grouped by `category`
- sorted descending by total amount

Each category then gets:

- Rupiah total
- percent share of current month spending
- icon from local category mapping
- visual tone for chart/legend rendering

### Weekly spending trend

Calculated from:

- expense transactions only
- last 7 days including today
- daily totals grouped by local date

The insights page renders:

- a mobile-safe responsive area chart
- tooltip values in Rupiah

### Top spending categories

Currently:

- top 3 results from the category aggregation

### Nudge history

If rows exist in `nudges`, the insights page shows:

- latest 6 nudges
- title
- message
- relative time
- tone derived from severity

If there are no nudge rows, the page shows a useful empty state inside the nudge section instead of crashing.

### Positive reinforcement

Derived from currently available live data:

- paid bills
- healthy pockets below the warning threshold
- strongest goal progress

This is still heuristic and intentionally lightweight for the frontend phase.

## Empty-State Behavior

Dashboard and insights should never crash on empty data.

Current behavior:

- no transactions: recent activity and category sections show empty states
- no pockets: pocket sections show empty states
- no goals: dashboard goal card shows a useful prompt instead of blank
- no bills: dashboard and bills due soon show empty states
- no nudges: nudge history section shows a contextual empty state
- no overall insight data: `/insights` shows a full-page empty state

## Error-State Behavior

If Supabase snapshot loading fails:

- dashboard shows an error panel with retry
- insights shows an error panel with retry

Copy remains in Bahasa Indonesia.

## Mobile Chart Safety

Charts now use responsive containers and constrained card wrappers.

Current protections:

- `ResponsiveContainer` from Recharts
- no fixed pixel chart width
- chart wrappers use overflow-safe card containers
- tooltip content stays compact
- axis labels use small mobile-safe font sizes

## Service Worker Boundary

This phase still does not cache sensitive finance reads through same-origin API routes.

Current frontend aggregation remains safe because:

- the app reads directly from Supabase
- no new `/api/*` analytics route was added yet

If a server analytics endpoint is introduced later, it must keep:

- `Cache-Control: no-store`

## Known Limits

- aggregation is still client-side
- all trend logic is based on frontend date math
- timezone edge cases may need server normalization later
- dashboard active goal selection is still heuristic, not explicitly user-configured
- reinforcement and recommendation text is still rule-based, not AI-generated

## Recommended Next Step

After Phase 17, the safest next work is:

1. profile settings persistence
2. transactions/pockets form modernization onto the same newer UI primitive base
3. optional route-handler validation and server-side aggregation only if needed
