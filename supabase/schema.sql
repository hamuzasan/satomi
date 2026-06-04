-- SATOMI Supabase schema
-- Phase 13: Supabase schema SQL
-- Review before running in production.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  avatar_url text,
  status text,
  language_style text not null default 'id',
  persona_style text not null default 'casual',
  nudge_intensity text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_language_style_check
    check (language_style in ('id', 'en')),
  constraint profiles_persona_style_check
    check (persona_style in ('supportive', 'firm', 'casual', 'minimal')),
  constraint profiles_nudge_intensity_check
    check (nudge_intensity in ('low', 'medium', 'high'))
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.pockets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'spending',
  budget_limit numeric(14, 2) not null default 0,
  current_amount numeric(14, 2) not null default 0,
  color text not null default 'cyan',
  icon text not null default 'wallet',
  warning_threshold numeric(5, 2) not null default 80,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pockets_id_user_id_unique unique (id, user_id),
  constraint pockets_type_check
    check (type in ('spending', 'saving', 'bill', 'emergency', 'income', 'custom')),
  constraint pockets_budget_limit_check
    check (budget_limit >= 0),
  constraint pockets_current_amount_check
    check (current_amount >= 0),
  constraint pockets_warning_threshold_check
    check (warning_threshold >= 0 and warning_threshold <= 100)
);

drop trigger if exists set_pockets_updated_at on public.pockets;
create trigger set_pockets_updated_at
before update on public.pockets
for each row execute function public.set_updated_at();

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14, 2) not null,
  type text not null,
  category text not null,
  pocket_id uuid,
  description text not null default '',
  transaction_date timestamptz not null default now(),
  source text not null default 'manual',
  confidence numeric(5, 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_id_user_id_unique unique (id, user_id),
  constraint transactions_amount_check
    check (amount > 0),
  constraint transactions_type_check
    check (type in ('income', 'expense')),
  constraint transactions_source_check
    check (source in ('chat', 'manual', 'notification')),
  constraint transactions_confidence_check
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  constraint transactions_pocket_owner_fk
    foreign key (pocket_id, user_id)
    references public.pockets (id, user_id)
    on delete set null
);

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal_type text not null default 'saving',
  target_amount numeric(14, 2) not null,
  current_amount numeric(14, 2) not null default 0,
  target_date date,
  strategy text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_id_user_id_unique unique (id, user_id),
  constraint goals_goal_type_check
    check (goal_type in ('travel', 'emergency', 'debt', 'saving', 'spending_control', 'custom')),
  constraint goals_target_amount_check
    check (target_amount > 0),
  constraint goals_current_amount_check
    check (current_amount >= 0)
);

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(14, 2) not null,
  due_date date not null,
  frequency text not null default 'monthly',
  status text not null default 'unpaid',
  pocket_id uuid,
  reminder_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bills_id_user_id_unique unique (id, user_id),
  constraint bills_amount_check
    check (amount > 0),
  constraint bills_frequency_check
    check (frequency in ('one_time', 'weekly', 'monthly', 'yearly', 'custom')),
  constraint bills_status_check
    check (status in ('unpaid', 'paid', 'scheduled', 'skipped', 'archived')),
  constraint bills_reminder_days_check
    check (reminder_days is null or reminder_days >= 0),
  constraint bills_pocket_owner_fk
    foreign key (pocket_id, user_id)
    references public.pockets (id, user_id)
    on delete set null
);

drop trigger if exists set_bills_updated_at on public.bills;
create trigger set_bills_updated_at
before update on public.bills
for each row execute function public.set_updated_at();

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_messages_id_user_id_unique unique (id, user_id),
  constraint ai_messages_role_check
    check (role in ('user', 'assistant', 'system', 'tool'))
);

create table if not exists public.ai_extractions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_input text not null,
  extracted_json jsonb not null default '{}'::jsonb,
  confidence numeric(5, 4) not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint ai_extractions_id_user_id_unique unique (id, user_id),
  constraint ai_extractions_confidence_check
    check (confidence >= 0 and confidence <= 1),
  constraint ai_extractions_status_check
    check (status in ('pending', 'proposed', 'confirmed', 'rejected', 'failed'))
);

