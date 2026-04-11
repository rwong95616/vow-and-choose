-- Per-device swipe identity: partners who share the same role no longer overwrite each other's rows.
-- Replaces uniqueness on (couple_id, user_role, category, item_id) with (couple_id, swipe_user_id, category, item_id).

alter table public.swipes
  add column if not exists swipe_user_id text;

update public.swipes
set swipe_user_id = id::text
where coalesce(trim(swipe_user_id), '') = '';

alter table public.swipes
  alter column swipe_user_id set not null;

alter table public.swipes
  drop constraint if exists swipes_couple_id_user_role_category_item_id_key;

alter table public.swipes
  add constraint swipes_couple_swipe_user_category_item_key
  unique (couple_id, swipe_user_id, category, item_id);
