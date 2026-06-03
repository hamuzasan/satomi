# SATOMI PWA + TWA Plan

SATOMI will be deployed as:
1. Next.js web app
2. PWA
3. Android app via Trusted Web Activity

## Target

The Android version should not be a normal WebView.
The target is PWA + Trusted Web Activity using Bubblewrap later.

## Current Phase

At this stage, do not create the Android project yet.

Focus only on:
- making the web app installable as PWA
- making UI mobile-first
- preparing metadata and app icons
- adding offline/loading fallback
- preparing future Digital Asset Links structure

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

Later, after the PWA is deployed and stable:
1. Generate Android project using Bubblewrap.
2. Choose Android package name:
   com.satomi.finance
3. Generate signing key.
4. Get SHA-256 signing certificate fingerprint.
5. Create assetlinks.json.
6. Host assetlinks.json at:
   /.well-known/assetlinks.json
7. Build Android App Bundle.
8. Test on Android.
9. Publish to Play Store if needed.

## Important

Do not implement backend during the PWA/TWA readiness pass.
Do not implement push notifications yet.
Do not implement notification intercept yet.
Do not create Android folder yet.