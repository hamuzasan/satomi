# SATOMI Stitch Analysis

Source material:
- Visual source of truth: `design-reference/stitch-export/pages/*/screen.png`
- Structure reference only: `design-reference/stitch-export/pages/*/code.html`
- Do not copy Stitch HTML directly. Rebuild with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, and lucide-react icons.
- Keep all UI copy in Bahasa Indonesia. Some Stitch HTML still contains English labels; translate those during implementation.

## Export Coverage

`docs/STITCH_PAGES.md` lists 29 folders. 28 folders contain both `code.html` and `screen.png`. The folder `satomi_cyber_premium` is listed but currently has no `code.html` or `screen.png`, so it should not drive implementation until assets are added.

## Available Screens

| Stitch folder | Screen type | Visual notes |
| --- | --- | --- |
| `beranda_satomi` | Landing page, older narrow variant | Long marketing page with chat-first hero, problem cards, Smart Pockets preview, CTA sections. Use as secondary reference only. |
| `beranda_satomi_modern_refined` | Landing page, refined variant | Preferred landing reference. Wider mobile capture, stronger premium layout, glass preview card, cyan/purple glow, problem cards, Smart Pockets section, final CTA. |
| `masuk` | Login | Centered auth glass card, SATOMI logo mark, email/password fields, remember checkbox, forgot password link, cyan primary CTA, Google outline CTA. |
| `daftar_akun` | Register | Same auth card language as login, with name/email/password/confirm fields, terms checkbox, cyan register CTA, login link. |
| `lupa_password` | Forgot password | Reset card with SATOMI brand header, email field, send-link CTA, sent-state panel, back action. |
| `onboarding_profil` | Onboarding intro/profile | Logo-orb intro, then user profile prompt. Mobile full-screen setup flow. |
| `onboarding_tujuan_persona` | Onboarding goal/persona step | Goal-selection cards, step indicator, selected cyan state, persona setup controls. |
| `onboarding_smart_pockets` | Onboarding Smart Pockets step | Income input, allocation setup, completion/loading state. |
| `dashboard_satomi` | Dashboard, populated | Main app layout with top app header, budget summary, AI quick chat, Smart Pockets grid, spending trend, activity list, goal card, bottom nav. |
| `dashboard_belum_ada_data` | Dashboard empty state | Grid background, central empty glass card, icon orb, primary/secondary actions. |
| `dashboard_memuat` | Dashboard loading state | Skeleton dashboard with glowing message chip and bottom nav skeleton. |
| `dashboard_gagal_dimuat` | Dashboard error state | Centered error card with warm red tone, reload CTA, secondary history CTA. |
| `memuat_data` | Global loading state | Blurred app background with centered glowing orb/spinner and large loading message. |
| `chat_ai_logging_transaksi` | Chat transaction logging | Chat layout with bot greeting, user/AI bubbles, transaction preview card, suggestion chips, sticky composer, bottom nav. |
| `chat_ai_nudge_warning_state` | Chat warning/nudge state | Same chat layout plus red warning analysis card for over-budget transaction, action buttons. |
| `riwayat_transaksi` | Transactions history | Stats grid, search/filter chips, grouped transaction cards, load-more CTA, bottom nav. |
| `smart_pockets` | Smart Pockets list | Page title, add/recommend buttons, monthly summary card, SATOMI insight panel, active pocket cards, bottom nav. |
| `detail_pocket_self_reward` | Pocket detail | Back/header, edit action, large circular usage meter, SATOMI insight, trend card, recent transactions, bottom nav. |
| `tujuan_finansial` | Goals list | Add/strategy CTAs, featured goal card with ring progress and insight, smaller goal cards, bottom nav. |
| `detail_goal_dana_jepang` | Goal detail | Large circular goal progress, stat cards, strategy card, milestones timeline, funding source cards, recent activity. |
| `tagihan_langganan` | Bills/subscriptions | Back/header, AI insight card, bill stats, bill list with pay/mark-paid actions, bottom nav. |
| `insight_keuangan` | Financial insights | Insight recommendation, category breakdown, weekly trend, comparison card, nudge history. |
| `pengaturan` | Settings home/profile | Profile hero card, grouped settings list, AI persona/preference/security rows, logout button, bottom nav. |
| `persona_satomi` | AI persona settings | Persona option cards, sliders/behavior controls, live preview, save action. Translate English helper copy. |
| `privasi_data` | Privacy/data settings | Data export/archive cards, AI transparency items, chat history controls, destructive data deletion zone. |
| `deteksi_transaksi_otomatis` | Notification/intercept permission | Permission explanation, privacy commitment, detection source cards, enable/later actions. |
| `halaman_tidak_ditemukan_404` | Not found | Full-screen 404 with glowing SATOMI orb and primary return action. |
| `satomi_logo` | Logo asset reference | Circular SATOMI star/orb logo mark only, useful for auth/onboarding/empty/loading states. |
| `satomi_cyber_premium` | Missing export | Listed in docs but no files are present. Treat as unavailable. |

