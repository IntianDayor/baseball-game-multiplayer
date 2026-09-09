-- Add dedicated uid columns to rooms so RLS policies can check
-- "is this caller a participant of this room?" directly against auth.uid(),
-- instead of string-matching inside player1_id / player2_id.
--
-- player1_id / player2_id are left untouched: they are write-only display
-- strings (roomCode + uid + slot suffix) that are never read anywhere in
-- the app, so there is nothing to migrate off of them for now.
--
-- Existing rows created before this migration will have player1_uid /
-- player2_uid = NULL. That's fine — those are dev/playtest rooms, and new
-- rooms created after this ships (see rooms.js changes) will populate both
-- columns correctly going forward.

alter table public.rooms
  add column if not exists player1_uid uuid references auth.users (id),
  add column if not exists player2_uid uuid references auth.users (id);

create index if not exists rooms_player1_uid_idx on public.rooms (player1_uid);
create index if not exists rooms_player2_uid_idx on public.rooms (player2_uid);
