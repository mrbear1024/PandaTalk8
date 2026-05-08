# Handoff: 熊猫老板 Personal Website

## Overview

A bilingual (Chinese primary / English secondary) personal website for **熊猫老板 (PandaTalk / Panda)** — an ex-engineer turned solo AI founder, indie hacker, and AI content creator. The site serves three purposes:

1. **Home** — a warm introduction, "now" status, latest writing, featured projects
2. **Blog** — long-form writing in Chinese and English about indie building, AI, and creator journey
3. **Projects** — shipped products, works-in-progress, and ideas
4. **About** — bio, timeline, stats, social links

Audience: fellow developers/engineers, AI founders & indie hackers, the owner's X audience.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype of the intended look, layout, and behavior. They are not production code to copy directly.

The task is to **recreate this design in the target codebase's existing environment** using its established patterns and libraries. If no environment exists yet, pick an appropriate stack — this site is a strong fit for **Next.js + MDX** (static export + real markdown blog), **Astro** (great for personal sites with islands for the React-y pieces), or **Hugo/Eleventy** if the owner prefers a pure-static setup.

The prototype is built as a single-page React app with hash routing purely so the whole experience loads in one HTML file for preview; in production, real routes and real MDX content should replace the data array in `data.js`.

## Fidelity

**High-fidelity (hifi)**. All colors, typography, spacing, borders, shadows, and interactions are final. Copy is placeholder — the owner needs to replace project names, blog content, socials, and the About bio — but all visual decisions should be preserved pixel-perfectly.

## Design System

### Aesthetic direction

Warm paper + ink editorial with a hacker/terminal undertone. The pixel-art panda avatar is the brand anchor. Think: a developer's zine, not a corporate site.

- **Paper cream background** with subtle SVG noise texture (feTurbulence, opacity ≈ 0.05)
- **Hard ink borders** (1.5px solid) with **offset block-color shadows** (no blur) — gives a risograph/print feel
- **Asymmetric editorial layouts** — big display type left, content right
- **ASCII ornaments** (`§`, `▸`, `━`, `· · · 🐼 · · ·`) as dividers and section markers
- **Monospace for UI chrome** (nav, tags, meta, labels) — ties to the developer identity
- **Italic serif for emphasis + accent words** in headlines

### Color tokens

```css
/* Paper + ink (light theme) */
--paper:       #F5EEE0;  /* body bg */
--paper-2:     #EEE4D1;  /* card bg */
--paper-3:     #E5D8BF;  /* code bg, subtle fills */
--ink:         #1A1A1A;  /* primary text, hard borders */
--ink-2:       #3A352E;  /* body prose */
--ink-3:       #6B6458;  /* muted / secondary text */
--ink-4:       #9A9182;  /* tertiary, dividers */
--rule:        #2a2a2a;  /* strong rules */
--rule-soft:   #c8bfa8;  /* dashed/soft dividers */

/* Accents (pulled from the panda avatar) */
--panda-red:       #C8532A;  /* primary accent — red scarf */
--panda-red-deep:  #A03E1D;  /* links, hover */
--bamboo:          #2E6B3F;  /* success, "shipped" status */
--bamboo-deep:     #1F4A2B;
--mustard:         #C9923B;  /* "wip" status */
```

**Dark theme** (inverted, ink background with cream text):
```css
--paper: #141210;  --paper-2: #1B1814;  --paper-3: #25201A;
--ink:   #ECE4D3;  --ink-2:   #D6CCB6;  --ink-3:   #9E9684;  --ink-4: #6B6456;
--rule:  #bfb8a6;  --rule-soft: #3a342a;
/* Accents (red/green/mustard) stay the same */
```

### Typography

**Three families, each with a clear role:**

| Role | Family | Notes |
|------|--------|-------|
| Display (H1/H2, hero) | `Instrument Serif` (EN) + `Noto Serif SC` (ZH) | Italic variant used for accent words in headlines, colored `--panda-red-deep` |
| Body / UI | `Hack Nerd Font Propo` (EN) + `Noto Sans SC` (ZH) | Hack gives the site a developer-zine feel; Noto Sans SC handles CJK |
| Mono / chrome | `Hack Nerd Font Mono`, fallback `Sauce Code Pro Nerd Font Mono` | Nav, tags, meta, code, labels, footer |

Hack Nerd Font and Sauce Code Pro Nerd Font are self-hosted (see `fonts/` in the prototype). Instrument Serif, Noto Serif SC, and Noto Sans SC come from Google Fonts.

