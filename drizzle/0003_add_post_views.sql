alter table posts add column if not exists views integer not null default 0;

-- Atomic, race-free view increment. SECURITY DEFINER so the public anon role
-- can bump the counter without a broad UPDATE policy on posts.
create or replace function increment_post_views(post_slug text)
returns integer
language sql
security definer
set search_path = public
as $$
  update posts set views = views + 1 where slug = post_slug returning views;
$$;

grant execute on function increment_post_views(text) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
