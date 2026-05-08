---
name: pt-blog
description: Publish, edit, list, or delete posts on the PandaTalk blog from local Markdown files. Supports single-file ops and batch publish from a directory. Use when the user mentions publishing/editing/deleting blog posts, importing drafts, or syncing local markdown to the live site.
---

# PandaTalk blog operations

This skill manages posts on the PandaTalk blog (Next.js 14 + Supabase + Cloudflare R2)
through a local CLI at `scripts/blog.mjs`. The CLI talks directly to Supabase REST,
DeepSeek (slug+tag generation), and the R2 bucket using credentials from `.env.local`.
**No dev server is required.**

## When to use

- User wants to publish one or more local `.md` files as blog posts.
- User wants to edit an existing post by replacing it from a local file.
- User wants to delete a post by slug.
- User wants to list or inspect what is currently published.

## CLI reference

Run from the project root (`/Users/wanghe/workspace/Projects/PandaTalk8`):

```bash
node scripts/blog.mjs <command> [args]
```

| Command | Args | Effect |
| --- | --- | --- |
| `list` | — | Print all posts: date / tag / lang / slug / title |
| `get` | `<slug>` | Print full post JSON |
| `publish` | `<file.md>` | Create one new post |
| `publish-batch` | `<dir>` | Publish every `*.md` in `<dir>` (one level only, sorted by name) |
| `edit` | `<slug> <file.md>` | Replace existing post body/title/etc. with file content |
| `delete` | `<slug>` | Delete post permanently |

Append `--dry` to `publish` or `publish-batch` to preview the rows that would be
inserted without actually writing to the database or uploading covers.

## Markdown source format

A post is a single `.md` file with **optional** YAML front matter:

```markdown
---
title: 我的标题                  # optional, defaults to filename without extension
slug: my-slug                    # optional, AI generates from title+body if missing
tag: dev                         # optional. one of: essay | dev | growth | thought | uses | note
cover: ./images/cover.jpg        # optional. local path → uploaded to R2; full URL → used as-is
date: 2026-05-07                 # optional, ISO. defaults to today
lang: ZH                         # optional, ZH or EN, auto-detected from body if missing
excerpt: 一句话摘要               # optional, auto-derived from first paragraph
read_time: 5 min                 # optional, auto-derived from word count
---

# 正文标题

正文 markdown 内容。支持代码块、表格、列表、引用、链接、图片等标准 GFM 语法。
```

All front-matter keys are flat strings (no arrays/objects). Anything not provided
is filled in: title → AI slug + tag → today's date → derived excerpt + read_time → ZH/EN auto-detection.

## Image uploads

- **Cover** images may be local file paths in front matter (`cover: ./images/foo.png`).
  The CLI uploads them to the R2 bucket and stores the resulting public URL.
- **Inline body images** (`![alt](path)`) are **not** auto-uploaded — supply full URLs
  in the markdown, or upload them yourself first via the admin UI / R2 console and
  paste the URL.

## Typical flows

### Publish a single article

```bash
node scripts/blog.mjs publish drafts/my-post.md
```

### Preview before committing

```bash
node scripts/blog.mjs publish drafts/my-post.md --dry
```

### Batch publish a folder of drafts

```bash
node scripts/blog.mjs publish-batch drafts/
```

The CLI continues on individual failures and prints an `ok/failed` summary.
Slugs that collide with existing posts get `-2`, `-3`, ... appended.

### Edit an existing post

1. Find its slug:
   ```bash
   node scripts/blog.mjs list
   ```
2. Replace it with the contents of a markdown file:
   ```bash
   node scripts/blog.mjs edit my-post-slug drafts/my-post-v2.md
   ```

`edit` updates `title`, `body`, `read_time`, `excerpt` always, and updates
`tag` / `lang` / `date` / `cover` only if they appear in the front matter.
The slug itself is **not** changed.

### Delete a post

```bash
node scripts/blog.mjs delete my-post-slug
```

This is permanent; there is no undo.

## Safety rules for the agent

1. **Always confirm with the user before running `delete`** — even if they ask for
   it generally. Show the slug + title first, then run only after explicit "yes".
2. **Always confirm before `edit`** unless the user explicitly named the slug they
   want updated. The CLI overwrites the entire body.
3. For batch publishes that look heavy (more than ~5 files, or any file with a
   local `cover:`), run `--dry` first and show the user the preview before the real
   run.
4. Never invent a slug. If the user wants to edit a post, run `list` and confirm.
5. The CLI reads `.env.local` and **lets `.env.local` override the shell** — this
   is intentional. Do NOT export contradictory `DEEPSEEK_API_KEY` or `SUPABASE_SECRET_KEY`
   in the shell to "fix" things; edit `.env.local` instead.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY` | `.env.local` not in project root or missing keys | Verify `.env.local` is at `/Users/wanghe/workspace/Projects/PandaTalk8/.env.local` |
| `Missing CLOUDFLARE_R2_*` | R2 creds missing | Only required when a post has a local `cover:` path. Fill in or use a URL cover. |
| AI fallback (`[ai] ... — used fallback`) | DeepSeek 401/timeout/etc. | The post still publishes with `slugify(title)` + `tag: note`. Edit later via `edit` command. |
| Slug collision: post saved with `-2` suffix | Title was used before | Either accept the suffix, or supply an explicit `slug:` in front matter. |
