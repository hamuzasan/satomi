@"
# SATOMI Development Instructions

SATOMI is an AI-powered personal finance management web app.

## Tech Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- lucide-react icons
- Recharts for charts

## Stitch Export

The Stitch export is stored in:

/design-reference/stitch-export/pages

Each page folder contains:
- code.html
- screen.png

Use:
1. screen.png as the visual source of truth.
2. code.html as layout and structure reference.
3. Do not copy raw Stitch HTML directly.
4. Rebuild UI as reusable React/TypeScript components.

## Design Direction

SATOMI must keep:
- dark neon futuristic fintech style
- deep navy / black / purple background
- cyan and purple glow
- glassmorphism cards
- rounded cards
- premium AI companion feeling
- mobile-first responsive layout

Do not create generic finance dashboard styling.
Do not use bright banking UI.
Do not use anime characters.
Do not use English UI copy unless unavoidable.

## Language

All UI text must be in Bahasa Indonesia.

## Core Pages

Implement gradually:
- /
- /login
- /register
- /forgot-password
- /onboarding
- /dashboard
- /chat
- /transactions
- /pockets
- /pockets/[id]
- /goals
- /goals/[id]
- /bills
- /insights
- /settings
- /settings/persona
- /settings/privacy
- /settings/notification-intercept
- /help

## Core Components

Create reusable components:
- AppShell
- AppSidebar
- AppHeader
- MobileBottomNav
- GlassCard
- StatCard
- PageTitle
- ChatBubble
- TransactionPreviewCard
- NudgeCard
- PocketCard
- GoalCard
- BillCard
- EmptyState
- LoadingState
## Future Android Target: PWA + Trusted Web Activity

SATOMI will later be packaged as an Android app using Progressive Web App + Trusted Web Activity.

The frontend must be built with TWA readiness in mind.

Requirements:
- mobile-first layout
- installable PWA
- responsive on small Android screens
- touch-friendly UI
- no hover-only interactions
- no desktop-only navigation dependency
- safe area support for fullscreen mobile mode
- app-like navigation
- stable loading, error, and offline states
- dark theme status bar and theme color
- web app manifest
- app icons
- service worker
- offline fallback page

Avoid:
- tiny tap targets
- fixed widths that overflow mobile
- modals that break on mobile
- desktop-only hover menus
- pages that show blank screen when offline
- UI that depends on browser address bar

TWA later requires:
- production HTTPS URL
- valid manifest
- service worker
- Digital Asset Links
- Android package name
- SHA-256 signing certificate fingerprint
- assetlinks.json hosted at /.well-known/assetlinks.json
## Important Rule

Use dummy data first.
Do not implement Supabase, authentication, database, or real AI API until UI is approved.
"@ | Set-Content -Path "AGENTS.md" -Encoding UTF8