create table if not exists public.nudges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  related_transaction_id uuid,
  related_pocket_id uuid,
  related_goal_id uuid,
  severity text not null default 'info',
  action_status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint nudges_id_user_id_unique unique (id, user_id),
  constraint nudges_type_check
    check (type in (
      'budget_warning',
      'goal_progress',
      'bill_reminder',
      'positive_reinforcement',
      'spending_trend',
      'privacy_notice'
    )),
  constraint nudges_severity_check
    check (severity in ('info', 'success', 'warning', 'critical')),
  constraint nudges_action_status_check
    check (action_status in ('new', 'seen', 'dismissed', 'acted')),
  constraint nudges_transaction_owner_fk
    foreign key (related_transaction_id, user_id)
    references public.transactions (id, user_id)
    on delete set null,
  constraint nudges_pocket_owner_fk
    foreign key (related_pocket_id, user_id)
    references public.pockets (id, user_id)
    on delete set null,
  constraint nudges_goal_owner_fk
    foreign key (related_goal_id, user_id)
    references public.goals (id, user_id)
    on delete set null
);

create table if not exists public.notification_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_name text not null,
  package_name text not null,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_sources_id_user_id_unique unique (id, user_id),
  constraint notification_sources_user_package_unique unique (user_id, package_name)
);

drop trigger if exists set_notification_sources_updated_at on public.notification_sources;
create trigger set_notification_sources_updated_at
before update on public.notification_sources
for each row execute function public.set_updated_at();

create table if not exists public.notification_candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_app text not null,
  source_package text not null,
  raw_text_sanitized text not null,
  parsed_json jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  created_transaction_id uuid,
  created_at timestamptz not null default now(),
  constraint notification_candidates_id_user_id_unique unique (id, user_id),
  constraint notification_candidates_status_check
    check (status in ('pending', 'confirmed', 'rejected')),
  constraint notification_candidates_transaction_owner_fk
    foreign key (created_transaction_id, user_id)
    references public.transactions (id, user_id)
    on delete set null
);

comment on table public.ai_extractions is
'Security-sensitive AI extraction logs. Store untrusted model proposals only. Never auto-save to transactions without server validation and user confirmation.';

comment on table public.notification_sources is
'Security-sensitive future Android notification source settings. User must explicitly choose allowed apps. Do not use this table until the Capacitor native feature exists.';

comment on table public.notification_candidates is
'Security-sensitive future notification-derived transaction candidates. Store sanitized text only. Never store OTP, PIN, password, or unrelated notification content.';

create index if not exists pockets_user_id_idx
  on public.pockets (user_id);

create index if not exists goals_user_id_idx
  on public.goals (user_id);

create index if not exists transactions_user_id_idx
  on public.transactions (user_id);

create index if not exists transactions_transaction_date_idx
  on public.transactions (transaction_date desc);

create index if not exists transactions_user_transaction_date_idx
  on public.transactions (user_id, transaction_date desc);

create index if not exists bills_user_id_idx
  on public.bills (user_id);

create index if not exists bills_due_date_idx
  on public.bills (due_date);

create index if not exists bills_user_due_date_idx
  on public.bills (user_id, due_date);

create index if not exists ai_messages_user_id_idx
  on public.ai_messages (user_id);

create index if not exists ai_extractions_user_id_idx
  on public.ai_extractions (user_id);

create index if not exists nudges_user_id_idx
  on public.nudges (user_id);

create index if not exists notification_sources_user_id_idx
  on public.notification_sources (user_id);

create index if not exists notification_candidates_user_id_idx
  on public.notification_candidates (user_id);

create index if not exists notification_candidates_status_idx
  on public.notification_candidates (status);

create index if not exists notification_candidates_user_status_idx
  on public.notification_candidates (user_id, status, created_at desc);

alter table public.profiles enable row level security;
alter table public.pockets enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.bills enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_extractions enable row level security;
alter table public.nudges enable row level security;
alter table public.notification_sources enable row level security;
alter table public.notification_candidates enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles for delete
using (id = auth.uid());

drop policy if exists "pockets_select_own" on public.pockets;
create policy "pockets_select_own"
on public.pockets for select
using (user_id = auth.uid());

drop policy if exists "pockets_insert_own" on public.pockets;
create policy "pockets_insert_own"
on public.pockets for insert
with check (user_id = auth.uid());

drop policy if exists "pockets_update_own" on public.pockets;
create policy "pockets_update_own"
on public.pockets for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "pockets_delete_own" on public.pockets;
create policy "pockets_delete_own"
on public.pockets for delete
using (user_id = auth.uid());

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
on public.transactions for select
using (user_id = auth.uid());

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
on public.transactions for insert
with check (user_id = auth.uid());

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
on public.transactions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
on public.transactions for delete
using (user_id = auth.uid());

