alter table public.rooms enable row level security;
alter table public.pitches enable row level security;
alter table public.swings enable row level security;

-- =============== ROOMS =============== --

create policy "rooms_insert_as_self"
on public.rooms
for insert
to authenticated
with check (player1_uid = auth.uid());

create policy "rooms_select_participants"
on public.rooms
for select
to authenticated
using (auth.uid() = player1_uid or auth.uid() = player2_uid);

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
