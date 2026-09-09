# Supabase migrations

No Supabase CLI project is linked yet, so these are plain SQL files meant to
be applied by hand via the Supabase Dashboard → SQL Editor, in filename
order. If a CLI project gets linked later (`supabase link`), these already
follow the CLI's migration filename convention (`<timestamp>_<name>.sql`)
and `supabase db push` will pick them up as-is.

## Applying

1. `20260908000001_add_player_uid_columns.sql` — adds `player1_uid` /
   `player2_uid` to `rooms`.
2. `20260908000002_enable_rls.sql` — enables RLS and adds participant-scoped
   policies on `rooms`, `pitches`, `swings`.

Run them in that order. Existing rooms will have `player1_uid` /
`player2_uid` as `NULL` until a new room is created (safe — those are
dev/playtest rows).

## Known gap (intentionally not fixed here)

`rooms.pitch_set_p1` / `pitch_set_p2` are readable by both room
participants once RLS is in place, because RLS is row-level and Realtime
broadcasts the full row to anyone whose SELECT policy passes. A player can
technically read their opponent's full pitch library. Properly closing this
requires moving pitch data off the `rooms` Realtime broadcast path (e.g. a
dedicated per-player fetch), which is a `BattingField.jsx` refactor, not an
RLS change. Tracked as a follow-up, not bundled into this pass.

## Anonymous sign-in captcha

Not part of these SQL files — it's dashboard config + a `VITE_TURNSTILE_SITE_KEY`
env var. See `.env.example` for the client-side piece. On the Supabase side:
Project Settings → Authentication → Bot and Abuse Protection → Enable CAPTCHA
protection → provider = Cloudflare Turnstile → paste the Turnstile **Secret**
key (not the Sitekey — that goes in `.env` instead).
