-- Seed posts and projects so the site has content on first boot.
-- Run after schema.sql.

insert into posts (slug, date, read_time, lang, tag, title, excerpt, body) values
('from-coder-to-creator', '2026-04-10', '8 min', 'EN', 'essay',
 'From Coder to Creator: One Year After Quitting My Job',
 'A year ago I left a comfortable engineering job to bet everything on AI content and solo products. No audience, no plan, no safety net. Here''s what kept me alive.',
 '[
   {"type":"p","text":"A year ago, I quit a stable engineering job I''d held for six years. I was 30, well-paid, on a team I liked. I know how dumb that sounds. But every evening on the subway home, I was scrolling X, looking at strangers'' screenshots of their own little products, thinking: why not me."},
   {"type":"p","text":"So I quit. The next morning I opened an X account called @pandatalk, used a pixel panda in a green hoodie as the avatar, and then — nothing happened."},
   {"type":"h2","text":"Month one: zero"},
   {"type":"p","text":"Zero followers, zero revenue, zero posts. Every morning I sat down at 9am to write my first tweet, deleted it, rewrote it. By 4pm I still hadn''t posted. I realized: making content is not writing code. Code either runs or it doesn''t. A post doesn''t go out because you''re afraid."},
   {"type":"p","text":"So I made one rule: three posts a day, no matter how bad."},
   {"type":"h2","text":"Month three: the first 10k"},
   {"type":"p","text":"It was a Wednesday night. I''d written a tutorial about Claude Projects with eight screenshots. Woke up to a vibrating phone. 1.2k likes, 200 replies."},
   {"type":"p","text":"For the first time I thought: maybe it isn''t me. Maybe there are just a lot of people who want to hear this."},
   {"type":"h2","text":"Month twelve: today"},
   {"type":"p","text":"I have 28k followers, a paid community, two small products, and enough revenue to cover rent and ramen. I''m not famous. But I pay for my own life, and none of what I do every day is something I hate."},
   {"type":"p","text":"People ask if it was worth it. I don''t know. But if I could go back, I''d quit again."}
 ]'::jsonb),
('claude-code-workflow', '2026-03-28', '12 min', 'EN', 'dev',
 'My Claude Code Workflow: Two SaaS in Three Months, Solo',
 'Not a tutorial. The honest operations manual of one indie dev using Claude to stretch a one-person team into something closer to three.',
 '[
   {"type":"p","text":"This isn''t a feel-good \"AI replaces programmers\" post. It''s a logbook of how one solo developer, doing every job in the company, uses AI to pull himself back from the edge of burnout."},
   {"type":"h2","text":"Step 1: become your own PM"},
   {"type":"p","text":"When I wrote code by hand, I''d think one line and write one line. That doesn''t work anymore — AI writes faster than I can think, but it needs direction. So every morning I spend thirty minutes writing Issues, as if assigning work to a direct report."},
   {"type":"h2","text":"Step 2: let Claude run in the background"},
   {"type":"p","text":"I keep two terminal windows open. One for me. One running Claude Code. It handles the repetitive work — tests, styles, copy — and I handle the judgment calls."},
   {"type":"h2","text":"Step 3: review, don''t merge"},
   {"type":"p","text":"AI writes code that runs and is also garbage. I read every diff. If I don''t understand a line, I ask. You cannot skip this step. Skip it once and two weeks later you''re maintaining something you don''t recognize."}
 ]'::jsonb),
('why-indie-hackers', '2026-03-15', '6 min', 'EN', 'thought',
 'Why Indie Hackers Have It Harder — and Better',
 'Information gap, language gap, payment gap. Three walls. Very few people get over them, which means once you do, it''s a blue ocean on the other side.',
 '[
   {"type":"p","text":"I''m not here to sell anyone inspiration. I''ll just say what I see."},
   {"type":"p","text":"As an indie hacker, you do one extra job: you translate — tools, ideas, frameworks — from one world to another. It''s tedious. It''s not technically impressive. And that''s exactly why it pays."}
 ]'::jsonb),
