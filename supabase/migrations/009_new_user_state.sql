alter table profiles
  add column if not exists goals_explicitly_set boolean not null default false,
  add column if not exists triggers text[] default '{}';
