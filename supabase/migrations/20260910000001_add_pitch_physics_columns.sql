alter table public.pitches
  add column if not exists speed float4,
  add column if not exists spin_type text,
  add column if not exists break_timing float4,
  add column if not exists spin_rate float4,
  add column if not exists spin_direction int4;
