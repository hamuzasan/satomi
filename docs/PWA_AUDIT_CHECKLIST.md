# SATOMI PWA Audit Checklist

Last audited: 2026-06-04

Use this checklist before production deployment, PWA validation, TWA fallback,
or Capacitor installation.

## Manifest

- [x] Manifest exists at `/manifest.webmanifest`.
- [x] Manifest is implemented with `app/manifest.ts`.
- [x] `name` is `SATOMI - AI Finance Companion`.
- [x] `short_name` is `SATOMI`.
- [x] `description` is Indonesian and SATOMI-specific.
- [x] `start_url` is `/dashboard`.
- [x] `scope` is `/`.
- [x] `display` is `standalone`.
- [x] `orientation` is `portrait`.
- [x] `background_color` is `#020617`.
- [x] `theme_color` is `#020617`.
- [x] `lang` is `id`.
- [x] Categories include `finance` and `productivity`.

## Icons

- [x] `public/icons` exists.
- [x] `/icons/icon-192.png` exists.
- [x] `/icons/icon-512.png` exists.
- [x] `/icons/maskable-icon-192.png` exists.
- [x] `/icons/maskable-icon-512.png` exists.
- [x] Manifest references the standard icons.
- [x] Manifest references the maskable icons with `purpose: maskable`.
- [x] `public/favicon.ico` exists.
- [x] `public/icons/README.md` documents placeholder replacement.
- [ ] Replace placeholder icons with final approved production assets if needed.

## Metadata And Viewport

- [x] Root layout uses `html lang="id"`.
- [x] Root title is `SATOMI`.
- [x] Root description is `Asisten keuangan AI untuk mencatat transaksi lewat chat.`
- [x] Application name is `SATOMI`.
- [x] Manifest is linked from root metadata.
- [x] Viewport uses `width=device-width`.
- [x] Viewport uses `initial-scale=1`.
- [x] Viewport uses `viewport-fit=cover`.
- [x] Theme color is dark SATOMI navy.

## Safe Area And Mobile Shell

- [x] Global CSS exposes safe-area top and bottom variables.
- [x] Body and HTML use dark background.
- [x] Body and HTML support `100dvh`.
- [x] Page-level horizontal overflow is hidden.
- [x] Mobile bottom navigation includes safe-area bottom padding.
- [x] App shell content has bottom padding for mobile nav.
- [x] Chat composer sits above mobile bottom navigation.
- [x] Mobile sheets and modals constrain height and scroll internally.
- [x] Scroll input remains usable for wheel/touchpad and touch pan.

## Offline Fallback

- [x] `public/offline.html` exists.
- [x] Offline page title is `SATOMI sedang offline`.
- [x] Offline message is in Bahasa Indonesia.
- [x] Offline page has a `Coba Lagi` button.
- [x] Offline page uses SATOMI dark neon styling.
- [x] Offline page does not look like a generic browser error.

## Service Worker

- [x] `public/sw.js` exists.
- [x] Service worker has an install event.
- [x] Service worker has an activate event.
- [x] Offline fallback is cached during install.
- [x] Navigation requests use network-first behavior.
- [x] Future API, auth, Supabase, function, and AI paths are not cached.
- [x] Static app assets are cached conservatively.
- [x] Registration is client-only.
- [x] Registration can be disabled in future Capacitor mode through platform detection.
- [x] Development mode unregisters same-origin service workers to avoid stale dev behavior.

## Install Hint

- [x] `PWAInstallHint` exists.
- [x] Install prompt is non-intrusive.
- [x] Install prompt is hidden inside future Capacitor mode.
- [x] Install prompt is limited to mobile browser context.
- [x] Button text is `Pasang`.
- [x] Title is `Pasang SATOMI di HP`.
- [x] Text is `Akses SATOMI seperti aplikasi tanpa membuka browser.`

## Future Asset Links

- [x] `public/.well-known/README.md` exists.
- [x] `assetlinks.json` is intentionally not created yet.
- [x] README documents the need for Android package name and SHA-256 fingerprint.
- [x] Planned package name is `com.satomi.finance`.

## Local Verification

- [x] `npm run lint` passed on 2026-06-04.
- [x] `npm run build` passed on 2026-06-04.

## Manual Production Checks Remaining

- [ ] Run Lighthouse PWA audit on production HTTPS.
- [ ] Verify Android Chrome installability.
- [ ] Verify installed PWA opens at `/dashboard`.
- [ ] Verify status bar/theme color in installed PWA.
- [ ] Verify offline navigation fallback in installed PWA.
- [ ] Verify final icons on Android launcher and splash surfaces.
