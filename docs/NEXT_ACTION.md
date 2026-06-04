# SATOMI Next Action

## Exact Next Prompt For AI Confirm Route And Profile Persistence

```text
Continue SATOMI.

Current phase:
Phase 19 - AI confirm route and profile persistence.

Read only:
- docs/PROJECT_STATUS.md
- docs/DATA_INTEGRATION.md
- docs/AI_EXTRACTION.md
- docs/DASHBOARD_AGGREGATION.md
- docs/AUTH_FLOW.md
- docs/BACKEND_IMPLEMENTATION_PLAN.md
- supabase/schema.sql
- current /chat page
- current /settings/persona
- current /settings/privacy

Task:
Stabilize the authenticated finance frontend after Phase 18.

Implement:
1. load and persist profile preferences where safe
2. create a dedicated confirm-save route for AI extraction previews
3. move chat save confirmation onto that server route
4. keep all current Supabase CRUD behavior intact

Do not implement:
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
- list remaining older primitive finance forms
- explain how to test extraction preview and confirmed save
```

## Why This Is Safest

Transactions, pockets, goals, bills, dashboard aggregation, insights, and preview extraction are now live. The next clean step is to close the AI trust loop with a dedicated confirm route, while also moving profile persistence forward without widening into native scope.
