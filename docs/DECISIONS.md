# SATOMI Decisions

This document records project decisions recovered from the repository and current instructions.

## Product and Implementation Decisions

- SATOMI is frontend-first because the highest risk is UX, AI chat flow, and Smart Pockets interaction, not database CRUD.
- Use dummy data first until the UI is approved.
- Backend Supabase comes after static frontend and PWA readiness.
- Real AI extraction comes after transaction CRUD is stable.
- Do not implement Supabase, real authentication, database persistence, or real AI APIs during the static UI phase.

## Design Source Decisions

- The Google Stitch export is the source of visual truth.
- Stitch screenshots (`screen.png`) are the primary visual reference.
- Stitch HTML (`code.html`) is only a layout and structure reference.
- Raw Stitch HTML must not be copied directly into the app.
- UI must be rebuilt as clean reusable React/TypeScript components.

## Language and Brand Decisions

- All UI text should be in Bahasa Indonesia.
- SATOMI must keep a dark neon futuristic fintech identity.
- The visual style should use deep navy, black, purple, cyan glow, purple glow, glassmorphism cards, rounded cards, and a premium AI companion feeling.
- SATOMI should not become a generic bright banking dashboard.
- SATOMI should not use anime characters.

## Frontend Stack Decisions

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use shadcn/ui-style component patterns.
- Use lucide-react icons.
- Use Recharts for charts.
- Keep implementation mobile-first and responsive.

## Android and PWA Decisions

- SATOMI should remain a web-first product: website first, PWA-ready, and Android-ready.
- The frontend must remain mobile-first, safe-area aware, touch-friendly, installable as a PWA, and usable in fullscreen mobile mode.
- Capacitor is preferred over TWA for Android if native features are required.
- Reason: TWA is good for PWA distribution, but Capacitor gives access to native APIs through plugins.
- TWA remains optional as a fallback distribution path.
- SATOMI should remain usable as a normal website and PWA even if Capacitor becomes the main Android wrapper.
- Add Digital Asset Links only after the production Android package name and SHA-256 signing certificate fingerprint are known.
- Do not create the Android TWA wrapper until the web app is deployed over stable HTTPS and passes PWA checks.
- Smart Notification Intercept will require a custom Android plugin and explicit user permission.
- Notification-detected transactions must require user confirmation before saving.
- Native Android features should be added through Capacitor plugins instead of fragile WebView hacks.

## Current Recovery Decisions

- Treat the current repository as an existing project, not a fresh scaffold.
- Do not implement new UI, backend, Supabase, AI API, PWA features, or Android features during the recovery pass.
- Document missing or incomplete files clearly instead of guessing.
