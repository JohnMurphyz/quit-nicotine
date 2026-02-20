-- ============================================
-- ADD PRIVACY CONTROLS TO ACCOUNTABILITY PARTNERS
-- ============================================

-- Add privacy toggles to accountability_partners table
alter table public.accountability_partners 
  add column share_pledges boolean not null default true,
  add column share_goals boolean not null default true,
  add column share_symptoms boolean not null default true;

-- Update the existing get_streak function to track the updated schema version if needed
-- (No direct dependency in get_streak on these flags, but good for tracking)

-- Notify PostgREST to reload schema
notify pgrst, 'reload schema';
