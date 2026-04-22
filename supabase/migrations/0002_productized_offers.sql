-- NewCulture productized offers tables

-- Mix & Master orders
create table if not exists public.mix_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  email text not null,
  artist_name text not null,
  track_name text not null,
  file_name text,
  file_url text,
  genres text[] not null default '{}',
  reference_track text,
  notes text,
  
  price int not null default 5000,
  status text not null default 'pending_payment', -- pending_payment | paid | processing | completed | refunded
  
  -- RoEx integration
  roex_job_id text,
  roex_analysis jsonb,
  delivered_files text[],
  
  -- ops
  reviewed_at timestamptz,
  reviewer_notes text
);

create index if not exists mix_orders_created_at_idx on public.mix_orders (created_at desc);
create index if not exists mix_orders_status_idx on public.mix_orders (status);
create index if not exists mix_orders_email_idx on public.mix_orders (email);

-- Audit call bookings
create table if not exists public.audit_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  email text not null,
  name text not null,
  artist_name text not null,
  role text not null,
  focus_areas text[] not null default '{}',
  challenge text not null,
  goals text,
  date_preference text,
  
  price int not null default 15000,
  status text not null default 'pending_payment', -- pending_payment | paid | scheduled | completed | refunded
  
  -- scheduling
  cal_com_event_id text,
  scheduled_at timestamptz,
  recording_url text,
  
  -- ops
  reviewer_notes text
);

create index if not exists audit_bookings_created_at_idx on public.audit_bookings (created_at desc);
create index if not exists audit_bookings_status_idx on public.audit_bookings (status);

-- Marketing package inquiries
create table if not exists public.marketing_packages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  email text not null,
  artist_name text not null,
  release_url text not null,
  platforms text[] not null default '{}',
  budget_range text not null,
  goals text not null,
  timeline text not null,
  notes text,
  
  price int not null default 50000,
  status text not null default 'pending_payment', -- pending_payment | paid | in_progress | completed
  
  -- campaign details (filled after payment)
  campaign_id text,
  monthly_ad_spend int,
  
  -- ops
  reviewer_notes text
);

create index if not exists marketing_packages_created_at_idx on public.marketing_packages (created_at desc);
create index if not exists marketing_packages_status_idx on public.marketing_packages (status);

-- Free track health checks (lead magnet)
create table if not exists public.free_analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  email text not null,
  artist_name text not null,
  track_url text not null,
  
  status text not null default 'pending', -- pending | processing | completed | error
  
  -- RoEx analysis result
  roex_analysis jsonb,
  report_sent_at timestamptz,
  
  -- conversion tracking
  converted_to_mix boolean default false,
  converted_to_audit boolean default false,
  converted_to_service boolean default false
);

create index if not exists free_analyses_created_at_idx on public.free_analyses (created_at desc);
create index if not exists free_analyses_status_idx on public.free_analyses (status);
create index if not exists free_analyses_email_idx on public.free_analyses (email);

-- Provider applications (Network page)
create table if not exists public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  name text not null,
  email text not null,
  role text not null,
  location text,
  portfolio_url text,
  services text[] not null default '{}',
  bio text,
  
  status text not null default 'pending', -- pending | approved | rejected
  reviewed_at timestamptz,
  reviewer_notes text
);

create index if not exists provider_applications_created_at_idx on public.provider_applications (created_at desc);
create index if not exists provider_applications_status_idx on public.provider_applications (status);

alter table public.provider_applications enable row level security;
create policy "anon can insert provider_applications" on public.provider_applications for insert to anon with check (true);
create policy "authenticated can read provider_applications" on public.provider_applications for select to authenticated using (true);
create policy "authenticated can update provider_applications" on public.provider_applications for update to authenticated using (true) with check (true);

-- Projects table (internal workflow / client operating layer)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Core project info
  artist_name text not null,
  project_name text not null,
  status text not null default 'active', -- active | paused | completed | archived
  engagement_type text not null, -- mix | audit | blueprint | execution | partnership
  
  -- Assets
  assets jsonb not null default '{}', -- tracks, artwork, references
  
  -- Backend integrations
  audio_analysis jsonb, -- RoEx results
  research jsonb, -- Recoupable research
  blueprint jsonb, -- Generated blueprint
  content_ideas jsonb, -- Content ideas array
  release_operation jsonb, -- ONCE release state
  
  -- Workflow tracking
  workflow jsonb not null default '{"currentStep": "", "completedSteps": [], "pendingSteps": []}'::jsonb,
  
  -- Communications
  notes jsonb not null default '[]'::jsonb,
  
  -- Team access
  team_members uuid[] not null default '{}'
);

create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_artist_name_idx on public.projects (artist_name);

alter table public.projects enable row level security;
create policy "authenticated can read projects" on public.projects for select to authenticated using (true);
create policy "authenticated can insert projects" on public.projects for insert to authenticated with check (true);
create policy "authenticated can update projects" on public.projects for update to authenticated using (true) with check (true);

-- Row Level Security (same pattern as applications)
alter table public.mix_orders enable row level security;
alter table public.audit_bookings enable row level security;
alter table public.marketing_packages enable row level security;
alter table public.free_analyses enable row level security;

-- Anon can insert (public submissions)
create policy "anon can insert mix_orders" on public.mix_orders for insert to anon with check (true);
create policy "anon can insert audit_bookings" on public.audit_bookings for insert to anon with check (true);
create policy "anon can insert marketing_packages" on public.marketing_packages for insert to anon with check (true);
create policy "anon can insert free_analyses" on public.free_analyses for insert to anon with check (true);

-- Authenticated can read (admin panel)
create policy "authenticated can read mix_orders" on public.mix_orders for select to authenticated using (true);
create policy "authenticated can read audit_bookings" on public.audit_bookings for select to authenticated using (true);
create policy "authenticated can read marketing_packages" on public.marketing_packages for select to authenticated using (true);
create policy "authenticated can read free_analyses" on public.free_analyses for select to authenticated using (true);

-- Authenticated can update (admin panel)
create policy "authenticated can update mix_orders" on public.mix_orders for update to authenticated using (true) with check (true);
create policy "authenticated can update audit_bookings" on public.audit_bookings for update to authenticated using (true) with check (true);
create policy "authenticated can update marketing_packages" on public.marketing_packages for update to authenticated using (true) with check (true);
create policy "authenticated can update free_analyses" on public.free_analyses for update to authenticated using (true) with check (true);
