# SATOMI PWA Audit Checklist

Use this checklist before packaging SATOMI as a Trusted Web Activity.

## Web App

- [ ] Manifest exists at `/manifest.webmanifest`.
- [ ] Manifest uses `display: standalone`.
- [ ] Manifest uses `start_url: /dashboard`.
- [ ] Manifest has portrait orientation.
- [ ] Manifest has dark SATOMI theme and background colors.
- [ ] Icons exist:
  - [ ] `/icons/icon-192.png`
  - [ ] `/icons/icon-512.png`
  - [ ] `/icons/maskable-icon-192.png`
  - [ ] `/icons/maskable-icon-512.png`
- [ ] Final production icons replace placeholders if needed.
- [ ] Service worker is registered.
- [ ] Offline fallback works at `/offline.html`.
- [ ] Dynamic finance/auth/API responses are not aggressively cached.

## Mobile Layout

- [ ] `/dashboard` has no horizontal scroll at 360px width.
- [ ] `/chat` has no horizontal scroll at 360px width.
- [ ] Chat input does not collide with Android gesture navigation.
- [ ] Mobile transaction preview sheet does not overlap the composer.
- [ ] `/transactions` has no horizontal scroll at 360px width.
- [ ] `/pockets` has no horizontal scroll at 360px width.
- [ ] `/goals` has no horizontal scroll at 360px width.
- [ ] `/bills` has no horizontal scroll at 360px width.
- [ ] `/insights` has no horizontal scroll at 360px width.
- [ ] `/settings` has no horizontal scroll at 360px width.
- [ ] Bottom navigation respects safe-area padding.
- [ ] Mobile modals/sheets scroll within the viewport.
- [ ] Tap targets are comfortable on mobile.

## Browser PWA Validation

- [ ] Run Lighthouse PWA check in Chrome.
- [ ] App is installable on Android Chrome.
- [ ] Installed PWA opens at `/dashboard`.
- [ ] Installed PWA uses the dark theme color/status bar.
- [ ] Offline reload shows SATOMI offline fallback.
- [ ] No generic browser offline page appears for navigations.

## Production/TWA

- [ ] Production HTTPS URL is deployed and stable.
- [ ] Production manifest URL is reachable.
- [ ] Production service worker URL is reachable.
- [ ] Production offline fallback URL is reachable.
- [ ] Digital Asset Links are pending until Android signing data exists.
- [ ] `assetlinks.json` is not guessed.
- [ ] Planned package name is `com.satomi.finance`.
- [ ] Bubblewrap project is pending.
- [ ] Android signing key is pending.
- [ ] SHA-256 signing certificate fingerprint is pending.
- [ ] TWA launch is tested on a physical Android device.
