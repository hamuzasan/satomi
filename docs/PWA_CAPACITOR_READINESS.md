# SATOMI PWA + Capacitor Readiness

Last updated: 2026-06-04

Current phase: Phase 11.5C - PWA and mobile app-shell readiness completed.

This document tracks SATOMI's web frontend readiness for:

- browser usage
- installable PWA usage
- future Capacitor remote URL Android wrapper

This pass did not install Capacitor, create an `android/` folder, implement
backend code, or implement AI extraction.

## Manifest

SATOMI uses the Next.js App Router manifest at `app/manifest.ts`, served as
`/manifest.webmanifest`.

Configured fields:

- `name`: `SATOMI - AI Finance Companion`
- `short_name`: `SATOMI`
- `description`: `Asisten keuangan AI untuk mencatat transaksi lewat chat, mengatur Smart Pockets, dan memberi nudge kontekstual.`
- `start_url`: `/dashboard`
- `scope`: `/`
- `display`: `standalone`
- `orientation`: `portrait`
- `background_color`: `#020617`
- `theme_color`: `#020617`
- `lang`: `id`
- `categories`: `finance`, `productivity`

## Icons

Required icons exist in `public/icons`:

- `icon-192.png`
- `icon-512.png`
- `maskable-icon-192.png`
- `maskable-icon-512.png`

The current icons are placeholder SATOMI assets using the dark neon brand
direction. `public/icons/README.md` documents the manual replacement step for
final brand-approved assets.

## Root Metadata

`app/layout.tsx` sets:

- `html lang="id"`
- title `SATOMI`
- description `Asisten keuangan AI untuk mencatat transaksi lewat chat.`
- application name `SATOMI`
- manifest link `/manifest.webmanifest`
- dark theme color `#020617`
- mobile viewport width, initial scale, and `viewport-fit=cover`

## Safe Area And App Shell

Global CSS supports:

- `env(safe-area-inset-top)`
- `env(safe-area-inset-bottom)`
- dark body background
- `100dvh` mobile viewport support
- no horizontal page overflow
- vertical touch and wheel scrolling

App shell support:

- mobile bottom navigation uses safe-area bottom padding
- app routes include bottom padding to avoid nav overlap
- chat composer is fixed above bottom navigation on mobile
- modal and sheet surfaces constrain height and scroll internally

## Offline Fallback

`public/offline.html` exists and uses SATOMI styling:

- title: `SATOMI sedang offline`
- message: `Koneksi internet tidak tersedia. Beberapa data terakhir mungkin masih bisa dilihat, tapi sinkronisasi membutuhkan koneksi.`
- button: `Coba Lagi`

The page uses a dark SATOMI background, cyan/purple glow, and a simple orb mark.

## Service Worker

`public/sw.js` exists with a conservative strategy:

- install event caches offline fallback and app icons
- activate event removes old SATOMI caches
- navigation requests use network-first behavior with offline fallback
- static Next assets and icons use cache-first behavior
- sensitive future paths are not cached:
  - `/api/`
  - `/auth/`
  - `/supabase/`
  - `/functions/`
  - `/ai/`
  - `/chat/extract`

Service worker registration is client-only in
`src/components/satomi/service-worker-register.tsx`. It uses platform detection
so registration can remain disabled inside a future Capacitor shell.

## Install Hint

`PWAInstallHint` exists and is intentionally non-intrusive:

- only responds to the browser `beforeinstallprompt` event
- only appears in mobile browser context
- hides in future Capacitor mode
- title: `Pasang SATOMI di HP`
- text: `Akses SATOMI seperti aplikasi tanpa membuka browser.`
- button: `Pasang`

## Digital Asset Links

`public/.well-known/README.md` documents why `assetlinks.json` is not created
yet.

The planned package name is:

```text
com.satomi.finance
```

The real `assetlinks.json` will require the Android package name and SHA-256
signing certificate fingerprint.

## Remaining Before Capacitor

- Deploy SATOMI to a stable HTTPS production URL.
- Run Lighthouse PWA checks on production.
- Test installability in Android Chrome.
- Test offline fallback in an installed PWA.
- Replace placeholder icons with final approved assets if needed.
- Confirm API base URL strategy when backend work begins.
- Only then install Capacitor and create the Android wrapper.
