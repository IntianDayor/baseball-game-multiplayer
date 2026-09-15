alter table public.rooms
  add column if not exists player1_uid uuid references auth.users (id),
  add column if not exists player2_uid uuid references auth.users (id);

create index if not exists rooms_player1_uid_idx on public.rooms (player1_uid);
create index if not exists rooms_player2_uid_idx on public.rooms (player2_uid);