## Route Mapping

| Stitch folder | Next.js route | Implementation role |
| --- | --- | --- |
| `beranda_satomi_modern_refined` | `/` | Primary landing page reference. |
| `beranda_satomi` | `/` | Secondary/older landing reference; do not implement separately. |
| `masuk` | `/login` | Login page. |
| `daftar_akun` | `/register` | Register page. |
| `lupa_password` | `/forgot-password` | Forgot/reset password page. |
| `onboarding_profil` | `/onboarding` | Step 1: intro/profile. |
| `onboarding_tujuan_persona` | `/onboarding` | Step 2: financial goal and persona. Use local step state or query params, not separate public route unless needed. |
| `onboarding_smart_pockets` | `/onboarding` | Step 3: Smart Pockets allocation and completion. |
| `dashboard_satomi` | `/dashboard` | Default populated dashboard. |
| `dashboard_belum_ada_data` | `/dashboard` | Empty state variant. |
| `dashboard_memuat` | `/dashboard/loading.tsx` or dashboard skeleton state | Loading variant. |
| `dashboard_gagal_dimuat` | `/dashboard` error state or `error.tsx` | Dashboard error variant. |
| `memuat_data` | Global `loading.tsx` or shared full-page loader | Global app loading state. |
| `chat_ai_logging_transaksi` | `/chat` | Default chat transaction logging state. |
| `chat_ai_nudge_warning_state` | `/chat` | Nudge/warning state after transaction detection. |
| `riwayat_transaksi` | `/transactions` | Transaction history. |
| `smart_pockets` | `/pockets` | Pocket list/overview. |
| `detail_pocket_self_reward` | `/pockets/[id]` | Pocket detail. |
| `tujuan_finansial` | `/goals` | Goals list/overview. |
| `detail_goal_dana_jepang` | `/goals/[id]` | Goal detail. |
| `tagihan_langganan` | `/bills` | Bills and subscriptions. |
| `insight_keuangan` | `/insights` | Insights and nudge history. |
| `pengaturan` | `/settings` | Settings home/profile. |
| `persona_satomi` | `/settings/persona` | AI persona settings. |
| `privasi_data` | `/settings/privacy` | Privacy and data settings. |
| `deteksi_transaksi_otomatis` | `/settings/notification-intercept` | Permission and notification transaction detection. |
| `halaman_tidak_ditemukan_404` | `not-found.tsx` | App-level 404. |
| `satomi_logo` | Shared asset/component | Logo mark, no route. |
| `satomi_cyber_premium` | None until files exist | Missing export. |

## Design System

### Colors

Use a dark neon fintech palette, not a bright banking palette.

