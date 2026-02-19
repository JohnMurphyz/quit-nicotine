-- Add usage_details JSON column to profiles
alter table public.profiles
  add column if not exists usage_details jsonb;
