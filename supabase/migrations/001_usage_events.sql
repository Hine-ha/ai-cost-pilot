-- Run this in the Supabase SQL Editor for your project.

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  model text not null,
  input_tokens integer not null check (input_tokens >= 0),
  output_tokens integer not null check (output_tokens >= 0),
  cost numeric(12, 6) not null check (cost >= 0),
  timestamp timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_events_project_name
  on public.usage_events (project_name);

create index if not exists idx_usage_events_timestamp
  on public.usage_events (timestamp desc);

alter table public.usage_events enable row level security;

-- Service role bypasses RLS. No public policies are required for server-side API routes.
