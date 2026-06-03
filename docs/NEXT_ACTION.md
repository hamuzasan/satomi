# SATOMI Next Action

## Exact Next Prompt After Manual Vercel Deployment

```text
Continue SATOMI after Phase 11.5D - Vercel deployment readiness completed.

Do not implement backend, Supabase, real auth, real AI extraction, Capacitor
installation, native Android files, or notification reading yet.

I have deployed the static SATOMI frontend to Vercel.

1. Read:
   - docs/PROJECT_STATUS.md
   - docs/DEPLOYMENT.md
   - docs/PWA_CAPACITOR_READINESS.md
   - docs/PWA_AUDIT_CHECKLIST.md
   - docs/API_RUNTIME_STRATEGY.md
   - docs/CAPACITOR_READINESS_CHECKLIST.md
2. Verify the deployed production URL:
   - manifest route
   - icons and favicon
   - offline fallback
   - service worker caching boundaries
   - metadata and theme color
   - route loading/error states
   - Android Chrome mobile layout
   - PWA installability
3. Document any production-only issues.
4. Do not create Android/TWA/Capacitor wrapper files yet.
5. Run locally:
   - npm run lint
   - npm run build
6. Report:
   - production PWA readiness status
   - manual Android Chrome installability checks
   - remaining issues before Supabase backend planning
   - what must be completed before installing Capacitor

Keep all UI copy in Bahasa Indonesia.
Use dummy data only.
```

## Why This Is Safest

The frontend is locally ready for Vercel: lint and build pass, requested routes
return `200`, PWA assets are present, and deployment instructions exist.

The next highest-value step is manual production HTTPS validation before
Supabase backend planning or any Capacitor work.
