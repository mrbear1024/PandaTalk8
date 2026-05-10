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

create table if not exists site_settings (
  id          text primary key default 'main',
  site        jsonb       not null default '{}'::jsonb,
  socials     jsonb       not null default '[]'::jsonb,
  about       jsonb       not null default '{}'::jsonb,
  home        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  constraint site_settings_singleton check (id = 'main')
);

-- Public read-only access
alter table posts enable row level security;
alter table projects enable row level security;
alter table communities enable row level security;
alter table courses enable row level security;
alter table site_settings enable row level security;

drop policy if exists "posts read" on posts;
create policy "posts read" on posts for select using (true);

drop policy if exists "projects read" on projects;
create policy "projects read" on projects for select using (true);

drop policy if exists "communities read" on communities;
create policy "communities read" on communities for select using (true);

drop policy if exists "courses read" on courses;
create policy "courses read" on courses for select using (true);

drop policy if exists "site settings read" on site_settings;
create policy "site settings read" on site_settings for select using (true);

create index if not exists posts_date_idx on posts (date desc);
create index if not exists posts_featured_idx on posts (featured desc, date desc);
create index if not exists projects_status_idx on projects (status);
create index if not exists projects_sort_idx on projects (sort_order asc, created_at desc);
create index if not exists communities_sort_idx on communities (sort_order asc, created_at desc);
create index if not exists communities_status_idx on communities (status);
create index if not exists courses_sort_idx on courses (sort_order asc, created_at desc);
create index if not exists courses_status_idx on courses (status);

-- Seed the 2.0 commercial content. These are safe to re-run.
insert into communities (
  slug, name, subtitle, price, currency, cover, description, audience, highlights, includes,
  faq, join_instructions, cta_label, sort_order, featured, status
) values
('x-growth-wechat', 'X 增长微信群', 'Flagship community for X growth and monetization.', '789', '¥', null,
 '面向想系统做 X 增长、内容定位和商业化的创作者与独立开发者。',
 '适合已经开始发 X，想把内容增长变成产品、社群或商业机会的人。',
 array['账号定位与内容策略','X 增长案例拆解','商业化路径与产品化思路'],
 array['微信群交流','增长复盘','内容选题讨论','实战案例分享'],
 '[{"q":"适合零基础吗？","a":"更适合已经准备认真做 X 的人；完全零基础可以先看 X 冷启动成长群。"}]'::jsonb,
 '微信搜索公众号 PandaTalk8，发送「X增长」获取加入方式。',
 '查看加入方式', 1, true, 'published'),
('ai-learning-circle', '熊老板的 AI 学习圈', 'AI tools, workflows, and practical learning notes.', '199', '¥', '/assets/communities/ai-learning-circle.png',
 '熊老板的 AI 学习圈是知识星球社群，持续分享 AI 工具、工作流、产品案例和创作者实践。',
 '适合 AI 学习者、内容创作者、独立开发者和想提升生产力的人。',
 array['AI 工具与工作流','产品案例拆解','学习资料与实践笔记'],
 array['知识星球内容','AI 案例分享','工具清单','学习路径'],
 '[{"q":"内容偏技术吗？","a":"不只面向程序员，更关注 AI 如何进入真实工作流和产品实践。"}]'::jsonb,
 '微信扫码加入知识星球「熊老板的 AI 学习圈」，或搜索公众号 PandaTalk8 发送「AI学习圈」获取加入方式。',
 '查看加入方式', 2, false, 'published'),
('x-cold-start', 'X 冷启动成长群', 'Low-friction starter path for building on X.', '79', '¥', '/assets/communities/x-cold-start.png',
 'X 冷启动成长群是知识星球低价入门社群，帮助刚开始做 X 的人完成账号定位、第一批内容、早期互动和冷启动节奏。',
 '适合刚开始做 X，想用较低门槛建立基础方法的人。',
 array['0 到 1 冷启动','账号基础搭建','早期内容节奏'],
 array['成长群交流','冷启动资料','基础方法论','常见问题答疑'],
 '[{"q":"和 789 元微信群有什么区别？","a":"这个是低价入门，旗舰微信群更适合系统增长和商业化。"}]'::jsonb,
 '微信扫码加入知识星球「X 冷启动成长群」，或搜索公众号 PandaTalk8 发送「冷启动」获取加入方式。',
 '查看加入方式', 3, false, 'published')
on conflict (slug) do nothing;

-- Keep existing seeded communities in sync when this script is re-run on a live database.
update communities
set
  cover = '/assets/communities/ai-learning-circle.png',
  description = '熊老板的 AI 学习圈是知识星球社群，持续分享 AI 工具、工作流、产品案例和创作者实践。',
  join_instructions = '微信扫码加入知识星球「熊老板的 AI 学习圈」，或搜索公众号 PandaTalk8 发送「AI学习圈」获取加入方式。'
