-- Part of the pitch-secrecy refactor.
--
-- Each player's own Q/W/E pitch library used to live in pitch_set_p1 /
-- pitch_set_p2 on `rooms`, which meant it went out over the same Realtime
-- channel both players subscribe to for shared game state — RLS on
-- `rooms` is row-level, not column-level, so it couldn't stop a
-- participant from receiving their opponent's full pitch set on every
-- room update.
--
-- pitch_sets is a separate, owner-scoped table instead: each player's set
-- is its own row, RLS restricts it to auth.uid() = player_uid, and it's
-- fetched once via a direct SELECT (not subscribed to Realtime) so the
-- opponent's row is never sent to client at all.

create table if not exists public.pitch_sets (
  room_id text not null references public.rooms (id),
  player_uid uuid not null references auth.users (id),
  pitches jsonb not null,
  created_at timestamptz not null default now(),
  primary key (room_id, player_uid)
);

alter table public.pitch_sets enable row level security;

create policy "pitch_sets_select_own"
on public.pitch_sets
for select
to authenticated
using (auth.uid() = player_uid);

create policy "pitch_sets_insert_own"
on public.pitch_sets
for insert
to authenticated
with check (auth.uid() = player_uid);

-- Needed for the dev-tools pitch-loadout override (DevSettings.jsx),
-- which overwrites a player's own set mid-game for scenario testing.
create policy "pitch_sets_update_own"
on public.pitch_sets
for update
to authenticated
using (auth.uid() = player_uid)
with check (auth.uid() = player_uid);
