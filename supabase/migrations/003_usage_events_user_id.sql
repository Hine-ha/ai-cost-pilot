-- Run in Supabase SQL Editor

alter table public.usage_events
  add column if not exists user_id text;

create index if not exists idx_usage_events_user_id
  on public.usage_events (user_id);

create index if not exists idx_usage_events_user_project
  on public.usage_events (user_id, project_name);