Core tokens seen repeatedly:
- Background: `#050508`, `#020617`, `#0e0e12`, `#131317`
- Surface/card: `#131317`, `#1b1b1f`, `#1f1f23`, `#2a292e`, `#353439`
- Primary cyan: `#00f0ff`, `#00dbe9`, `#7df4ff`, pale `#dbfcff`
- Secondary purple/magenta: `#cf5cff`, `#ecb2ff`, deep `#480063`, `#74009f`
- Text primary: `#e5e1e7`, `#faf4ff`
- Text muted: `#b9cacb`, `#849495`
- Outline: `#3b494b`, with many borders using white/5, white/10, cyan/20, cyan/30
- Error/warning: `#ffb4ab`, `#93000a`, `#690005`
- Status accents: green `#10b981`/`#34d399`, amber `#f59e0b`/`#fbbf24`

Visual treatment:
- Cyan is the primary action and active navigation color.
- Purple/pink is used for reward/persona/secondary emphasis and gradient progress.
- Error cards are warm red/pink and glow subtly.
- Avoid large flat single-color panels. Most surfaces have dark translucent fills plus border/glow.

### Typography

Fonts from Stitch:
- Display/headline: Plus Jakarta Sans, weight 700-800.
- Body: Manrope, weight 400-600.
- Labels/metadata: JetBrains Mono, weight 500-700.

Type behavior:
- Page titles: large Plus Jakarta Sans, 32px mobile / 40px desktop, tight line height.
- Brand wordmark: Plus Jakarta Sans, bold, cyan glow.
- Data numbers: large bold Plus Jakarta Sans, often 32-64px depending on context.
- Section labels: JetBrains Mono, uppercase, 10-12px, increased letter spacing.
- Body copy: Manrope, 14-16px, relaxed line height.
- Implementation note: Tailwind config should avoid viewport-scaled font sizes. Keep responsive sizes token-based.

### Spacing

Observed layout rhythm:
- Mobile page padding: 16px to 20px.
- Main vertical gap: 24px.
- Card padding: 16px for compact cards, 20-24px for major cards, 32px+ for auth/empty cards.
- Header height: about 64px.
- Bottom nav reserve: 88-100px including safe-area padding.
- Desktop content max: about 1280px with 64px side margin and 24px gutter.
- Cards commonly stack in a single mobile column; dashboard stats and pocket cards use 2-column grids where space allows.

### Card Style

Reusable card language:
- Dark translucent fill, commonly rgba black/navy at 40-80%.
- `backdrop-blur-xl` or stronger for glass cards.
- Border radius: 16px for smaller list cards, 24px for major cards, up to 32px for featured/side panels.
- Border: 1px solid muted white/outline or cyan/purple tint.
- Highlight edge: many cards use brighter top/left border, especially cyan.
- Glow: soft cyan/purple shadow, stronger on active/featured cards.
- Background accents: subtle radial cyan/purple blurs inside large cards.
- Do not nest decorative cards inside cards unless the inner panel is a functional subcomponent such as an insight preview.

### Button Style

Button families:
- Primary: cyan filled rectangle/pill, dark text, bold mono uppercase label. Used for "Masuk", "Daftar", "Tambah Pocket", "Minta Strategi Satomi", "Catat Transaksi Pertama".
- Secondary outline: transparent/dark fill with cyan, white, or purple border. Used for "Masuk dengan Google", "Minta Rekomendasi", "Edit Profil", "Tandai Dibayar".
- Ghost/icon: bare icon buttons in header and list rows.
- Destructive: red/pink fill or outline for error actions and deletion zones.
- Chips: rounded/pill filter or suggestion controls with dark fill, border, mono label, selected state filled cyan/dark or cyan outline.

Implementation notes:
- Use lucide-react icons in buttons where available.
- Keep labels Bahasa Indonesia; translate English labels such as "EDIT POCKET", "VIEW ALL TRANSACTIONS", "Save Persona", "Institutional Mode", and persona helper text.
- Buttons should be stable in height; avoid text wrapping inside compact buttons.

### Navigation Style

Mobile:
- Fixed top app header with left utility icon, centered/left SATOMI wordmark, right notification icon.
- Fixed bottom nav with dark translucent rounded top bar, safe-area padding, five items.
- Common bottom items: Dashboard, Chat, Catat, Pockets, Profil. Some screens use Riwayat instead of Catat depending on context; standardize deliberately.
- Active item is cyan with glow; inactive items use muted light gray.
- Central "Catat" add action is often emphasized with a larger cyan circular icon.

