-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  timezone text not null default 'UTC',
  invite_code uuid not null default uuid_generate_v4() unique,
  role text not null default 'user' check (role in ('user', 'guest')),
  linked_to uuid references public.profiles(id),
  push_token text,
  subscription_status text not null default 'none' check (subscription_status in ('none', 'active', 'expired', 'trial')),
  subscription_platform text,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ============================================
-- STREAK CONFIRMATIONS
-- ============================================
create table public.streak_confirmations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  confirmed_date date not null,
  confirmed_at timestamptz not null default now(),
  unique(user_id, confirmed_date)
);

-- Index for streak queries
create index idx_streak_confirmations_user_date
  on public.streak_confirmations(user_id, confirmed_date desc);

-- ============================================
-- ACCOUNTABILITY PARTNERS
-- ============================================
create table public.accountability_partners (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  unique(user_id, partner_id)
);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('ios', 'android', 'web')),
  external_id text not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger on_subscription_updated
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ============================================
-- GET STREAK FUNCTION
-- ============================================
create or replace function public.get_streak(p_user_id uuid)
returns json as $$
declare
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_last_confirmed date;
  v_user_tz text;
  v_today date;
  v_check_date date;
  v_temp_streak integer := 0;
  rec record;
begin
  -- Get user timezone
  select timezone into v_user_tz from public.profiles where id = p_user_id;
  v_user_tz := coalesce(v_user_tz, 'UTC');

  -- Today in user's timezone
  v_today := (now() at time zone v_user_tz)::date;

  -- Get last confirmed date
  select confirmed_date into v_last_confirmed
  from public.streak_confirmations
  where user_id = p_user_id
  order by confirmed_date desc
  limit 1;

  if v_last_confirmed is null then
    return json_build_object(
      'current_streak', 0,
      'longest_streak', 0,
      'last_confirmed', null,
      'confirmed_today', false
    );
  end if;

  -- Calculate current streak (walking backwards from today)
  v_check_date := v_today;

  -- If today is not confirmed, start from yesterday
  if not exists (
    select 1 from public.streak_confirmations
    where user_id = p_user_id and confirmed_date = v_today
  ) then
    v_check_date := v_today - 1;
  end if;

  loop
    exit when not exists (
      select 1 from public.streak_confirmations
      where user_id = p_user_id and confirmed_date = v_check_date
    );
    v_current_streak := v_current_streak + 1;
    v_check_date := v_check_date - 1;
  end loop;

  -- If today is not confirmed and yesterday is not confirmed, streak is 0
  if v_current_streak = 0 then
    v_current_streak := 0;
  end if;

  -- Calculate longest streak by walking all confirmations
  v_temp_streak := 0;
  for rec in
    select confirmed_date
    from public.streak_confirmations
    where user_id = p_user_id
    order by confirmed_date asc
  loop
    if v_temp_streak = 0 then
      v_temp_streak := 1;
    elsif rec.confirmed_date = v_check_date + 1 then
      v_temp_streak := v_temp_streak + 1;
    else
      v_temp_streak := 1;
    end if;
    v_check_date := rec.confirmed_date;
    if v_temp_streak > v_longest_streak then
      v_longest_streak := v_temp_streak;
    end if;
  end loop;

  -- Ensure longest is at least current
  if v_current_streak > v_longest_streak then
    v_longest_streak := v_current_streak;
  end if;

  return json_build_object(
    'current_streak', v_current_streak,
    'longest_streak', v_longest_streak,
    'last_confirmed', v_last_confirmed,
    'confirmed_today', exists (
      select 1 from public.streak_confirmations
      where user_id = p_user_id and confirmed_date = v_today
    )
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.streak_confirmations enable row level security;
alter table public.accountability_partners enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users read/update own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Profiles: guests can read linked user's profile
create policy "Guests can read linked user profile"
  on public.profiles for select
  using (
    id in (
      select user_id from public.accountability_partners
      where partner_id = auth.uid() and status = 'active'
    )
  );

-- Profiles: anyone can read a profile by invite_code (for invite flow)
create policy "Anyone can look up profile by invite code"
  on public.profiles for select
  using (true);
  -- Note: In production, restrict columns via a view or function

-- Streak confirmations: users insert own
create policy "Users can insert own confirmations"
  on public.streak_confirmations for insert
  with check (auth.uid() = user_id);

-- Streak confirmations: users read own
create policy "Users can read own confirmations"
  on public.streak_confirmations for select
  using (auth.uid() = user_id);

-- Streak confirmations: guests read linked user's confirmations
create policy "Guests can read linked user confirmations"
  on public.streak_confirmations for select
  using (
    user_id in (
      select ap.user_id from public.accountability_partners ap
      where ap.partner_id = auth.uid() and ap.status = 'active'
    )
  );

-- No UPDATE or DELETE on streak_confirmations (immutable)

-- Accountability partners: users manage own
create policy "Users can read own partnerships"
  on public.accountability_partners for select
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can insert partnerships"
  on public.accountability_partners for insert
  with check (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can update own partnerships"
  on public.accountability_partners for update
  using (auth.uid() = user_id);

-- Subscriptions: users read own
create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);
