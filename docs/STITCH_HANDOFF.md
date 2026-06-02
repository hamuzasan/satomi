@"
# SATOMI Stitch Handoff

The Stitch export is located at:

/design-reference/stitch-export/pages

Each folder represents one generated UI screen.

Each folder should contain:
- code.html
- screen.png

## Usage Rules for Codex

Use screen.png as the main visual source.
Use code.html only as structural reference.

Do not paste raw Stitch HTML directly into the app.
Convert the design into reusable React components using:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components

## Visual Identity

SATOMI uses:
- dark neon fintech style
- cyan and purple glow
- rounded glass cards
- premium AI companion aesthetic
- mobile-first responsive design

## Implementation Priority

1. Analyze Stitch export
2. Build design system and app shell
3. Build dashboard
4. Build chat AI and transaction preview
5. Build transactions and Smart Pockets
6. Build goals, bills, insights, settings
"@ | Set-Content -Path "docs\STITCH_HANDOFF.md" -Encoding UTF8