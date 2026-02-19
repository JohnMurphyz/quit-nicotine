-- ============================================
-- PROFILE EXTENSIONS (onboarding fields)
-- ============================================
alter table public.profiles
  add column if not exists nicotine_type text check (nicotine_type in ('cigarettes', 'vapes', 'pouches', 'chewing', 'multiple')),
  add column if not exists usage_per_day integer,
  add column if not exists years_used integer,
  add column if not exists daily_cost numeric(10,2),
  add column if not exists quit_date date,
  add column if not exists motivations jsonb default '[]'::jsonb,
  add column if not exists wants_lecture boolean,
  add column if not exists onboarding_completed boolean not null default false;

-- ============================================
-- CRAVINGS
-- ============================================
create table public.cravings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  intensity integer check (intensity between 1 and 10),
  trigger text check (trigger in ('stress', 'boredom', 'social', 'after_meal', 'alcohol', 'morning', 'habit', 'other')),
  note text,
  resisted boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_cravings_user on public.cravings(user_id, created_at desc);

-- ============================================
-- JOURNAL ENTRIES
-- ============================================
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mood text not null check (mood in ('great', 'good', 'okay', 'rough', 'terrible')),
  content text,
  created_at timestamptz not null default now()
);

create index idx_journal_user on public.journal_entries(user_id, created_at desc);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_key)
);

create index idx_achievements_user on public.achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.cravings enable row level security;
alter table public.journal_entries enable row level security;
alter table public.achievements enable row level security;

-- Cravings: users manage own
create policy "Users can insert own cravings"
  on public.cravings for insert
  with check (auth.uid() = user_id);

create policy "Users can read own cravings"
  on public.cravings for select
  using (auth.uid() = user_id);

create policy "Users can update own cravings"
  on public.cravings for update
  using (auth.uid() = user_id);

-- Journal: users manage own
create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can read own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

-- Achievements: users manage own
create policy "Users can insert own achievements"
  on public.achievements for insert
  with check (auth.uid() = user_id);

create policy "Users can read own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);
