-- Run in Supabase SQL Editor (extends usage_events for SDK track payload)

alter table public.usage_events
  add column if not exists cache_read_tokens integer default 0,
  add column if not exists cache_write_tokens integer default 0,
  add column if not exists provider text,
  add column if not exists latency_ms integer,
  add column if not exists use_case text,
  add column if not exists success boolean default true,
  add column if not exists error_type text,
  add column if not exists user_id text;

create index if not exists idx_usage_events_cache_read
  on public.usage_events (cache_read_tokens)
  where cache_read_tokens > 0;
