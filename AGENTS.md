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

## Important Rule

Use dummy data first.
Do not implement Supabase, authentication, database, or real AI API until UI is approved.
"@ | Set-Content -Path "AGENTS.md" -Encoding UTF8