-- Part of the pitch-secrecy refactor.
-- pitch_set_p1 / pitch_set_p2 on rooms are dead columns as of the
-- pitch_sets migration — createRoom()/joinRoom() no longer write to them,
-- and Game.jsx no longer reads them. Nothing in the app touches these
-- columns anymore; this just removes the now-unused storage and the
-- leftover leak surface (RLS still permits both participants to read
-- them if left in place, since RLS is row-level).

alter table public.rooms
  drop column if exists pitch_set_p1,
  drop column if exists pitch_set_p2;
