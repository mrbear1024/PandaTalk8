# PandaTalk

Personal blog + projects + about site for **熊猫老板 / PandaTalk** — built from
the design handoff in `ui_design/` using **Next.js 14 (App Router) + TypeScript
+ Supabase**.

## Stack

- **Next.js 14** (App Router, RSC, static-friendly)
- **TypeScript** strict mode
- **Supabase** (Postgres) — content store for `posts` and `projects`
- **Plain CSS** — the design system from `ui_design/styles.css` is ported 1:1
  to `app/globals.css`. No Tailwind, no UI library — the design is intentionally
  minimal and uses self-hosted Hack Nerd Fonts + Google Fonts (Instrument Serif,
  Noto Serif SC, Noto Sans SC).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # optional — see Supabase below
npm run dev
```

The site renders from local seed data (`lib/seed.ts`) when Supabase env vars
are not set, so `npm run dev` works out of the box.

## Routes

| Route                          | Source                                           |
| ------------------------------ | ------------------------------------------------ |
| `/`                            | Hero, latest posts, featured projects, socials   |
| `/blog`                        | All posts, filterable by tag                     |
| `/blog/[slug]`                 | Article                                          |
| `/projects`                    | Grouped by status: Shipped / In progress / Ideas |
| `/projects/[slug]`             | Project detail                                   |
| `/about`                       | Bio, stats, timeline                             |
| `/admin`                       | Dashboard (auth required)                        |
| `/admin/posts`                 | Post list, edit/delete                           |
| `/admin/posts/new`             | New post form                                    |
| `/admin/posts/[slug]/edit`     | Edit post                                        |
| `/admin/projects`              | Project list, edit/delete                        |
| `/admin/projects/new`          | New project form                                 |
| `/admin/projects/[slug]/edit`  | Edit project                                     |
| `/admin/login`                 | Login form                                       |

Public routes are statically generated at build time via `generateStaticParams`
(unknown slugs added through admin are SSR'd on first request, then cached). All
admin routes are dynamic and gated by middleware.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` to create the `posts` and
   `projects` tables (with public-read RLS policies).
3. Optionally, run `supabase/seed.sql` to populate initial content matching the
   design handoff.
4. Copy your project URL and anon key into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
   ```

5. Restart `npm run dev`. The site will now read from Supabase. If the fetch
   fails for any reason, the data layer (`lib/posts.ts`, `lib/projects.ts`)
   falls back to local seed data so the page never blanks out in production.

### Adding content

Insert rows into `posts` or `projects` via the Supabase dashboard or any
Postgres client. The `body` column on `posts` is `jsonb` and follows the shape
of `lib/types.ts:PostBodyBlock` — an array of `{type: "p"|"h2"|"h3", text}`
blocks. (Swap this for MDX later if you want richer content.)

## Admin

The admin lives at **`/admin`** and is gated by a single password (single-user
blog — no multi-user accounts). Auth is a signed cookie (`HMAC-SHA256` of the
expiry, keyed by `ADMIN_PASSWORD`). 7-day session. Rotating the password
invalidates all sessions.

### Setup

Add to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=...   # service role key, NOT the anon key — server-only
ADMIN_PASSWORD=...              # pick anything strong
```

Then visit `/admin` and sign in. The middleware (`middleware.ts`) redirects to
`/admin/login` for any unauthenticated `/admin/*` request.

Writes go through Server Actions (`app/admin/_actions/*.ts`) using the **service
role** Supabase client (`lib/supabase-admin.ts`), which bypasses RLS. Public
reads keep using the anon key. After every mutation the affected paths are
revalidated via `revalidatePath`, so changes appear on the public site
immediately.

### Body editor

The post `body` column is a `jsonb` array of `{type: "p"|"h2"|"h3", text}`
blocks. The admin renders this as a textarea with markdown-lite syntax —
`## …` becomes an h2, `### …` becomes an h3, anything else is a paragraph.
Blank lines are skipped. See `lib/body-parser.ts`.

### About + site config

`SITE` (socials, "now" status) and `ABOUT` (bio sections, timeline) live in
`lib/site.ts`. They change rarely enough that hardcoding them keeps the schema
simpler — move them into Supabase if you want a CMS-style edit flow.

## Project layout

```
app/                    # App Router pages
  layout.tsx            # root <html>, theme boot, fonts (no Nav/Footer)
  globals.css           # ported design system + admin styles
  not-found.tsx
  (site)/               # public pages share Nav + Footer
    layout.tsx
    page.tsx            # home
    blog/               # /blog and /blog/[slug]
    projects/           # /projects and /projects/[slug]
    about/page.tsx
  admin/                # admin (gated)
    layout.tsx          # AdminNav
    page.tsx            # dashboard
    login/              # login form
    posts/              # list, new, [slug]/edit
    projects/           # list, new, [slug]/edit
    _actions/           # server actions: auth.ts, posts.ts, projects.ts
middleware.ts           # gates /admin/*
components/             # Nav, Footer, ThemeToggle, PostRow, ProjectCard, ...
  admin/                # AdminNav, PostForm, ProjectForm, DeleteForm
lib/
  supabase.ts           # public anon client
  supabase-admin.ts     # service-role client (server-only)
  posts.ts / projects.ts# public read with seed fallback
  admin-fetch.ts        # admin reads (no fallback, real errors)
  body-parser.ts        # markdown-lite ↔ jsonb blocks
  auth.ts               # cookie HMAC helpers (Web Crypto)
  seed.ts               # local fallback data
  site.ts               # SITE + ABOUT config
  types.ts              # shared TS types
  format.ts             # date formatter
public/
  assets/panda-avatar.png
  fonts/                # Hack Nerd Font + Sauce Code Pro Nerd Font
supabase/
  schema.sql            # CREATE TABLE + RLS policies
  seed.sql              # initial INSERTs matching ui_design/data.js
ui_design/              # original design handoff (untouched, for reference)
```

## Scripts

```bash
npm run dev         # next dev
npm run build       # next build (static-prerenders all routes)
npm start           # next start
npm run typecheck   # tsc --noEmit
```

## Deploying

This is a stock Next.js 14 app. It deploys cleanly on Vercel, Netlify, or any
Node host. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
in the host's environment to wire it to your Supabase project.
