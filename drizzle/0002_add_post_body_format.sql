alter table posts add column if not exists body_format text not null default 'html';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_body_format_check'
  ) then
    alter table posts
      add constraint posts_body_format_check
      check (body_format in ('html', 'md', 'blocks', 'html_document'));
  end if;
end $$;

notify pgrst, 'reload schema';