**Scale** (fluid with `clamp`):
```css
--step--1: clamp(0.78rem, 0.75rem + 0.15vw, 0.875rem);
--step-0:  clamp(0.95rem, 0.9rem + 0.25vw, 1.05rem);    /* body */
--step-1:  clamp(1.1rem, 1.02rem + 0.4vw, 1.25rem);     /* lede */
--step-2:  clamp(1.35rem, 1.2rem + 0.7vw, 1.6rem);      /* h4 */
--step-3:  clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem);     /* h3 */
--step-4:  clamp(2.4rem, 1.9rem + 2.2vw, 3.5rem);       /* h2 */
--step-5:  clamp(3.25rem, 2.4rem + 3.8vw, 5.5rem);      /* hero h1 */
```

Body line-height 1.65 (UI) / 1.75–1.8 (prose). Display line-height 1.15, `letter-spacing: -0.01em` to -0.02em. Prose uses `text-wrap: pretty`; headings use `text-wrap: balance`.

### Spacing scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px — tokens `--sp-1` through `--sp-9`.

### Radii & shadows

- `--radius: 2px` — chips, small elements (deliberately small — this is a paper/print look, not rounded-modern)
- `--radius-md: 6px` — cards, frames, buttons
- **Shadows are hard, no blur**. Formula: `<offset-x> <offset-y> 0 <color>`
  - Buttons: `3px 3px 0 var(--panda-red)` default, `4px 4px 0 var(--panda-red)` on hover (plus `translate(-1px, -1px)`)
  - Project cards: `4px 4px 0 var(--ink)` default, `6px 6px 0 var(--panda-red)` on hover
  - Hero portrait: `8px 8px 0 var(--panda-red)`
  - About avatar card: `5px 5px 0 var(--bamboo)`
  - Tweaks panel: `5px 5px 0 var(--panda-red)`

### Layout widths

- `--max-w: 1160px` — page container
- `--read-w: 68ch` — article prose column
- Narrow container: `760px` — for article header and detail pages

## Screens / Views

### 1. Home (`#/`)

Sticky translucent header (backdrop-blur 6px, `color-mix(in oklab, bg 82%, transparent)`), then:

- **Hero** — 2-column grid (1.3fr / 1fr). Left: kicker with pulsing red dot, giant H1 with italic red accent word ("熊猫老板"), lede paragraph, two CTAs (primary ink button with red shadow, ghost variant), live "now" bar. Right: avatar portrait in a framed card with a rotated "est. 2025" corner stamp and a mono caption below.
- **ASCII divider**: `━━━━━━ 最近写的 · recent writing ━━━━━━`
- **Section head** (`§ 01 · Blog`) + latest 4 post rows
- **Section head** (`§ 02 · Projects`) + 3 featured project cards
- **Section head** (`§ 03 · Elsewhere`) + socials row

Below 820px: hero collapses to single column, portrait shrinks to 220px max-width and left-aligns.

### 2. Blog index (`#/blog`)

- Page intro: 2-column (`auto 1fr`). Left: `§ 01 — writing` eyebrow + big H1 "博客" with italic "Notes" accent. Right: description paragraph (ZH + smaller EN).
- Tag filter row — pill buttons, active shows count in parens.
- Post list — same row component as home (date / title+excerpt+tags / readTime).

### 3. Article (`#/blog/<slug>`)

- Narrow container (760px)
- Back link ("← all posts")
- Article header: eyebrow (tag · lang), H1, optional italic English subtitle, meta row with top+bottom rules (date · readTime · author)
- Prose column (68ch) with serif-italic pull-quote style blockquotes, dashed red-marker list bullets
- Footer ASCII divider `━━━ 完 · fin ━━━` + small thanks note

### 4. Projects index (`#/projects`)

- Page intro — `§ 02 — projects` / "做的 东西"
- Three groups rendered as sections: **Shipped**, **In Progress**, **Ideas** — each with its own section head showing count, and a `repeat(auto-fill, minmax(320px, 1fr))` grid of project cards.

### 5. Project detail (`#/projects/<slug>`)

- Narrow container
- Back link
- Header: 72px glyph tile (mono, ink border, red shadow) + title stack (H1 + year/status)
- Italic serif description
- Meta row: "stack:" + tag pills
- Prose body

### 6. About (`#/about`)

