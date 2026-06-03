# SATOMI Capacitor Readiness Checklist

Last updated: 2026-06-04

Use this checklist before installing Capacitor or creating the Android wrapper.

- [x] Frontend is mobile-first.
- [x] No desktop-only interaction is required for core app routes.
- [x] No hover-only critical UI is required for audited app routes.
- [x] Bottom navigation is safe on Android-sized screens.
- [x] Chat input is safe with bottom navigation and mobile layout.
- [x] Modals and sheets work on mobile and constrain height within the viewport.
- [ ] Confirm the app runs correctly behind a Capacitor WebView.
- [x] Browser-only APIs currently used by SATOMI are isolated to client components.
- [x] PWA install prompt can be hidden in Capacitor mode through platform detection.
- [x] Service worker registration is client-only and can be disabled in Capacitor mode through platform detection.
- [x] Offline strategy does not cache sensitive finance data.
- [x] PWA/mobile app-shell readiness pass is completed locally.
- [x] Manifest, icons, offline fallback, install hint, and safe-area shell are documented in `docs/PWA_CAPACITOR_READINESS.md`.
- [x] Future native plugin boundary is documented and stable at the planning level.
- [x] API runtime strategy is documented for browser/PWA mode and Capacitor remote URL mode.
- [x] Notification Intercept UI now communicates optional usage, explicit Android permission, app filtering, confirmation-first flow, and OTP/PIN/password exclusion.
- [ ] Confirm the app runs correctly behind a Capacitor WebView.
- [ ] Make API base URL configuration explicit in runtime config when backend work begins.
- [ ] Verify browser-only assumptions again after adding real auth, API routes, and native bridge code.
- [ ] Verify service worker behavior inside a real Capacitor shell before release.
- [ ] Add a user-visible Capacitor/native runtime path for suppressing browser-only UI when the native shell exists.
- [x] Offline strategy does not cache sensitive finance data.
- [ ] Environment variables for web/native builds are documented in deployment setup.

## Notes

- SATOMI already has a mobile-first app shell, safe-area spacing, valid PWA
  metadata, offline fallback, and route layouts that are a strong base for
  Capacitor remote URL mode.
- Core authenticated routes were rechecked at approximately `360px` width during
  Phase 11.5B and no page-level horizontal overflow or tiny tap target issues
  were detected.
- A lightweight `src/lib/platform.ts` utility now exists for safe client and
  Capacitor detection without importing the Capacitor package yet.
- The largest remaining readiness gaps are production HTTPS validation, real
  WebView validation, environment/config strategy, and verifying behavior once
  native bridge code actually exists.
