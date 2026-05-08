---
name: pt-blog
description: Publish, edit, list, or delete posts on the PandaTalk blog from local Markdown files via the site's HTTP API. Supports single-file ops, batch publish from a directory, and inline image upload to R2. Use when the user mentions publishing/editing/deleting blog posts, importing drafts, or syncing local markdown to the live site.
---

# PandaTalk blog operations

This skill manages posts on **pandatalk8.com** through a thin local CLI at
`scripts/blog.mjs` that calls the site's authenticated HTTP API
(`/api/v1/*`). The Next.js server holds all credentials (Supabase, R2,
DeepSeek) and runs the actual business logic — markdown rendering, AI
metadata, slug derivation, image upload, cache revalidation. The CLI does
nothing the API can't already do.

## Architecture

```
  CLI / skill ──Bearer BLOG_API_KEY──►  Next.js API (Vercel)
                                          ├── Supabase  (data)
                                          ├── R2        (images)
                                          └── DeepSeek  (slug/tag)
```

A successful write triggers `revalidatePath` on `/`, `/blog`, and
`/blog/<slug>` — the live site picks up changes on the next request.

## When to use

- User wants to publish one or more local `.md` files as blog posts.
- User wants to edit an existing post by replacing it from a local file.
- User wants to delete a post by slug.
- User wants to list or inspect what is currently published.

## CLI reference

Run from the project root:

```bash
node scripts/blog.mjs <command> [args]
```

| Command | Args | Effect |
| --- | --- | --- |
| `list` | — | Print all posts (date / tag / lang / slug / title) |
| `get` | `<slug>` | Print full post JSON |
| `publish` | `<file.md>` | Create one new post |
| `publish-batch` | `<dir>` | Publish every `*.md` in `<dir>` (one level only, sorted by name) |
| `edit` | `<slug> <file.md>` | Replace existing post body/title/etc. |
| `delete` | `<slug>` | Delete post permanently |

Append `--dry` to `publish` or `publish-batch` to preview without hitting
the database or uploading any files.

### Required env (in `.env.local`, also on Vercel)

| Var | Purpose |
| --- | --- |
| `BLOG_API_BASE_URL` | Default `https://pandatalk8.com`. Override for local dev / staging. |
| `BLOG_API_KEY` | Shared bearer secret. Same value on CLI side and server side. |

The CLI explicitly **overrides** any matching shell env var with the value
from `.env.local` — past sessions hit silent failures from a stale shell
`DEEPSEEK_API_KEY`, so the project file always wins.

## Markdown source format

```markdown
---
title: 我的标题                  # optional. fallback: first H1 in body, then filename
slug: my-slug                    # optional. AI generates Chinese-keyword slug if missing
tag: dev                         # optional. one of: essay | dev | growth | thought | uses | note
cover: ./images/cover.jpg        # optional. local path → uploaded to R2; full URL → used as-is
date: 2026-05-07                 # optional, ISO. defaults to today (server time)
lang: ZH                         # optional. ZH or EN. auto-detected from body if missing
excerpt: 一句话摘要               # optional. auto-derived from first paragraph >30 chars
read_time: 5 min                 # optional. auto-derived from word count
---

# 正文标题

正文内容…
```

All front-matter keys are flat strings (no arrays/objects). Anything not
provided is filled in by the server: AI slug + tag → today's date →
derived excerpt + read_time → ZH/EN auto-detection.

## Image uploads

- **Cover** images may be local file paths (`cover: ./images/foo.png`)
  or full URLs. Local paths are uploaded via `POST /api/v1/upload`.
- **Inline body images** (`![alt](path)` and raw `<img src="path">`) are
  also auto-uploaded. Each unique path is uploaded once per run, then
  every reference in the body is rewritten to the returned R2 URL before
  the post is sent. Paths with spaces (e.g. macOS "Application Support")
  are handled correctly.
- URLs (http/https) and `data:` URIs are left untouched.

## Typical flows

### Publish a single article

```bash
node scripts/blog.mjs publish drafts/my-post.md
```

### Preview before committing

```bash
node scripts/blog.mjs publish drafts/my-post.md --dry
```

### Batch publish a folder

```bash
node scripts/blog.mjs publish-batch drafts/
```

Continues on individual failures, prints an `ok / failed` summary at the
end. Slug collisions get `-2`, `-3`, ... appended automatically.

### Edit an existing post

```bash
node scripts/blog.mjs list                                 # find the slug
node scripts/blog.mjs edit my-post-slug drafts/my-v2.md
```

`edit` updates `body` and `read_time` + `excerpt` (re-derived). Other
fields update only if present in the file's front matter. The slug itself
never changes.

### Delete

```bash
node scripts/blog.mjs delete my-post-slug
```

Permanent. No undo.

## Safety rules for the agent

1. **Confirm before `delete`** — show the slug + title first, run only on
   explicit "yes".
2. **Confirm before `edit`** unless the user named the slug. `edit`
   replaces the entire body.
3. For heavy `publish-batch` runs (>5 files, or files with local `cover:`
   paths), run with `--dry` first and show the preview.
4. Never invent a slug. Use `list` to confirm.
5. Don't try to "fix" auth issues by exporting `BLOG_API_KEY` /
   `DEEPSEEK_API_KEY` etc. in the shell — the CLI's `.env.local` wins
   anyway, and any drift hides real config bugs.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `BLOG_API_KEY missing from .env.local` | env var absent | Add it; same value must be on the Vercel env list |
| `POST /api/v1/posts → 401 Unauthorized.` | local key ≠ server key | Re-sync `BLOG_API_KEY` between `.env.local` and Vercel env |
| `POST /api/v1/posts → 503 ... BLOG_API_KEY missing` | server-side env var missing on Vercel | Add `BLOG_API_KEY` in Vercel project settings, redeploy |
| `→ 500 R2 upload failed.` | R2 creds wrong on the server | Check Vercel env vars `CLOUDFLARE_R2_*` |
| Slug collision: post saved with `-2` suffix | Title was used before | Accept it, or set explicit `slug:` in front matter |
| Inline image `[img] missing, skipped: …` | Path doesn't resolve from the .md file's directory | Fix the path or use a full URL |
