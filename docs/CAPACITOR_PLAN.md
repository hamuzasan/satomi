# SATOMI Capacitor Plan

Last updated: 2026-06-03

## Direction

SATOMI will target Android using Capacitor.

Trusted Web Activity remains optional as a fallback path for PWA-style
distribution, but Capacitor is now the preferred Android target because SATOMI
may require native Android features.

The web frontend must remain usable as:

- a normal website
- an installable PWA
- a Capacitor-wrapped Android app later

SATOMI should not become Android-only. The same Next.js frontend remains the
main product surface.

## Core Decision

- Capacitor is preferred because SATOMI may need native Android features,
  especially reading transaction notifications from selected e-wallet or banking
  apps.
- The Android app will wrap the built Next.js frontend.
- Native features should be added through Capacitor plugins, not through fragile
  WebView hacks.

## Delivery Model

Planned packaging path:

1. Next.js frontend remains the source of truth.
2. Frontend stays mobile-first and responsive.
3. PWA remains supported for the open web.
4. Capacitor later wraps the production-ready frontend for Android delivery.
5. Native Android integrations are exposed through well-defined plugin
   boundaries.

## Web Frontend Requirements For Capacitor

The frontend should remain safe for Capacitor embedding:

- Mobile-first layout on small Android screens.
- No desktop-only navigation dependency.
- No hover-only critical action.
- Safe-area-aware spacing.
- Keyboard-safe chat composer and bottom navigation.
- No hard dependency on browser install prompts inside the app shell.
- No hard assumption that the app runs in a normal browser tab.
- API base URLs and environment-sensitive configuration must remain explicit.

## Future Android Notification Reading Architecture

Planned architecture:

`SATOMI Web UI`
-> `Capacitor bridge`
-> `Custom Android plugin`
-> `NotificationListenerService`
-> `explicit user Notification Access permission`
-> `parse notification payload`
-> `send detected transaction candidate to web layer`
-> `show TransactionPreviewCard`
-> `user confirms`
-> `save transaction`

## Confirmation And Safety Rules

- Do not auto-save transactions from notifications.
- Always show a transaction preview and ask for user confirmation.
- Let users choose allowed source apps.
- Let users disable notification reading anytime.
- Do not read OTP, password, or PIN content.
- Do not collect unrelated notifications.
- Store minimal data only.
- Prefer local parsing where possible.

## Why TWA Still Matters

TWA still has value as a fallback when SATOMI only needs PWA distribution
without native integrations. It should remain documented because:

- it is still useful for a web-first distribution model
- it can be a lighter Android packaging path
- it may still be appropriate for a limited-scope release

But once SATOMI needs native notification reading or similar Android features,
Capacitor is the better primary path.

## What Not To Do Yet

This planning pass does not:

- install Capacitor
- create an `android/` folder
- implement native notification reading
- implement backend
- implement AI extraction

## Recommended Next Step

Perform a Capacitor readiness audit before installing Capacitor.