Desktop:
- Stitch includes a left AppSidebar on chat/pockets-style layouts and a desktop top nav on dashboard.
- Recommended implementation: use a single responsive `AppShell` with desktop sidebar for authenticated routes, mobile header plus bottom nav for mobile.
- Sidebar style: dark glass rail, rounded right edge, cyan brand block, mono uppercase nav labels, active item with cyan or purple left border/glow.

## Reusable Components

### AppShell

Use for authenticated app pages: `/dashboard`, `/chat`, `/transactions`, `/pockets`, `/goals`, `/bills`, `/insights`, `/settings`.

Responsibilities:
- Own ambient dark background and optional glow layers/grid texture.
- Render `AppHeader`, `AppSidebar` on desktop, and `MobileBottomNav` on mobile.
- Provide safe-area padding and bottom nav spacing.
- Constrain desktop content to the design max width.
- Accept current route/active nav item.

### AppSidebar

Reference screens: `chat_ai_logging_transaksi`, `chat_ai_nudge_warning_state`, `smart_pockets`, `tujuan_finansial`.

Content:
- SATOMI AI brand block.
- Status/version line can become Bahasa copy such as "Mode AI Aktif".
- Nav items with icons: Dashboard, Chat, Transaksi/Catat, Pockets, Riwayat, Profil.
- Active state with colored border, tinted background, and glow.

### AppHeader

Reference screens: almost every authenticated mobile screen.

Content:
- SATOMI wordmark with cyan glow.
- Optional left action: language, back, menu.
- Optional right action: notification.
- For detail pages, support back button plus compact brand.
- Sticky/fixed top with translucent surface, backdrop blur, bottom border.

### MobileBottomNav

Reference screens: dashboard, chat, pockets, goals, bills, settings, transactions.

Content:
- 4-5 item bottom nav with lucide icons.
- Active item cyan glow and filled/outlined icon variant if possible.
- Central add/catat action can be larger when the route set includes quick logging.
- Fixed bottom, rounded top corners or pill container, safe-area padding.

### GlassCard

Base card primitive for nearly every screen.

Variants:
- `default`: dark translucent, muted border, 16-24px radius.
- `featured`: stronger cyan top/left border, larger radius, internal glow.
- `warning`: red/pink border and glow.
- `interactive`: hover/active border glow.
- `empty`: centered large card with icon orb and CTAs.

### ChatBubble

Reference screens: `chat_ai_logging_transaksi`, `chat_ai_nudge_warning_state`.

Variants:
- User bubble: right aligned, cyan-tinted fill, cyan border, rounded 16-24px with one clipped corner.
- AI bubble: left aligned, dark glass fill, muted border, same clipped-corner language.
- Metadata: optional timestamp, sender label, bot icon.
- Children should allow embedded cards such as `TransactionPreviewCard` and `NudgeCard`.

### TransactionPreviewCard

Reference: `chat_ai_logging_transaksi`, landing preview cards.

Content:
- Nominal amount as dominant cyan data.
- Confidence badge.
- Type/category/pocket fields in compact grid.
- Actions: Simpan, Edit.
- Optional chips for category suggestions.
- Use as the canonical "AI detected a transaction" preview.

### NudgeCard

Reference: `chat_ai_nudge_warning_state`, dashboard AI note, goals/pockets insights.

Variants:
- Warning nudge: red/pink analysis report with budget, previous usage, current transaction, total estimate, overage.
- Insight nudge: cyan/purple card with SATOMI icon and recommendation text.
- Dashboard note: compact warning with progress bar.
- All nudge copy should be Bahasa Indonesia and concrete.

### PocketCard

Reference: `smart_pockets`, `dashboard_satomi`, `detail_pocket_self_reward`.

Content:
- Icon, title, usage percentage/status, amount/limit or target.
- Progress bar with cyan/purple/green/amber variants.
- Optional health/status chip such as "Hampir Limit" or "Stabil".
- For detail page, support circular progress variant.