drop policy if exists "goals_select_own" on public.goals;
create policy "goals_select_own"
on public.goals for select
using (user_id = auth.uid());

drop policy if exists "goals_insert_own" on public.goals;
create policy "goals_insert_own"
on public.goals for insert
with check (user_id = auth.uid());

drop policy if exists "goals_update_own" on public.goals;
create policy "goals_update_own"
on public.goals for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "goals_delete_own" on public.goals;
create policy "goals_delete_own"
on public.goals for delete
using (user_id = auth.uid());

drop policy if exists "bills_select_own" on public.bills;
create policy "bills_select_own"
on public.bills for select
using (user_id = auth.uid());

drop policy if exists "bills_insert_own" on public.bills;
create policy "bills_insert_own"
on public.bills for insert
with check (user_id = auth.uid());

drop policy if exists "bills_update_own" on public.bills;
create policy "bills_update_own"
on public.bills for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "bills_delete_own" on public.bills;
create policy "bills_delete_own"
on public.bills for delete
using (user_id = auth.uid());

drop policy if exists "ai_messages_select_own" on public.ai_messages;
create policy "ai_messages_select_own"
on public.ai_messages for select
using (user_id = auth.uid());

drop policy if exists "ai_messages_insert_own" on public.ai_messages;
create policy "ai_messages_insert_own"
on public.ai_messages for insert
with check (user_id = auth.uid());

drop policy if exists "ai_messages_update_own" on public.ai_messages;
create policy "ai_messages_update_own"
on public.ai_messages for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "ai_messages_delete_own" on public.ai_messages;
create policy "ai_messages_delete_own"
on public.ai_messages for delete
using (user_id = auth.uid());

drop policy if exists "ai_extractions_select_own" on public.ai_extractions;
create policy "ai_extractions_select_own"
on public.ai_extractions for select
using (user_id = auth.uid());

drop policy if exists "ai_extractions_insert_own" on public.ai_extractions;
create policy "ai_extractions_insert_own"
on public.ai_extractions for insert
with check (user_id = auth.uid());

drop policy if exists "ai_extractions_update_own" on public.ai_extractions;
create policy "ai_extractions_update_own"
on public.ai_extractions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "ai_extractions_delete_own" on public.ai_extractions;
create policy "ai_extractions_delete_own"
on public.ai_extractions for delete
using (user_id = auth.uid());

drop policy if exists "nudges_select_own" on public.nudges;
create policy "nudges_select_own"
on public.nudges for select
using (user_id = auth.uid());

drop policy if exists "nudges_insert_own" on public.nudges;
create policy "nudges_insert_own"
on public.nudges for insert
with check (user_id = auth.uid());

drop policy if exists "nudges_update_own" on public.nudges;
create policy "nudges_update_own"
on public.nudges for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "nudges_delete_own" on public.nudges;
create policy "nudges_delete_own"
on public.nudges for delete
using (user_id = auth.uid());

drop policy if exists "notification_sources_select_own" on public.notification_sources;
create policy "notification_sources_select_own"
on public.notification_sources for select
using (user_id = auth.uid());

drop policy if exists "notification_sources_insert_own" on public.notification_sources;
create policy "notification_sources_insert_own"
on public.notification_sources for insert
with check (user_id = auth.uid());

drop policy if exists "notification_sources_update_own" on public.notification_sources;
create policy "notification_sources_update_own"
on public.notification_sources for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "notification_sources_delete_own" on public.notification_sources;
create policy "notification_sources_delete_own"
on public.notification_sources for delete
using (user_id = auth.uid());

drop policy if exists "notification_candidates_select_own" on public.notification_candidates;
create policy "notification_candidates_select_own"
on public.notification_candidates for select
using (user_id = auth.uid());

drop policy if exists "notification_candidates_insert_own" on public.notification_candidates;
create policy "notification_candidates_insert_own"
on public.notification_candidates for insert
with check (user_id = auth.uid());

drop policy if exists "notification_candidates_update_own" on public.notification_candidates;
create policy "notification_candidates_update_own"
on public.notification_candidates for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "notification_candidates_delete_own" on public.notification_candidates;
create policy "notification_candidates_delete_own"
on public.notification_candidates for delete
using (user_id = auth.uid());
