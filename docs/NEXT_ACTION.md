# SATOMI Next Action

## Exact Next Prompt For Profile Persistence And Finance Form Modernization

```text
Continue SATOMI.

Current phase:
Phase 18 - profile persistence and finance form modernization.

Read only:
- docs/PROJECT_STATUS.md
- docs/DATA_INTEGRATION.md
- docs/DASHBOARD_AGGREGATION.md
- docs/AUTH_FLOW.md
- docs/BACKEND_IMPLEMENTATION_PLAN.md
- supabase/schema.sql
- current /settings/persona
- current /settings/privacy
- current /transactions page
- current /pockets page

Task:
Stabilize the authenticated finance frontend after Phase 17.

Implement:
1. load and persist profile preferences where safe
2. modernize transactions form controls onto the newer Radix/shadcn-style SATOMI primitives
3. modernize pockets form controls onto the newer Radix/shadcn-style SATOMI primitives
4. keep all current Supabase CRUD behavior intact

Do not implement:
- AI extraction
- notification candidates
- Capacitor
- Android project
- service role usage
- push notifications

Run:
- npm run lint
- npm run build

After completion:
- summarize changed files
- list remaining dummy-data surfaces
- explain how to test settings persistence, transactions, and pockets
```

## Why This Is Safest

Transactions, pockets, goals, bills, dashboard aggregation, and insights are now live. The next clean step is to stabilize settings persistence and bring the older finance editors onto the same more modern UI primitive base before widening scope again.
