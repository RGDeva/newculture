-- NewCulture applications table
-- Run this in Supabase SQL editor once per project.

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- identity
  full_name text not null,
  email text not null,
  artist_name text not null,
  role text not null,

  -- work
  music_links text[] not null default '{}',
  stage text not null,
  target_release_date date,

  -- needs
  support_areas text[] not null default '{}',
  engagement text not null,
  assets text not null,
  timeframe text not null,
  bottleneck text not null,

  -- budget / timing
  budget text not null,
  ready_thirty_days boolean not null,
  notes text,

  -- scoring
  score int not null default 0,
  tier text not null default 'light',

  -- attribution
  offer text,
  interest text,

  -- ops
  status text not null default 'new',  -- new | reviewing | booked | archived
  reviewed_at timestamptz,
  reviewer_notes text
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

create index if not exists applications_tier_idx
  on public.applications (tier);

create index if not exists applications_status_idx
  on public.applications (status);

-- Row Level Security
-- Anonymous users (the public site) can INSERT only.
-- Reads happen server-side or via the service role key.
alter table public.applications enable row level security;

drop policy if exists "anon can insert applications" on public.applications;
create policy "anon can insert applications"
  on public.applications
  for insert
  to anon
  with check (true);

-- Grant admin reads via authenticated role (swap for your own auth setup).
drop policy if exists "authenticated can read applications" on public.applications;
create policy "authenticated can read applications"
  on public.applications
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated can update applications" on public.applications;
create policy "authenticated can update applications"
  on public.applications
  for update
  to authenticated
  using (true)
  with check (true);
