# SATOMI Project Status

Last updated: 2026-06-04

## Current Phase

SATOMI is currently in Phase 11.5D - Vercel deployment readiness completed.

The safest interpretation is:

- Phase 11 static frontend UI is locally implemented with dummy data.
- Phase 11.5 PWA readiness is prepared locally.
- Phase 11.5B Capacitor readiness audit is completed locally.
- Phase 11.5C PWA and mobile app-shell readiness is completed locally.
- Phase 11.5D Vercel deployment readiness is completed locally.
- Actual production deployment, Lighthouse validation, Supabase, real AI
  extraction, and Android wrapper work are not started yet.

## Project Shape

- `app/` contains the Next.js App Router pages, layout, loading, error, and
  manifest files.
- `src/components/satomi/` contains reusable SATOMI UI components.
- `src/lib/` contains dummy SATOMI data, utilities, and platform detection.
- `public/` contains static assets, PWA icons, service worker, offline fallback,
  favicon, and `.well-known` placeholder docs.
- `docs/` contains project status, roadmap, PWA, TWA, and Capacitor planning.

There is no `src/app` folder. The App Router lives in root-level `app/`, which
is valid for Next.js.

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
- Client-only service worker registration in
  `src/components/satomi/service-worker-register.tsx`.
- Mobile browser install hint in
  `src/components/satomi/pwa-install-hint.tsx`.
- Platform detection utility in `src/lib/platform.ts`.
- Digital Asset Links placeholder documentation at
  `public/.well-known/README.md`.
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
- no backend
- no AI extraction

## Known Risks And Remaining Work

- Placeholder icons may need final brand-approved replacement before production.
- Vercel deployment still needs to be performed manually.
- PWA behavior still needs production HTTPS verification after deploy.
- Android Chrome installability still needs device testing.
- Offline fallback still needs installed-PWA testing.
- Capacitor WebView behavior still needs real wrapper testing after Capacitor is
  installed in a later phase.
- API base URL and auth/session behavior must be revisited when backend work
  begins.
- `assetlinks.json` must not be guessed; it requires Android package and
  signing fingerprint data.

## Latest Verification

Completed on 2026-06-04:

```bash
npm run lint
npm run build
```

Both commands passed during Phase 11.5D.

Also verified locally on `http://localhost:3002`:

- all requested app routes returned `200`
- `/manifest.webmanifest` returned `200`
- `/sw.js` returned `200`
- `/offline.html` returned `200`
- required standard and maskable icons returned `200`
- `/.well-known/README.md` returned `200`

## Next Recommended Task

Deploy the static frontend to Vercel manually:

1. import the repository into Vercel
2. use `npm run build`
3. deploy over HTTPS
4. verify manifest, icons, service worker, and offline fallback on production
5. run Lighthouse PWA audit
6. test Android Chrome installability

After production PWA testing is clean, continue to Supabase backend planning.
Do not install Capacitor until production PWA behavior is verified.
