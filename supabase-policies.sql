-- Run in Supabase SQL Editor after creating tables.
-- Allows the anon key (browser + server fallback) to read/write these tables for the MVP.

alter table public.couples enable row level security;
alter table public.swipes enable row level security;
alter table public.venue_cache enable row level security;

drop policy if exists "couples read insert update" on public.couples;
drop policy if exists "couples_allow_all" on public.couples;
create policy "couples_allow_all" on public.couples
  for all
  using (true)
  with check (true);

drop policy if exists "swipes all" on public.swipes;
drop policy if exists "swipes_allow_all" on public.swipes;
create policy "swipes_allow_all" on public.swipes
  for all
  using (true)
  with check (true);

drop policy if exists "venue_cache all" on public.venue_cache;
drop policy if exists "venue_cache_allow_all" on public.venue_cache;
create policy "venue_cache_allow_all" on public.venue_cache
  for all
  using (true)
  with check (true);

-- Realtime: Dashboard → Database → Publications → supabase_realtime → add table `swipes`
-- or: alter publication supabase_realtime add table public.swipes;