where slug = 'ai-learning-circle';

update communities
set
  cover = '/assets/communities/x-cold-start.png',
  description = 'X 冷启动成长群是知识星球低价入门社群，帮助刚开始做 X 的人完成账号定位、第一批内容、早期互动和冷启动节奏。',
  join_instructions = '微信扫码加入知识星球「X 冷启动成长群」，或搜索公众号 PandaTalk8 发送「冷启动」获取加入方式。'
where slug = 'x-cold-start';

insert into courses (
  slug, title, subtitle, description, price, status, external_url, cta_label, sort_order, featured
) values
('x-growth-system', 'X Growth System', 'Build, write, and sell in public.',
 '一门关于 X 账号定位、内容增长和商业化路径的系统课程。课程在独立系统中承接。',
 'Coming soon', 'coming_soon', 'https://pandatalk8.com', '查看课程系统', 1, true)
on conflict (slug) do nothing;

insert into site_settings (id, site, socials, about, home) values (
  'main',
  '{
    "name": "PandaTalk8",
    "displayName": "Mr Panda",
    "brandName": "PandaTalk8",
    "tagline": "AI builder & indie founder. Building products, writing ideas, and selling myself in public.",
    "location": "Online",
    "xHandle": "@PandaTalk8",
    "xUrl": "https://x.com/PandaTalk8",
    "xFollowers": "74.9K",
    "wechatName": "PandaTalk8",
    "wechatQr": "/assets/wechat/qrcode-pandatalk8.jpg",
    "wechatMaterial": "/assets/wechat/material-2.png",
    "domain": "pandatalk8.com",
    "now": {
      "status": "currently",
      "text": "Building AI products, writing in public, and documenting the indie journey."
    }
  }'::jsonb,
  '[
    {"label":"X","handle":"@PandaTalk8","href":"https://x.com/PandaTalk8"},
    {"label":"Substack","handle":"pandatalk","href":"https://pandatalk.substack.com/"},
    {"label":"YouTube","handle":"@pandatalk8","href":"https://www.youtube.com/@pandatalk8"},
    {"label":"GitHub","handle":"mrbear1024","href":"https://github.com/mrbear1024"}
  ]'::jsonb,
  '{
    "sections": [
      {
        "heading": "Hello",
        "paragraphs": [
          "I''m Mr Panda. I spent six years writing backend code at a large tech company, and now I sit in my own rented apartment shipping AI products, recording content, writing code, and talking to strangers on X all day.",
          "I quit in March 2025 to go full-time indie. A year later I''m still alive, and I sleep better than I did in the office."
        ]
      },
      {
        "heading": "What I build",
        "paragraphs": [
          "I build **AI tools**, make **content** on X and WeChat, and run paid communities for AI learning and X growth.",
          "I believe the best products come from tools the maker actually uses. So everything I ship, I use every day."
        ]
      },
      {
        "heading": "What I believe",
        "paragraphs": [
          "That one person can build something that serves a hundred thousand — as long as they are honest enough, patient enough, and willing to reply to every comment.",
          "That AI is still wildly under-used, especially by non-technical creators. There''s a decade of product work in that gap.",
          "That content and products are the same thing, not two different things."
        ]
      },
      {
        "heading": "Say hi",
        "paragraphs": [
          "The fastest way to reach me is a DM on X, or search the WeChat public account PandaTalk8. I read everything. I can''t always reply — please don''t take it personally.",
          "If you''re also a solo builder, an AI founder, or just curious — come say hi."
        ]
      }
    ],
    "timeline": [
      {"year":"2026","what":"Launching Bamboo Notes","detail":"Writing tool for indie creators. June."},
      {"year":"2025","what":"Full-time solo: products + content","detail":"PandaTalk8, AI learning, X growth, paid communities."},
      {"year":"2024","what":"Started posting AI content on X","detail":"First tweet to break 10k."},
      {"year":"2018–2024","what":"Backend engineer at a large tech company","detail":"Six years of Go. Led an eight-person team."},
      {"year":"2014","what":"First time writing code","detail":"Freshman year. Built a campus used-book trading site."}
    ]
  }'::jsonb,
  '{
    "kicker": "online · building in public",
    "title": "AI builder &",
    "titleAccent": "indie founder",
    "lede": "Building products, writing ideas, and selling myself in public.",
    "primaryCtaLabel": "Follow @PandaTalk8 →",
    "primaryCtaHref": "https://x.com/PandaTalk8",
    "secondaryCtaLabel": "订阅公众号",
    "secondaryCtaHref": "/about#wechat",
    "socialsTitle": "Follow the build",
    "showSocials": true,
    "showCommunities": true,
    "showPosts": true,
    "showProjects": true,
    "showCourses": true
  }'::jsonb
) on conflict (id) do nothing;

-- Ask Supabase PostgREST to refresh the schema cache after DDL.
notify pgrst, 'reload schema';