- Page intro — `§ 03 — about` / "关于 我"
- 2-column grid (1fr / 1.6fr, 48px gap). Left: sticky (top 120px) avatar card with bamboo-green offset shadow, name, handle, mono stats list (location, status, years coding, years solo, coffee/day), socials. Right: prose sections with H2s prefixed by a red rule mark, and a `<ul class="timeline">` where each `<li>` is a 2-col grid (year in red mono / event with muted detail below).

Below 820px: grid stacks, sticky disables.

## Components

### Header / Nav

- Sticky, `backdrop-filter: blur(6px) saturate(140%)`, background = `color-mix(in oklab, bg 82%, transparent)`
- Left: brand avatar (40×40 pixelated `image-rendering: pixelated`, 2px ink border, `box-shadow: 2px 2px 0 var(--panda-red)`) + name stack ("Panda" 1.05rem display / "solo / ai / builder" 0.72rem mono uppercase muted)
- Right: nav links (mono 0.85rem, color `--ink-2`, active state prefixes link with `▸ ` in red and turns text `--panda-red-deep`)
- Theme toggle pill button: "◐ dark" / "◑ light", 1px border, 999px radius, 4/10 padding, 0.75rem mono

### Footer

`padding: 48px 0 32px`, top border 1px soft rule, mono 0.8rem muted text, inner is flex-between (copyright left, link list right).

### Buttons

```css
.btn          /* filled ink, panda-red offset shadow 3/3, lifts on hover */
.btn.ghost    /* transparent, ink text, soft rule shadow */
```
Padding `10px 18px`, mono 0.85rem, `letter-spacing: 0.04em`, border 1.5px, radius 6px. Hover: `translate(-1px, -1px)` + bigger shadow. Active: `translate(1px, 1px)` + smaller shadow.

### Eyebrow

Mono 0.75rem, uppercase, `letter-spacing: 0.16em`, muted. Prefixed by a 24×1px horizontal rule: `content: "";` + `background: currentColor`.

### Tag chips

Mono 0.7rem uppercase, 2/8 padding, 1px border, 999px radius. Variants: default (paper-2 bg), `.red`, `.green`, `.mustard` — each mixes the accent at 12% into paper for bg and 30% into rule for border.

### Post row

`display: grid; grid-template-columns: 110px 1fr auto;` — mono date column, middle has display-serif title (hover → red), muted excerpt, two tag chips, right side has mono readTime aligned baseline. Dashed soft-rule bottom border. Below 680px: single column.

### Project card

`<a>` with ink border + 4/4 ink offset shadow, hover lifts 2/2 and swaps shadow to panda-red. Inner: head row (48px mono glyph tile + status chip with colored dot), H3 title, muted description, bottom meta row (stack tag pills / year) separated by dashed rule.

Status chips use a 7×7 dot: bamboo = shipped, mustard = wip, ink-4 = idea.

### Now bar

Flex row: bamboo dot with pulsing box-shadow animation (2s ease-in-out) → uppercase mono label → body text. Paper-2 bg, soft rule border, 6px radius.

### Tweaks panel (floating)

Fixed bottom-right, 260px wide, ink border, 5/5 red offset shadow. Contains accent swatches (4 colors, active gets double ring) and theme select.

## Interactions & Behavior

- **Route transitions**: fade + 8px translateY over 300ms (`@keyframes fadeUp`) — triggered by a `.route-enter` class on each page root.
- **Hash routing**: `window.location.hash` listened via `hashchange`; scroll resets to top on navigation.
- **Theme toggle**: sets `document.documentElement[data-theme]`, persists to `localStorage["pt-theme"]`, read on boot.
- **Nav active state**: first hash segment matches item key.
- **Tag filter on blog**: local `useState`, filters the posts array.
- **Selection color**: `::selection` uses `color-mix(in oklab, var(--panda-red) 40%, transparent)`.
- **Scrollbar**: custom styled (10px, paper-2 track, ink-4 thumb).
- **Kicker dot blink**: 2s ease-in-out, opacity 1 → 0.25 at 85% → 1 (feels like a terminal cursor, not a full pulse).
- **Now bar dot pulse**: 2s ease-in-out, box-shadow ring expands 3px → 6px and fades.

No JavaScript libraries beyond React. No icon library — everything is Unicode or ASCII (`§`, `▸`, `◐`, `●`, `━`, `←`).

## State & Content

All content lives in `data.js` as three globals: `SITE`, `POSTS`, `PROJECTS`, `ABOUT`. In a production port, replace with:

