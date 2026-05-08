-- PandaTalk schema
-- Run this in your Supabase SQL editor (or via the supabase CLI) to create the tables.

create table if not exists posts (
  slug         text primary key,
  date         date        not null,
  read_time    text        not null,
  lang         text        not null default 'EN',
  tag          text        not null,
  title        text        not null,
  excerpt      text        not null,
  -- body is a jsonb value. New posts store the rendered HTML as a JSON
  -- string (e.g. '"<p>...</p>"'). Legacy posts may hold an array of typed
  -- blocks; both are handled by the reader.
  body         jsonb       not null default '""'::jsonb,
  cover        text,
  created_at   timestamptz not null default now()
);

create table if not exists projects (
  slug         text primary key,
  glyph        text        not null,
  title        text        not null,
  description  text        not null,
  status       text        not null check (status in ('ship','wip','idea')),
  status_label text        not null,
  stack        text[]      not null default '{}',
  year         text        not null,
  href         text        not null default '#',
  long         text        not null,
  created_at   timestamptz not null default now()
);

-- Public read-only access
alter table posts enable row level security;
alter table projects enable row level security;

drop policy if exists "posts read" on posts;
create policy "posts read" on posts for select using (true);

drop policy if exists "projects read" on projects;
create policy "projects read" on projects for select using (true);

create index if not exists posts_date_idx on posts (date desc);
create index if not exists projects_status_idx on projects (status);