### GoalCard

Reference: `tujuan_finansial`, `detail_goal_dana_jepang`, dashboard target card.

Content:
- Goal title, deadline/status chip, progress percentage, collected/target amounts.
- Featured variant uses large circular progress meter and SATOMI insight panel.
- Compact variant uses row/list layout, progress bar, overflow menu.

### BillCard

Reference: `tagihan_langganan`.

Content:
- Bill icon, name, due date, amount, status chip.
- Source pocket chip.
- Action button: Bayar, Tandai Dibayar, or disabled/lunas state.
- Support overdue/soon-paid styling with red/amber/neutral accents.

### EmptyState

Reference: `dashboard_belum_ada_data`, `halaman_tidak_ditemukan_404`.

Content:
- Large glowing orb/icon.
- Headline and short body copy in Bahasa.
- One primary CTA and optional secondary CTA.
- Variant for 404 with "Halaman tidak ditemukan".

### LoadingState

Reference: `dashboard_memuat`, `memuat_data`.

Variants:
- Full-page loading: blurred app background, glowing orb/spinner, headline "Satomi sedang membaca datamu...".
- Skeleton loading: app shell with header, glowing message chip, card skeletons, chart skeleton, nav skeleton.
- Keep the loading state dark and atmospheric, not generic gray shimmer.

## Page-Specific Notes

- Landing page should use `beranda_satomi_modern_refined` as primary. Use `beranda_satomi` only for additional copy/section confirmation.
- `dashboard_satomi` is the best source for the full mobile app composition and should anchor `AppShell`, `GlassCard`, `PocketCard`, `GoalCard`, and quick chat controls.
- `chat_ai_logging_transaksi` and `chat_ai_nudge_warning_state` together define the chat workflow: normal transaction detection plus intervention when a pocket limit is exceeded.
- `smart_pockets`, `tujuan_finansial`, `tagihan_langganan`, and `riwayat_transaksi` share the same page scaffold: header, page title, stat/insight cards, list cards, bottom nav.
- `pengaturan`, `persona_satomi`, `privasi_data`, and `deteksi_transaksi_otomatis` should be implemented as a settings group with shared row/card primitives.
- `satomi_logo` can drive a reusable `SatomiLogoMark` component, but the production version can be CSS/SVG or image-based as long as it matches the orb/star visual.

## Recommended Implementation Order

1. Create design tokens and global styles: colors, fonts, radius, shadows/glows, safe-area helpers, and dark ambient backgrounds.
2. Build shared primitives: `GlassCard`, buttons, chips, progress bars/rings, stat blocks, icon orbs, section headers.
3. Build app navigation: `AppShell`, `AppHeader`, `AppSidebar`, `MobileBottomNav`.
4. Build global states: `LoadingState`, `EmptyState`, dashboard skeleton, 404.
5. Build auth and onboarding: `/login`, `/register`, `/forgot-password`, `/onboarding`.
6. Build `/dashboard` with dummy data and dashboard empty/loading/error variants.
7. Build `/chat` with `ChatBubble`, `TransactionPreviewCard`, and `NudgeCard`.
8. Build `/transactions`, `/pockets`, and `/pockets/[id]`.
9. Build `/goals` and `/goals/[id]`.
10. Build `/bills` and `/insights`.
11. Build `/settings`, `/settings/persona`, `/settings/privacy`, and `/settings/notification-intercept`.
12. Build `/` landing page last or after the core app shell, using the refined landing export.

## Implementation Guardrails

- Use dummy data only. Do not add Supabase, auth wiring, database calls, or real AI APIs until UI approval.
- Prefer reusable React components over page-specific markup.
- Use screenshots as visual truth and HTML only to understand hierarchy, content, and repeated styling patterns.
- Translate all remaining English UI copy to Bahasa Indonesia during rebuild.
- Replace Material Symbols from Stitch with lucide-react icons where practical.
- Keep the premium AI companion feeling: dark, calm, precise, glowing, and conversational.
