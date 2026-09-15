-- Part of the pitch-secrecy refactor.
--
-- BattingField.jsx currently derives speed / spinType / breakTiming /
-- spinRate / spinDirection for an incoming pitch by looking it up in the
-- opponent's full pitch library (pitches[incomingPitch.pitch_type]). That
-- library is preloaded into the batter's client before any pitch is
-- thrown, which means the batter's own client already holds full details
-- of pitches they haven't faced yet.
--
-- None of those 5 fields need to come from a shared library at all the
-- pitcher's client already has them at the moment it resolves and throws a
-- pitch. Writing them directly onto the pitches row means the batter only
-- ever learns them once the throw actually happens, which is the correct
-- secrecy boundary, using a row that's already RLS'd to participants only.

alter table public.pitches
  add column if not exists speed float4,
  add column if not exists spin_type text,
  add column if not exists break_timing float4,
  add column if not exists spin_rate float4,
  add column if not exists spin_direction int4;
