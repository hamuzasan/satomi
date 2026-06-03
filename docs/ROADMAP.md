# SATOMI Roadmap

## Phase 1: Stitch Export Analysis

Status: Completed.

Analyze the Google Stitch export, list available screens, map Stitch folders to Next.js routes, and identify reusable components and design tokens.

## Phase 2: UI Foundation

Status: Completed locally.

Set up global styling, typography, dark neon visual language, glass card primitives, layout patterns, dummy data, and shared component exports.

## Phase 3: Dashboard

Status: Completed locally with dummy data.

Build `/dashboard` using SATOMI financial summary, Smart Pockets preview, chart/insight sections, activity preview, and loading/error variants.

## Phase 4: Chat AI

Status: Completed locally as static UI.

Build `/chat` with SATOMI conversation UI, chat bubbles, transaction preview, suggestion chips, and nudge/warning state. No real AI extraction yet.

## Phase 5: Transactions

Status: Completed locally with dummy data.

Build `/transactions` for history, search/filter-style UI, grouped transaction cards, and static summaries.

## Phase 6: Smart Pockets

Status: Completed locally with dummy data.

Build `/pockets` and `/pockets/[id]` for pocket overview, allocation/usage states, insights, and detail activity.

## Phase 7: Goals

Status: Completed locally with dummy data.

Build `/goals` and `/goals/[id]` for goal progress, funding strategy, milestones, and activity.

## Phase 8: Bills and Insights

Status: Completed locally with dummy data.

Build `/bills` and `/insights` for subscriptions, bill monitoring, financial insights, trends, and nudge history.

## Phase 9: Auth, Onboarding, Settings, Error States

Status: Completed locally as static UI.

Build `/login`, `/register`, `/forgot-password`, `/onboarding`, `/settings`, `/settings/persona`, `/settings/privacy`, `/settings/notification-intercept`, `/help`, `loading.tsx`, `error.tsx`, and `not-found.tsx`.

## Phase 10: UI Polish

Status: Partially completed.

Polish responsiveness, safe-area spacing, glassmorphism consistency, Bahasa copy, navigation behavior, and reusable component extraction.

## Phase 11: Static Frontend Deploy

Status: Not verified.

Deploy the static frontend to production HTTPS and verify all core routes. Current local implementation appears ready for verification, but production deployment is not confirmed in this repository.

## Phase 11.5: PWA + Android Readiness Planning

Status: Prepared locally, pending production audit.

Add and verify manifest, service worker, offline fallback, app icons, safe-area metadata, app-like navigation, and `.well-known` placeholder. Current files exist locally, but Lighthouse/PWA validation and production testing remain.

## Phase 12: Supabase Backend

Status: Not started.

Add Supabase only after UI and PWA readiness are approved. Define schema for users, transactions, pockets, goals, bills, settings, and chat-derived records.

## Phase 13: AI Transaction Extraction

Status: Not started.

Add AI extraction after transaction CRUD is stable. Parse casual Indonesian financial chat into transaction fields with confirmation/edit UX.

## Phase 14: Full Chat-to-Save Flow

Status: Not started.

Connect chat extraction, transaction preview, user confirmation, transaction persistence, pocket allocation, and nudge generation.

## Phase 15: Testing and Final Deploy

Status: Not started.

Add automated tests, manual QA, responsive audits, PWA audits, security/privacy checks, and final deployment hardening.

## Phase 16: Android Packaging

Status: Not started.

Android packaging now has two paths:
- Capacitor is the preferred path when native Android features are needed.
- TWA remains an optional fallback path for lighter PWA-based distribution.

## Phase 16A: Capacitor Readiness

Status: Not started.

Audit the current frontend for Capacitor compatibility, including mobile layout,
browser API assumptions, service worker behavior, environment configuration, and
plugin boundaries.

## Phase 16B: Add Capacitor Android Wrapper

Status: Not started.

Install Capacitor, generate the Android wrapper, connect the built frontend, and
confirm the app boots correctly inside an Android WebView shell.

## Phase 16C: Build Custom Notification Listener Plugin

Status: Not started.

Implement a custom Capacitor Android plugin backed by
`NotificationListenerService` for user-approved financial notification intake.

## Phase 16D: Smart Notification Intercept UI Integration

Status: Not started.

Connect native notification candidates to SATOMI's web UI as pending transaction
previews that require user confirmation before saving.

## Phase 16E: Android QA and Play Store Review Preparation

Status: Not started.

Run Android device QA, permission and privacy review, policy review for
notification access, and release-readiness checks before store submission.

## Phase 16T: Optional TWA Wrapper Using Bubblewrap

Status: Not started.

If needed, keep a TWA path available after stable HTTPS deployment and PWA
validation, including package name, signing key, SHA-256 fingerprint, and
`assetlinks.json`.
