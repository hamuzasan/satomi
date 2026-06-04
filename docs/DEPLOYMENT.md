# SATOMI Deployment Guide

Last updated: 2026-06-04

Current target: Vercel deployment for the static dummy-data frontend.

This guide does not connect Supabase, backend routes, real authentication, real
AI extraction, Capacitor, or Android native code.

## Vercel Deployment Steps

1. Push the SATOMI repository to GitHub, GitLab, or Bitbucket.
2. Open Vercel and choose `Add New Project`.
3. Import the SATOMI repository.
4. Keep the framework preset as `Next.js`.
5. Use the default project root.
6. Confirm the build command:

```bash
npm run build
```

7. Confirm the install command remains Vercel default, or use:

```bash
npm install
```

8. Deploy the project.
9. Open the production HTTPS URL after deployment completes.

## Environment Variables

No environment variables are required for the current dummy frontend.

`.env.example` contains future placeholders only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

Do not add real secrets until backend, Supabase, and AI work begins.

## Local Verification Before Deploy

Run:

```bash
npm run lint
npm run build
```

Both commands should pass before deploying.

## Production Route Checks

After deployment, verify these routes return a SATOMI page:

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/onboarding`
- `/dashboard`
- `/chat`
- `/transactions`
- `/pockets`
- `/pockets/self-reward`
- `/goals`
- `/goals/dana-jepang`
- `/bills`
- `/insights`
- `/settings`
- `/settings/persona`
- `/settings/privacy`
- `/settings/notification-intercept`
- `/help`

## PWA Checks After Deploy

On the production HTTPS URL, verify:

- `/manifest.webmanifest` returns `200`.
- `/sw.js` returns `200`.
- `/offline.html` returns `200`.
- `/favicon.ico` returns `200`.
- `/icons/icon-192.png` returns `200`.
- `/icons/icon-512.png` returns `200`.
- `/icons/maskable-icon-192.png` returns `200`.
- `/icons/maskable-icon-512.png` returns `200`.
- Chrome DevTools Application panel shows the manifest.
- Lighthouse PWA audit passes or lists only known manual items.
- Installed PWA starts at `/dashboard`.
- Offline navigation shows `SATOMI sedang offline`, not a generic browser error.

## Android Mobile Layout Checks

On Android Chrome:

1. Open the production HTTPS URL.
2. Test viewport around 360px width or a small Android phone.
3. Check these routes:
   - `/dashboard`
   - `/chat`
   - `/transactions`
   - `/pockets`
   - `/goals`
   - `/bills`
   - `/insights`
   - `/settings`
4. Confirm:
   - no horizontal page scroll
   - bottom navigation does not cover content
   - chat composer stays above bottom navigation
   - modals and sheets scroll internally
   - tap targets feel usable
   - dark background fills the screen

## Clearing Stale Service Worker Cache

If an old UI appears after deploy:

1. Open Chrome DevTools.
2. Go to `Application`.
3. Open `Service Workers`.
4. Click `Unregister` for the SATOMI service worker.
5. Open `Storage`.
6. Click `Clear site data`.
7. Hard refresh the page.

On Android Chrome:

1. Open Chrome app info from Android settings.
2. Clear storage for Chrome if needed, or clear the specific site data from
   Chrome settings.
3. Reopen the production SATOMI URL.

## Capacitor Remote URL Note

Capacitor is not installed yet.

When SATOMI later uses Capacitor remote URL mode, the Android wrapper should
load the deployed production HTTPS URL. That keeps the same Next.js routes,
service boundaries, and future API behavior available to the native shell.

Do not create the Capacitor wrapper until production PWA behavior is verified.
