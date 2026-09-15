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
