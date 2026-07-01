-- Optional: run after 001_usage_events.sql for dashboard failure rate & cache metrics.

alter table public.usage_events
  add column if not exists status text not null default 'success',
  add column if not exists cache_saved numeric(12, 6) not null default 0 check (cache_saved >= 0);

create index if not exists idx_usage_events_status
  on public.usage_events (status);
