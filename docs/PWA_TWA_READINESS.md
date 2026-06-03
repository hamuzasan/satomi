# SATOMI PWA + TWA Readiness

Last audited: 2026-06-03

This pass prepares the Next.js web app for a future Progressive Web App and
Android packaging path. Capacitor is now the preferred Android direction, while
Trusted Web Activity remains an optional fallback. This document does not create
an Android project, Bubblewrap project, Capacitor project, backend, real auth,
push notifications, notification intercept, or real AI integration.

## Current Readiness Status

SATOMI is locally ready for a production deployment readiness pass and a
Capacitor readiness audit.

Verified locally:
- `npm run lint` passes.
- `npm run build` passes.
- `/manifest.webmanifest` returns `200`.
- `/sw.js` returns `200`.
- `/offline.html` returns `200`.
- Required standard and maskable icons return `200`.
- `/favicon.ico` returns `200`.
- Core app routes were checked at approximately `360px` width with no
  page-level horizontal overflow.
- Desktop sidebar navigation is present and links correctly.
- Mobile bottom navigation is present and links correctly.

## What Is Implemented

- App Router manifest at `app/manifest.ts`.
- SATOMI placeholder PNG icons in `public/icons`.
- Favicon at `public/favicon.ico`.
- Offline fallback page at `public/offline.html`.
- Service worker at `public/sw.js`.
- Client service worker registration component at
  `src/components/satomi/service-worker-register.tsx`.
- Registration is production-only so the Next.js dev server keeps hot reload and
  RSC routing clean.
- Mobile install hint component shown only when the browser exposes the install
  prompt.
- Future Digital Asset Links placeholder at `public/.well-known/README.md` for
  the optional TWA fallback path.
- Mobile safe-area support for app shell, bottom navigation, chat composer, and
  mobile sheets/modals.
- Internal scrollbar hiding for app-like mobile chat/filter surfaces while
  keeping touch scrolling available.

## Manifest Fields

The manifest uses:

- `name`: `SATOMI - AI Finance Companion`
- `short_name`: `SATOMI`
- `description`: Indonesian SATOMI finance assistant description
- `start_url`: `/dashboard`
- `scope`: `/`
- `display`: `standalone`
- `orientation`: `portrait`
- `background_color`: `#020617`
- `theme_color`: `#020617`
- `lang`: `id`
- `categories`: `finance`, `productivity`
- Icons:
  - `/icons/icon-192.png`
  - `/icons/icon-512.png`
  - `/icons/maskable-icon-192.png` with `purpose: maskable`
  - `/icons/maskable-icon-512.png` with `purpose: maskable`

## Icon Requirements

The current icons are generated placeholders using the SATOMI dark neon orb and
sparkle identity. Before production, replace them with final brand-approved
assets while keeping the same file names and sizes:

- 192x192 standard icon
- 512x512 standard icon
- 192x192 maskable icon with enough safe padding
- 512x512 maskable icon with enough safe padding
- favicon equivalent

Verified current dimensions:

| File | Size |
| --- | --- |
| `public/icons/icon-192.png` | 192x192 |
| `public/icons/icon-512.png` | 512x512 |
| `public/icons/maskable-icon-192.png` | 192x192 |
| `public/icons/maskable-icon-512.png` | 512x512 |

## Service Worker Strategy

`public/sw.js` uses a conservative strategy:

- Cache the offline fallback and icon assets during install.
- Remove old SATOMI caches during activate.
- Use network-first behavior for navigations and fall back to
  `/offline.html` when the network is unavailable.
- Use cache-first behavior for static Next assets and icons.
- Avoid caching sensitive or future dynamic finance paths such as `/api/`,
  `/auth/`, `/supabase/`, `/functions/`, `/ai/`, and `/chat/extract`.

The service worker intentionally does not implement offline transaction sync.
Sensitive auth/session/API/AI responses should remain network-only when the
backend is added.

This service worker is intended for browser and installed-PWA mode. For a
future Capacitor wrapper, service worker registration should remain suppressible
through runtime detection so the native shell does not inherit browser-only
assumptions accidentally.

The registration component unregisters same-origin service workers during
development. Test PWA behavior locally with a production build:

```bash
npm run build
npm run start
```

## Offline Behavior

When a navigation request fails offline, the service worker serves
`public/offline.html`.

Offline fallback copy:

- Title: `SATOMI sedang offline`
- Body: `Koneksi internet tidak tersedia. Beberapa data terakhir mungkin masih bisa dilihat, tapi sinkronisasi membutuhkan koneksi.`
- Button: `Coba Lagi`

The offline page uses SATOMI's dark neon visual style and does not look like a
generic browser error page.

## Mobile/TWA Layout Audit

Verified at approximately `360px` width:

- `/dashboard`
- `/chat`
- `/transactions`
- `/pockets`
- `/goals`
- `/bills`
- `/insights`
- `/settings`
- `/settings/persona`
- `/settings/privacy`
- `/settings/notification-intercept`

Fixes made during this audit:

- Reduced the Smart Pockets summary amount on small screens so
  `Rp3.150.000` no longer clips inside the card.
- Increased small text-only links/buttons to mobile-friendly tap target heights.
- Added internal height/scroll constraints to the mobile chat transaction
  preview sheet.
- Hid internal scrollbars on mobile chat/filter surfaces for a more app-like
  feel while preserving scroll.

## What Remains Before Android Packaging

- Deploy the web app to a stable production HTTPS URL.
- Run Lighthouse PWA checks in Chrome.
- Test installability on Android Chrome.
- Confirm manifest and service worker are served correctly on production.
- Confirm offline navigation fallback in an installed PWA.
- Replace placeholder icons with final approved SATOMI assets if needed.
- Perform a dedicated Capacitor readiness audit before installing Capacitor.
- Create the Android Capacitor wrapper only after the frontend is audited for
  embedded WebView assumptions.
- Generate the Android signing key.
- Get the SHA-256 signing certificate fingerprint.
- Add real `/.well-known/assetlinks.json` only if the TWA fallback path is
  actually used.
- Test Android packaging behavior on devices once the chosen wrapper exists.

## Future TWA Fallback Steps

1. Deploy SATOMI over HTTPS.
2. Verify `/manifest.webmanifest`, `/sw.js`, `/offline.html`, and icon URLs.
3. Install Bubblewrap tooling.
4. Initialize the Android project from the production manifest URL.
5. Use planned package name `com.satomi.finance`.
6. Build and sign the Android App Bundle.
7. Add Digital Asset Links to production hosting.
8. Test the TWA on Android Chrome and Play Store internal testing.

## Digital Asset Links

Digital Asset Links prove that the Android app package is allowed to open the
production SATOMI website as a Trusted Web Activity.

`assetlinks.json` must not be guessed. It requires:

- Android package name
- SHA-256 signing certificate fingerprint

Current planned package name:

```text
com.satomi.finance
```

The placeholder `public/.well-known/README.md` explains why
`assetlinks.json` is intentionally absent for now.

## Production Domain Requirement

TWA requires a stable HTTPS origin. Localhost can be used for development, but
final installability, service worker behavior, Digital Asset Links, and TWA
validation must be tested on the production domain, such as a Vercel deployment.

Capacitor does not replace that need for a strong web frontend. SATOMI should
still keep its website and PWA behavior healthy even if Capacitor becomes the
main Android wrapper.
