alter table public.profiles
  add column if not exists readiness_level integer,
  add column if not exists destroyed_products boolean,
  add column if not exists acknowledged_law_of_addiction boolean default false,
  add column if not exists specific_benefit text,
  add column if not exists support_person text;
