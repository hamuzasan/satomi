# SATOMI Next Action

## Exact Next Prompt For Profiles And First Protected Data

```text
Continue the SATOMI project.

Current phase:
Phase 15 - profiles and first authenticated data wiring.

Read only:
- docs/PROJECT_STATUS.md
- docs/AUTH_FLOW.md
- docs/BACKEND_IMPLEMENTATION_PLAN.md
- supabase/schema.sql
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- app/dashboard/page.tsx
- current dummy transaction data source

Task:
Connect SATOMI to Supabase for the first real authenticated data read/write flow.

Implement only:
1. profile bootstrap/read
2. transactions list read
3. create manual transaction flow
4. dashboard summary backed by real transactions where possible
5. keep dummy fallback only where data is not integrated yet

Do not implement:
- AI extraction
- notification candidates
- Capacitor
- Android project
- service role usage

Run:
- npm run lint
- npm run build

After completion:
- summarize changed files
- list remaining dummy-data areas
- list required Supabase dashboard settings
```

## Why This Is Safest

Auth is now the stable entry point. The next clean move is to connect one user-owned data flow end to end before expanding into the rest of the finance features.
