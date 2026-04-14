-- Stable Bride 1 / Bride 2 (and Groom 1 / 2) ordering across devices: creator's swipe rows
-- carry is_creator = true, joiner's rows carry is_creator = false. The app orders labels from DB,
-- not from per-device localStorage.

alter table public.swipes
  add column if not exists is_creator boolean;

comment on column public.swipes.is_creator is
  'True when the swiper is the couple creator, false when the joiner; used for consistent role ordering.';
