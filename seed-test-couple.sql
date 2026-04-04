-- Run once in Supabase → SQL Editor if you prefer not to use the dev API.
-- Then join with code: TEST01

insert into public.couples (code)
select 'TEST01'
where not exists (
  select 1 from public.couples c where c.code ilike 'TEST01'
);
