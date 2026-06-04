# SATOMI Next Action

## Exact Next Prompt For Goals, Bills, And Profile Persistence

```text
Continue SATOMI.

Current phase:
Phase 16 - goals, bills, and profile persistence.

Read only:
- docs/PROJECT_STATUS.md
- docs/DATA_INTEGRATION.md
- docs/AUTH_FLOW.md
- docs/BACKEND_IMPLEMENTATION_PLAN.md
- supabase/schema.sql
- current /goals page
- current /bills page
- current /settings/persona
- current /settings/privacy
- current dashboard page

Task:
Extend Supabase integration beyond transactions and pockets.

Implement:
1. load and persist profile preferences where safe
2. goals list/detail integration
3. bills list integration
4. dashboard summary improvements using goals and bills when available

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
- explain how to test goals, bills, and settings persistence
```

## Why This Is Safest

Transactions and pockets are now live. The next clean step is to widen the authenticated data surface while keeping the same Supabase/RLS pattern and avoiding AI or native complexity too early.
