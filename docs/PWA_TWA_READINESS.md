# SATOMI PWA + TWA Readiness

This pass prepares the Next.js web app for a future Progressive Web App and
Trusted Web Activity package. It does not create an Android project, Bubblewrap
project, backend, real auth, or real AI integration.

## What Was Added

- App Router manifest at `app/manifest.ts`.
- SATOMI placeholder PNG icons in `public/icons`.
- Favicon at `public/favicon.ico`.
- Offline fallback page at `public/offline.html`.
- Service worker at `public/sw.js`.
- Client service worker registration component. Registration is production-only
  so the Next.js dev server keeps hot reload and RSC routing clean.
- Mobile install hint component shown only when the browser exposes the install
  prompt.
- Future Digital Asset Links placeholder at `public/.well-known/README.md`.
- Mobile safe-area polish for app shell, bottom navigation, chat composer, and
  mobile modal sheets.

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
  - `/icons/maskable-icon-192.png`
  - `/icons/maskable-icon-512.png`

## Icon Requirements

The current icons are generated placeholders using the SATOMI dark neon orb and
sparkle identity. Before production, replace them with final brand-approved
assets while keeping the same file names and sizes:

- 192x192 standard icon
- 512x512 standard icon
- 192x192 maskable icon with enough safe padding
- 512x512 maskable icon with enough safe padding
- favicon equivalent

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

## What Remains Before TWA

- Deploy the web app to a stable production HTTPS URL.
- Run Lighthouse PWA checks in Android Chrome.
- Confirm manifest and service worker are served correctly on production.
- Replace placeholder icons with final approved SATOMI assets if needed.
- Create the Android TWA wrapper with Bubblewrap after the production URL is
  ready.
- Generate the Android signing key.
- Get the SHA-256 signing certificate fingerprint.
- Add real `/.well-known/assetlinks.json` using the production package name and
  SHA-256 fingerprint.
- Test installation and TWA launch on Android devices.

## Future Bubblewrap Steps

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
