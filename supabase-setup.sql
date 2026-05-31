-- お仕事体験.com — Supabase DB セットアップ
-- このSQLをSupabaseのSQL Editorで実行してください

-- play_sessions テーブル
create table play_sessions (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  scenario_version text not null,
  player_name text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  completed boolean not null default false,
  total_score integer,
  max_score integer,
  result_score_percent integer,
  last_question_id text,
  abandoned_question_id text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- question_views テーブル
create table question_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references play_sessions(id) on delete cascade,
  job_id text not null,
  scenario_version text not null,
  question_id text not null,
  question_index integer not null,
  viewed_at timestamptz not null default now(),
  answered boolean not null default false,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  unique(session_id, question_id)
);

-- question_answers テーブル
create table question_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references play_sessions(id) on delete cascade,
  job_id text not null,
  scenario_version text not null,
  question_id text not null,
  question_index integer not null,
  selected_option_id text not null check (selected_option_id in ('A', 'B', 'C', 'D')),
  selected_score integer not null check (selected_score in (0, 5, 10)),
  feedback_type text not null check (feedback_type in ('good', 'normal', 'bad')),
  question_started_at timestamptz not null,
  answered_at timestamptz not null default now(),
  answer_time_ms integer not null,
  created_at timestamptz not null default now(),
  unique(session_id, question_id)
);

-- インデックス
create index idx_play_sessions_job_id on play_sessions(job_id);
create index idx_play_sessions_completed on play_sessions(completed);
create index idx_play_sessions_started_at on play_sessions(started_at);
create index idx_play_sessions_job_version on play_sessions(job_id, scenario_version);

create index idx_question_views_job_question on question_views(job_id, scenario_version, question_id);
create index idx_question_views_session on question_views(session_id);

create index idx_question_answers_job_question on question_answers(job_id, scenario_version, question_id);
create index idx_question_answers_session on question_answers(session_id);
create index idx_question_answers_feedback_type on question_answers(feedback_type);

-- updated_at 自動更新トリガー
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_play_sessions_updated_at
before update on play_sessions
for each row
execute function update_updated_at_column();
