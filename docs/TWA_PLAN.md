# SATOMI TWA Fallback Plan

Last updated: 2026-06-03

SATOMI may still support Trusted Web Activity, but TWA is now an optional
fallback path rather than the preferred Android target.

## Packaging Direction

SATOMI deployment paths are now:

1. Next.js web app
2. PWA
3. Android app via Capacitor as the preferred native wrapper
4. Android app via Trusted Web Activity as an optional fallback

## Why TWA Is No Longer Primary

TWA is useful for PWA-style Android distribution, but it is less suitable once
SATOMI needs native Android features such as notification-based transaction
intake.

Capacitor is now preferred because:

- native Android APIs can be exposed through plugins
- the web frontend can still remain the main product surface
- Android-specific features can be added without relying on fragile WebView
  workarounds

## When TWA Still Makes Sense

TWA remains a valid fallback when:

- SATOMI only needs web/PWA distribution
- native plugins are not required
- the goal is a lighter Android packaging path

## Current Phase

At this stage, do not create the Android project yet.

Focus only on:

- keeping the web app installable as a PWA
- keeping the UI mobile-first
- keeping metadata and icons production-ready
- preserving offline/loading fallback quality
- preparing for Capacitor readiness first
- preserving Digital Asset Links planning only if the TWA fallback is later used

## Required Web/PWA Features

- HTTPS production deployment
- web app manifest
- app icons
- maskable icon
- theme color
- background color
- standalone display mode
- portrait orientation
- service worker registration
- offline fallback page
- mobile bottom navigation
- responsive layout
- accessible tap targets
- no hover-only interactions

## Future TWA Requirements

If SATOMI later needs the TWA fallback after the PWA is deployed and stable:

1. Generate Android project using Bubblewrap.
2. Choose Android package name:
   `com.satomi.finance`
3. Generate signing key.
4. Get SHA-256 signing certificate fingerprint.
5. Create `assetlinks.json`.
6. Host `assetlinks.json` at `/.well-known/assetlinks.json`.
7. Build Android App Bundle.
8. Test on Android.
9. Publish to Play Store if needed.

## Important

Do not implement backend during Android packaging planning.
Do not implement push notifications yet.
Do not implement native notification reading yet.
Do not create the Android folder yet.
Do not treat TWA as the default Android path.
