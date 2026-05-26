create extension if not exists "pgcrypto";

drop table if exists notifications cascade;
drop table if exists notes cascade;
drop table if exists tasks cascade;
drop table if exists projects cascade;

create table projects (
  id text primary key,
  name text not null unique,
  description text not null default '',
  color text not null default '#0f766e',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null check (status in ('Backlog', 'Todo', 'In Progress', 'Blocked', 'Done')),
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Critical')),
  category text not null check (category in ('UI Issue', 'Feature', 'Bug Fix', 'Release', 'Meeting', 'Research', 'Personal')),
  due_date timestamptz null,
  project_id text not null references projects(id) on delete restrict,
  tags text[] not null default '{}',
  completed_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text not null check (type in ('overdue', 'due_today', 'blocked', 'system')),
  task_id uuid null references tasks(id) on delete cascade,
  due_date timestamptz null,
  read boolean not null default false,
  source_key text unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  linked_task_id uuid null references tasks(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table projects disable row level security;
alter table tasks disable row level security;
alter table notifications disable row level security;
alter table notes disable row level security;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on projects
for each row
execute function set_updated_at();

create trigger tasks_set_updated_at
before update on tasks
for each row
execute function set_updated_at();

create trigger notes_set_updated_at
before update on notes
for each row
execute function set_updated_at();

create index tasks_status_idx on tasks(status);
create index tasks_priority_idx on tasks(priority);
create index tasks_due_date_idx on tasks(due_date);
create index tasks_project_id_idx on tasks(project_id);
create index notifications_read_idx on notifications(read);
create index notes_linked_task_id_idx on notes(linked_task_id);

insert into projects (id, name, description, color)
values
  ('ai-workspace', 'AI Workspace', 'AI workflow, prompt design, and product work.', '#0f766e'),
  ('api-manager', 'API Manager', 'Platform improvements, integrations, and API operations.', '#2563eb'),
  ('bijira-console', 'Bijira Console', 'Internal console updates, bug fixes, and UI polish.', '#b45309'),
  ('devportal', 'DevPortal', 'Developer experience, docs, and portal quality.', '#9333ea'),
  ('mcp-hub', 'MCP Server / MCP Hub', 'MCP server quality, orchestration, and monitoring.', '#0891b2'),
  ('release-work', 'Release Work', 'Release planning, QA coordination, and readiness tracking.', '#dc2626'),
  ('vehicle-personal', 'Vehicle / Personal Work', 'Personal administration and vehicle-related tasks.', '#4f46e5')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color;
