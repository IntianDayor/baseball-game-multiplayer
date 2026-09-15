alter table public.rooms enable row level security;
alter table public.pitches enable row level security;
alter table public.swings enable row level security;

-- =============== ROOMS =============== --

-- Anyone signed in (including anonymous) can create a room, but only as
-- themselves (player1_uid must equal their own uid). player2_uid is left
-- null at creation time.
create policy "rooms_insert_as_self"
on public.rooms
for insert
to authenticated
with check (player1_uid = auth.uid());

-- Only the two participants of a room can read it.
create policy "rooms_select_participants"
on public.rooms
for select
to authenticated
using (auth.uid() = player1_uid or auth.uid() = player2_uid);

-- Two ways an UPDATE is legal:
--   1) An existing participant updating their own room (gameplay progress,
--      coin toss, dev tools, role swaps, etc).
--   2) A brand-new player joining an open room: status is 'waiting' and
--      player2_uid is still empty. This is the only path where the caller
--      is allowed to touch a room they are not yet a participant of.
-- WITH CHECK then requires that after the update, the caller IS a
-- participant — so the "join" door can't be used to overwrite an active
-- room's state without becoming player2 in the process.
create policy "rooms_update_participants_or_join"
on public.rooms
for update
to authenticated
using (
  auth.uid() = player1_uid
  or auth.uid() = player2_uid
  or (status = 'waiting' and player2_uid is null)
)
with check (
  auth.uid() = player1_uid
  or auth.uid() = player2_uid
);

-- =============== PITCHES =============== --

create policy "pitches_insert_room_participant"
on public.pitches
for insert
to authenticated
with check (
  exists (
    select 1 from public.rooms r
    where r.id = pitches.room_id
      and (auth.uid() = r.player1_uid or auth.uid() = r.player2_uid)
  )
);

create policy "pitches_select_room_participant"
on public.pitches
for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = pitches.room_id
      and (auth.uid() = r.player1_uid or auth.uid() = r.player2_uid)
  )
);

-- =============== SWINGS =============== --

create policy "swings_insert_room_participant"
on public.swings
for insert
to authenticated
with check (
  exists (
    select 1 from public.rooms r
    where r.id = swings.room_id
      and (auth.uid() = r.player1_uid or auth.uid() = r.player2_uid)
  )
);

create policy "swings_select_room_participant"
on public.swings
for select
to authenticated
using (
  exists (
    select 1 from public.rooms r
    where r.id = swings.room_id
      and (auth.uid() = r.player1_uid or auth.uid() = r.player2_uid)
  )
);
