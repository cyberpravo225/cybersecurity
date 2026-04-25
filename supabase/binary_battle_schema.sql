-- Binary Battle Supabase schema (solo + tournament + leaderboard)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique,
  age_group text not null check (age_group in ('10-16','16+')),
  avatar_url text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists username text,
  add column if not exists birth_date date;

create table if not exists public.questions (
  id bigserial primary key,
  type text not null,
  category text not null,
  prompt text not null,
  correct_answer text not null,
  explanation text not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  tags text[] not null default '{}',
  language text not null default 'ru',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  source_type text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.questions
  add column if not exists difficulty smallint not null default 1;

create table if not exists public.question_variants (
  id bigserial primary key,
  question_id bigint not null references public.questions(id) on delete cascade,
  label text not null,
  value text not null,
  is_correct boolean not null default false,
  order_index integer not null default 0
);

create table if not exists public.solo_runs (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  avg_response_ms integer not null default 0,
  best_streak integer not null default 0,
  age_group text not null check (age_group in ('10-16','16+')),
  mode text not null default 'solo_competitive',
  created_at timestamptz not null default now()
);

create table if not exists public.solo_run_answers (
  id bigserial primary key,
  solo_run_id bigint not null references public.solo_runs(id) on delete cascade,
  question_id bigint,
  selected_value text not null,
  is_correct boolean not null,
  response_ms integer not null,
  answered_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id bigserial primary key,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default false,
  rules jsonb not null default '{}'::jsonb
);

create table if not exists public.leaderboard_entries (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  solo_run_id bigint not null references public.solo_runs(id) on delete cascade,
  score integer not null,
  age_group text not null check (age_group in ('10-16','16+')),
  season_id bigint references public.seasons(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.lobbies (
  id bigserial primary key,
  code text not null unique,
  host_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status text not null default 'waiting',
  is_private boolean not null default false,
  password_hash text,
  max_players integer not null default 8,
  settings jsonb not null default '{}'::jsonb,
  current_round integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lobby_players (
  id bigserial primary key,
  lobby_id bigint not null references public.lobbies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  is_ready boolean not null default false,
  score integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  best_streak integer not null default 0,
  connected_at timestamptz not null default now(),
  left_at timestamptz,
  unique (lobby_id, profile_id)
);

create table if not exists public.lobby_rounds (
  id bigserial primary key,
  lobby_id bigint not null references public.lobbies(id) on delete cascade,
  round_index integer not null,
  question_id bigint,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (lobby_id, round_index)
);

create table if not exists public.lobby_answers (
  id bigserial primary key,
  lobby_id bigint not null references public.lobbies(id) on delete cascade,
  lobby_round_id bigint not null references public.lobby_rounds(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  question_id bigint,
  selected_value text not null,
  is_correct boolean not null,
  response_ms integer not null,
  answered_at timestamptz not null default now(),
  unique (lobby_round_id, profile_id)
);

create table if not exists public.achievements (
  id bigserial primary key,
  key text not null unique,
  title text not null,
  description text not null,
  icon text,
  condition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id bigserial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id bigint not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (profile_id, achievement_id)
);

create table if not exists public.question_flags (
  id bigserial primary key,
  question_id bigint not null references public.questions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_active_category on public.questions(is_active, category, difficulty);
create index if not exists idx_solo_runs_profile_created on public.solo_runs(profile_id, created_at desc);
create index if not exists idx_solo_runs_age_score on public.solo_runs(age_group, score desc, created_at desc);
create index if not exists idx_leaderboard_entries_age_score on public.leaderboard_entries(age_group, score desc, created_at desc);
create index if not exists idx_lobbies_status_created on public.lobbies(status, created_at desc);
create index if not exists idx_lobby_players_lobby_ready on public.lobby_players(lobby_id, is_ready);
create index if not exists idx_lobby_answers_round_profile on public.lobby_answers(lobby_round_id, profile_id);
create index if not exists idx_question_flags_status on public.question_flags(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.question_variants enable row level security;
alter table public.solo_runs enable row level security;
alter table public.solo_run_answers enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.seasons enable row level security;
alter table public.lobbies enable row level security;
alter table public.lobby_players enable row level security;
alter table public.lobby_rounds enable row level security;
alter table public.lobby_answers enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.question_flags enable row level security;

drop policy if exists profiles_read_public on public.profiles;
create policy profiles_read_public on public.profiles for select using (true);
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists questions_read_active on public.questions;
create policy questions_read_active on public.questions for select using (is_active = true);
drop policy if exists question_variants_read_all on public.question_variants;
create policy question_variants_read_all on public.question_variants for select using (true);

drop policy if exists solo_runs_read_public on public.solo_runs;
create policy solo_runs_read_public on public.solo_runs for select using (true);
drop policy if exists solo_runs_insert_self on public.solo_runs;
create policy solo_runs_insert_self on public.solo_runs for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists solo_run_answers_read_public on public.solo_run_answers;
create policy solo_run_answers_read_public on public.solo_run_answers for select using (true);
drop policy if exists solo_run_answers_insert_self on public.solo_run_answers;
create policy solo_run_answers_insert_self on public.solo_run_answers for insert to authenticated with check (
  exists (
    select 1 from public.solo_runs sr where sr.id = solo_run_id and sr.profile_id = auth.uid()
  )
);

drop policy if exists leaderboard_entries_read_public on public.leaderboard_entries;
create policy leaderboard_entries_read_public on public.leaderboard_entries for select using (true);
drop policy if exists leaderboard_entries_insert_self on public.leaderboard_entries;
create policy leaderboard_entries_insert_self on public.leaderboard_entries for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists seasons_read_public on public.seasons;
create policy seasons_read_public on public.seasons for select using (true);

drop policy if exists lobbies_read_public on public.lobbies;
create policy lobbies_read_public on public.lobbies for select using (true);
drop policy if exists lobbies_insert_host on public.lobbies;
create policy lobbies_insert_host on public.lobbies for insert to authenticated with check (auth.uid() = host_profile_id);

drop policy if exists lobby_players_read_public on public.lobby_players;
create policy lobby_players_read_public on public.lobby_players for select using (true);
drop policy if exists lobby_players_insert_self on public.lobby_players;
create policy lobby_players_insert_self on public.lobby_players for insert to authenticated with check (auth.uid() = profile_id);
drop policy if exists lobby_players_update_self on public.lobby_players;
create policy lobby_players_update_self on public.lobby_players for update to authenticated using (auth.uid() = profile_id);

drop policy if exists lobby_rounds_read_public on public.lobby_rounds;
create policy lobby_rounds_read_public on public.lobby_rounds for select using (true);
drop policy if exists lobby_answers_read_public on public.lobby_answers;
create policy lobby_answers_read_public on public.lobby_answers for select using (true);
drop policy if exists lobby_answers_insert_self on public.lobby_answers;
create policy lobby_answers_insert_self on public.lobby_answers for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists achievements_read_public on public.achievements;
create policy achievements_read_public on public.achievements for select using (true);
drop policy if exists user_achievements_read_public on public.user_achievements;
create policy user_achievements_read_public on public.user_achievements for select using (true);
drop policy if exists user_achievements_insert_self on public.user_achievements;
create policy user_achievements_insert_self on public.user_achievements for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists question_flags_insert_self on public.question_flags;
create policy question_flags_insert_self on public.question_flags for insert to authenticated with check (auth.uid() = profile_id);
drop policy if exists question_flags_read_own on public.question_flags;
create policy question_flags_read_own on public.question_flags for select to authenticated using (auth.uid() = profile_id);
