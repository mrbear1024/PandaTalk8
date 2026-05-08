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
  -- Pinned posts surface above non-pinned posts on the blog index, regardless
  -- of date. Used for editorial highlights / evergreen content.
  featured     boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- Idempotent migration for existing databases.
alter table posts add column if not exists featured boolean not null default false;

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
  cover        text,
  cta_label    text,
  cta_href     text,
  audience     text,
  sort_order   integer     not null default 100,
  featured     boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table projects add column if not exists cover text;
alter table projects add column if not exists cta_label text;
alter table projects add column if not exists cta_href text;
alter table projects add column if not exists audience text;
alter table projects add column if not exists sort_order integer not null default 100;
alter table projects add column if not exists featured boolean not null default false;

create table if not exists communities (
  slug              text primary key,
  name              text        not null,
  subtitle          text        not null,
  price             text        not null,
  currency          text        not null default '¥',
  cover             text,
  description       text        not null,
  audience          text        not null,
  highlights        text[]      not null default '{}',
  includes          text[]      not null default '{}',
  faq               jsonb       not null default '[]'::jsonb,
  join_instructions text        not null,
  cta_label         text        not null default '查看加入方式',
  sort_order        integer     not null default 100,
  featured          boolean     not null default false,
  status            text        not null default 'published' check (status in ('published','draft','archived')),
  created_at        timestamptz not null default now()
);

create table if not exists courses (
  slug          text primary key,
  title         text        not null,
  subtitle      text        not null,
  cover         text,
  description   text        not null,
  price         text        not null,
  status        text        not null default 'coming_soon' check (status in ('coming_soon','available','archived')),
  external_url  text        not null default '#',
  cta_label     text        not null default '查看课程系统',
  sort_order    integer     not null default 100,
  featured      boolean     not null default false,
  created_at    timestamptz not null default now()
);

-- Public read-only access
alter table posts enable row level security;
alter table projects enable row level security;
alter table communities enable row level security;
alter table courses enable row level security;

drop policy if exists "posts read" on posts;
create policy "posts read" on posts for select using (true);

drop policy if exists "projects read" on projects;
create policy "projects read" on projects for select using (true);

drop policy if exists "communities read" on communities;
create policy "communities read" on communities for select using (true);

drop policy if exists "courses read" on courses;
create policy "courses read" on courses for select using (true);

create index if not exists posts_date_idx on posts (date desc);
create index if not exists posts_featured_idx on posts (featured desc, date desc);
create index if not exists projects_status_idx on projects (status);
create index if not exists projects_sort_idx on projects (sort_order asc, created_at desc);
create index if not exists communities_sort_idx on communities (sort_order asc, created_at desc);
create index if not exists communities_status_idx on communities (status);
create index if not exists courses_sort_idx on courses (sort_order asc, created_at desc);
create index if not exists courses_status_idx on courses (status);