('x-growth-journey', '2026-02-22', '10 min', 'EN', 'growth',
 '0 → 20k on X: What Actually Worked (And What Didn''t)',
 'No threads, no bait, no "10x your engagement" tricks. What a non-native English speaker learned in a year of posting in public.',
 '[
   {"type":"p","text":"I''m not American. I don''t live in SF. English is my second language. And still, X has been the single best business decision I''ve made in a decade."},
   {"type":"h2","text":"The meta nobody shows you"},
   {"type":"p","text":"Most growth advice is written by people who already have an audience. The early game is a different game. It''s lonely. Your first 100 followers take three months. Your next 10,000 take two weeks."}
 ]'::jsonb),
('tools-i-use-2026', '2026-02-08', '4 min', 'EN', 'uses',
 'The Tools I Use Every Day in 2026',
 'Editor, writing, video, design, bookkeeping. The full setup for a solo dev who''s also a content creator. No affiliate links.',
 '[
   {"type":"p","text":"People ask what I use. Here''s the full list. No sponsorships, no affiliate codes."}
 ]'::jsonb),
('building-in-public', '2026-01-18', '7 min', 'EN', 'essay',
 'The Year I Wrote Every Commit Message in Public',
 'A small rebellion that turned into a ritual. By the end of the year, the way I wrote software had quietly, completely changed.',
 '[
   {"type":"p","text":"At first it was just easier. Later it became a ritual."}
 ]'::jsonb)
on conflict (slug) do nothing;

insert into projects (slug, glyph, title, description, status, status_label, stack, year, href, long) values
('pandatalk-ai', 'P/', 'PandaTalk AI',
 'An AI toolkit for indie developers — unified access to frontier models, a curated prompt library, and a paid community.',
 'ship', 'Live', array['Next.js','Claude','Stripe'], '2025–', '#',
 'The project I''ve worked on the longest. It started as a little tool I built for myself to save on API costs, then I shared it with friends, and a year later it has 800+ paying users. It isn''t trying to beat anyone — it just happens to understand its users better than the generic tools do.'),
('bamboo-notes', '¶/', 'Bamboo Notes',
 'A Markdown editor built for writers: built-in AI editing, auto illustrations, and one-click publishing to X and newsletter.',
 'wip', 'In progress', array['Tauri','Rust','React'], '2026', '#',
 'My own biggest pain as a content person: cross-platform formatting. Bamboo Notes is the thing I built for myself. 30 beta users are testing it now. Launching in June.'),
('daily-panda', '✉/', 'Daily Panda',
 'One email every weekday: three deep reads from the AI world, with my commentary. Over 2,000 subscribers.',
 'ship', 'Daily', array['Resend','cron','Notion'], '2025–', '#',
 'Since June 2025, every weekday. Never missed one. It''s the project I''m most proud of, and by far the one that''s brought me the most opportunity — nearly every partnership I have came from a subscriber.'),
('prompt-market', '$/', 'PromptMarket',
 'A marketplace for prompts — so good prompts can be paid for, shared, forked, and improved over time.',
 'idea', 'Idea', array['idea stage'], '2026', '#',
 'Still just a thought. If prompts are a new kind of code, they deserve their own GitHub and npm. There isn''t one. Maybe I build it.'),
('x-lens', 'X/', 'X-Lens',
 'Analytics for creators on X — what actually grows your audience, vs. what just felt good to post.',
 'ship', 'Soft launch', array['Cloudflare','D1','React'], '2025', '#',
 'A tool I built for myself. A friend saw it and asked me to open it up. Now it has 200 paying users.'),
('panda-cursor', '>_', 'panda-cursor.css',
 'A tiny open-source project: replace your website''s cursor with a pixel-art panda. 400 stars on GitHub.',
 'ship', 'Open source', array['CSS','OSS'], '2025', '#',
 'Wrote it over a weekend. Didn''t expect anyone to care.')
on conflict (slug) do nothing;
