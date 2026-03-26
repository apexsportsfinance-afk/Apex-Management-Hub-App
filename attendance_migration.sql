-- Step 1: Create the sessions schedule table
create table if not exists event_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  session_name text not null,
  start_time time not null,
  end_time time not null,
  session_date date not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Step 2: Upgrade the attendance table for session tracking
alter table event_attendance 
  add column if not exists session_id uuid references event_sessions(id) on delete set null,
  add column if not exists punctuality_status text check (
    punctuality_status in ('ON_TIME', 'LATE', 'UNASSIGNED')
  ) default 'UNASSIGNED';

-- Step 3: Add indexing for performance
create index if not exists idx_sessions_lookup on event_sessions(event_id, session_date);