- **`POSTS`** → MDX files in `/content/blog/` with frontmatter (`slug, date, readTime, lang, tag, title, titleEn, excerpt`)
- **`PROJECTS`** → JSON or MDX in `/content/projects/` with the same fields + `long` body
- **`ABOUT` + `SITE`** → a single `/content/site.yml` or TypeScript config
- **Socials** — the owner needs to supply real handles; current values in `data.js` are placeholders (`x.com`, `github.com`, `hi@pandatalk.dev`).

## Design Tokens (full list)

See `styles.css` in this handoff — the `:root { ... }` block is the source of truth. Key tokens:

- **Color:** `--paper`, `--paper-2`, `--paper-3`, `--ink`, `--ink-2`, `--ink-3`, `--ink-4`, `--rule`, `--rule-soft`, `--panda-red`, `--panda-red-deep`, `--bamboo`, `--bamboo-deep`, `--mustard`
- **Typography:** `--font-display`, `--font-body`, `--font-mono`, `--font-terminal`, `--font-serif-en`, `--font-serif-zh`, `--font-sans-en`, `--font-sans-zh`, and size steps `--step--1` → `--step-5`
- **Spacing:** `--sp-1` (4px) → `--sp-9` (96px)
- **Radii:** `--radius` (2px), `--radius-md` (6px)
- **Layout:** `--max-w` (1160), `--read-w` (68ch)

## Assets

- `assets/panda-avatar.png` — the pixel-art panda avatar provided by the owner. Rendered with `image-rendering: pixelated` everywhere. Used as favicon, header brand, hero portrait, and About card.
- `fonts/HackNerdFont*.ttf`, `HackNerdFontMono*.ttf`, `HackNerdFontPropo*.ttf`, `SauceCodeProNerdFontMono-Regular.ttf` — self-hosted Nerd Fonts (OFL/Apache 2.0). Preserve these in the target project's `public/fonts/` or equivalent.
- Google Fonts: `Instrument Serif`, `Noto Sans SC`, `Noto Serif SC`.

No icon set is used — the design is intentionally icon-free, leaning on Unicode symbols and the panda avatar as the sole illustration.

## Responsive behavior

Two meaningful breakpoints:
- **820px**: hero stacks; page-intro stacks; about-grid stacks; sticky side disables.
- **680px**: post rows collapse to single column.

Container padding stays at 32px (`--sp-6`) across breakpoints; no hamburger menu — 4 nav items fit on mobile at mono 0.85rem with `--sp-5` gaps.

## Files in this handoff

- `README.md` (this file)
- `index.html` — page shell, font imports, script tags, theme boot
- `styles.css` — all design tokens + component styles (~720 lines, single file is fine)
- `data.js` — content (SITE / POSTS / PROJECTS / ABOUT)
- `components/Shell.jsx` — Nav, Footer, ThemeToggle, Socials, ASCIIDivider, formatDate, useHashRoute
- `components/Home.jsx` — Home + PostRow + ProjectCard (PostRow and ProjectCard are used on Home, Blog index, and Projects index — lift them to their own file in production)
- `components/Blog.jsx` — BlogIndex + Article
- `components/Projects.jsx` — ProjectsIndex + Group + ProjectDetail
- `components/About.jsx` — About (with simple `**bold**` parser for paragraphs)
- `components/Tweaks.jsx` — runtime theme/accent tweak panel (safe to drop in production)
- `components/App.jsx` — routing root
- `assets/panda-avatar.png` — brand avatar
- `fonts/` — Hack Nerd Font + Sauce Code Pro Nerd Font TTFs

## Notes for the implementer

- The **offset hard shadows** are a signature. Resist the urge to soften them with blur or rounding — they're what makes this feel like a zine, not a SaaS landing page.
- The **pixelated avatar** must use `image-rendering: pixelated` (and `crisp-edges` as a fallback) — if it blurs, the whole piece loses its voice.
- For the blog, ship **real MDX** with proper per-post frontmatter and prose renderers — the placeholder `body: [{type, text}]` array shape exists only so the prototype could ship in a single file.
- The owner should supply real content before launch: project names, blog posts, social handles, and the About bio. Every number currently on the site (follower counts, users, dates) is a placeholder.
- RSS is listed in the footer but not implemented — add it when wiring real MDX.
- Consider adding `prefers-reduced-motion` media queries to disable the kicker blink, now-bar pulse, and route-enter animation.
