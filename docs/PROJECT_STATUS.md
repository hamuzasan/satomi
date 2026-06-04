# SATOMI Project Status

Last updated: 2026-06-04

## Current Phase

SATOMI is currently in Phase 14 - Supabase client and auth integration.

The safest interpretation is:

- Phase 11 static frontend UI is locally implemented with dummy data.
- Phase 11.5 PWA readiness is prepared locally.
- Phase 11.5B Capacitor readiness audit is completed locally.
- Phase 11.5C PWA and mobile app-shell readiness is completed locally.
- Phase 11.5D Vercel deployment readiness is completed locally.
- Phase 12 Supabase backend planning is completed in documentation.
- Phase 13 initial Supabase SQL schema is created.
- Phase 14 Supabase client and auth foundation is implemented locally.
- Actual authenticated app CRUD, production deployment, Lighthouse validation, real AI extraction, and Android wrapper work are not started yet.

## Project Shape

- `app/` contains the Next.js App Router pages, layout, loading, error, and manifest files.
- `src/components/satomi/` contains reusable SATOMI UI components.
- `src/lib/` contains dummy SATOMI data, utilities, and platform detection.
- `public/` contains static assets, PWA icons, service worker, offline fallback, favicon, and `.well-known` placeholder docs.
- `docs/` contains project status, roadmap, PWA, TWA, Capacitor, backend, and deployment planning.
- `supabase/` now contains SQL schema artifacts.

There is no `src/app` folder. The App Router lives in root-level `app/`, which is valid for Next.js.

## Implemented Routes

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/onboarding`
- `/dashboard`
- `/chat`
- `/transactions`
- `/pockets`
- `/pockets/[id]`
- `/goals`
- `/goals/[id]`
- `/bills`
- `/insights`
- `/settings`
- `/settings/persona`
- `/settings/privacy`
- `/settings/notification-intercept`
- `/help`

## PWA And Mobile App-Shell Status

Implemented:

- Next.js manifest at `app/manifest.ts`.
- Root metadata and mobile viewport configuration in `app/layout.tsx`.
- PWA icons in `public/icons`.
- Icon placeholder documentation at `public/icons/README.md`.
- Favicon at `public/favicon.ico`.
- Offline fallback page at `public/offline.html`.
- Conservative service worker at `public/sw.js`.
- Client-only service worker registration in `src/components/satomi/service-worker-register.tsx`.
- Mobile browser install hint in `src/components/satomi/pwa-install-hint.tsx`.
- Platform detection utility in `src/lib/platform.ts`.
- Digital Asset Links placeholder documentation at `public/.well-known/README.md`.
- Safe-area variables and `100dvh` support in global CSS.
- Mobile bottom nav spacing and chat composer safe positioning.
- Wheel/touchpad scroll bridge for app-like scroll behavior on desktop Chrome.
- Vercel deployment guide at `docs/DEPLOYMENT.md`.
- Future environment placeholder file at `.env.example`.

## Capacitor Status

Capacitor is planned but not installed.

Current Android direction:

- Prefer Capacitor remote URL mode when native Android features are needed.
- Keep browser/PWA mode healthy for open web usage.
- Keep TWA as an optional fallback path.

Not done yet:

- no Capacitor package
- no `android/` folder
- no native plugin
- no notification reading implementation
- no backend integration
- no AI extraction

## Supabase Status

Planning documents exist:

- `docs/SUPABASE_SCHEMA_PLAN.md`
- `docs/BACKEND_IMPLEMENTATION_PLAN.md`
- `docs/API_DESIGN.md`

SQL schema artifacts now exist:

- `supabase/schema.sql`
- `supabase/README.md`
- `docs/SUPABASE_SQL_DRAFT.md`

The SQL now covers:

- profiles
- pockets
- transactions
- goals
- bills
- ai_messages
- ai_extractions
- nudges
- notification_sources
- notification_candidates
- indexes
- updated_at trigger
- RLS policies
- comments for security-sensitive tables

Auth foundation now exists:

- `@supabase/supabase-js`
- `@supabase/ssr`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/types.ts`
- `src/lib/supabase/config.ts`
- middleware protection for authenticated routes
- login, register, and forgot-password client flows
- `docs/AUTH_FLOW.md`

Still not done yet:

- no authenticated CRUD pages
- no route handlers
- no dashboard aggregation from Supabase
- no logout surface
- no password update page
- no live verification against a real Supabase project yet

## Known Risks And Remaining Work

- Placeholder icons may need final brand-approved replacement before production.
- Vercel deployment still needs to be performed manually.
- PWA behavior still needs production HTTPS verification after deploy.
- Supabase project may still need to be created manually.
- SQL may still need to be executed manually in Supabase.
- RLS policies still need verification in a real Supabase project.
- Android Chrome installability still needs device testing.
- Offline fallback still needs installed-PWA testing.
- Capacitor WebView behavior still needs real wrapper testing after Capacitor is installed in a later phase.
- API base URL and deeper auth/session behavior must be revisited when CRUD and route handlers begin.
- `assetlinks.json` must not be guessed; it requires Android package and signing fingerprint data.

## Latest Verification

Completed on 2026-06-04:

```bash
npm run lint
npm run build
```

These commands must pass again for Phase 14 after auth integration changes.

Also verified locally on `http://localhost:3002` during deployment-readiness:

- all requested app routes returned `200`
- `/manifest.webmanifest` returned `200`
- `/sw.js` returned `200`
- `/offline.html` returned `200`
- required standard and maskable icons returned `200`
- `/.well-known/README.md` returned `200`

## Next Recommended Task

Begin authenticated data integration after auth foundation is verified.

The next phase should:

1. create the Supabase project if it does not exist yet
2. run `supabase/schema.sql` in the Supabase SQL Editor
3. add local and Vercel env vars
4. verify register, login, and reset-email flows against the real project
5. connect `profiles`
6. connect transactions first, then dashboard aggregation

Do not implement AI extraction, Capacitor, notification reading, or service-role logic until basic authenticated data flows are stable.
