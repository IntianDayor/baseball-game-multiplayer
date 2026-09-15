alter table public.rooms
  drop column if exists pitch_set_p1,
  drop column if exists pitch_set_p2;
