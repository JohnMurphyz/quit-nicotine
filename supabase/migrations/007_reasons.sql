-- Reasons for change — simple text entries
create table public.reasons (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  emoji text not null default '💪',
  created_at timestamptz not null default now()
);

create index idx_reasons_user on public.reasons(user_id, created_at desc);

alter table public.reasons enable row level security;

create policy "Users can insert own reasons"
  on public.reasons for insert
  with check (auth.uid() = user_id);

create policy "Users can read own reasons"
  on public.reasons for select
  using (auth.uid() = user_id);

create policy "Users can update own reasons"
  on public.reasons for update
  using (auth.uid() = user_id);

create policy "Users can delete own reasons"
  on public.reasons for delete
  using (auth.uid() = user_id);
