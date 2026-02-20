-- Add title column to journal_entries
alter table public.journal_entries add column if not exists title text;

-- Add update policy for journal entries
create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

-- Add delete policy for journal entries
create policy "Users can delete own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);
