#!/usr/bin/env node
// PandaTalk blog CLI — thin client for the /api/v1 endpoints.
//
//   node scripts/blog.mjs <subcommand> [args...]
//
// Subcommands:
//   list                       — list all posts
//   get <slug>                 — print one post as JSON
//   publish <file.md>          — create a post from a markdown file
//   publish-html <file.html>   — create a post from a complete HTML document
//   publish-batch <dir>        — publish every *.md in a directory
//   edit <slug> <file.md>      — replace a post's body/title/etc.
//   edit-html <slug> <file.html> — replace a post with a complete HTML document
//   delete <slug>              — delete a post
//   --dry                      — preview without writing (publish/publish-html/publish-batch)
//
// All write paths go through the API. The CLI only does:
//   1. Read .md files + parse frontmatter
//   2. Walk the markdown body and POST each local image to /api/v1/upload,
//      rewriting the path to the returned R2 URL
//   3. POST / PATCH / DELETE on /api/v1/posts (and /api/v1/posts/<slug>)
//
// No direct Supabase / R2 / DeepSeek access. Server holds those credentials.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// .env.local OVERRIDES the shell — opposite of Next.js's runtime default.
// Same rationale as before: the CLI is run by the project author who owns
// the keys in .env.local; an inherited shell var would otherwise silently
// outrank the project file.
//
// Exception: BLOG_API_BASE_URL is allowed to be overridden from the shell,
// so devs can do `BLOG_API_BASE_URL=http://localhost:3000 npm run blog ...`
// without editing .env.local. Any var listed in SHELL_OVERRIDABLE keeps its
// shell value if one was set.
const SHELL_OVERRIDABLE = new Set(["BLOG_API_BASE_URL"]);

async function loadDotEnv() {
  const file = path.join(ROOT, ".env.local");
  let content;
  try {
    content = await fs.readFile(file, "utf8");
  } catch {
    return;
  }
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (SHELL_OVERRIDABLE.has(key) && process.env[key]) continue;
    process.env[key] = val;
  }
}

await loadDotEnv();

const API_BASE = (process.env.BLOG_API_BASE_URL || "https://pandatalk8.com").replace(/\/$/, "");
const API_KEY = process.env.BLOG_API_KEY;

function ensureAuthed() {
  if (!API_KEY) {
    throw new Error("BLOG_API_KEY missing from .env.local — see .env.local.example");
  }
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
async function apiJson(method, path, body) {
  ensureAuthed();
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  };
  let bodyInit;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    bodyInit = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: bodyInit });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    const msg = data?.error || text || res.statusText;
    throw new Error(`${method} ${path} → ${res.status} ${msg}`);
  }
  return data;
}

async function apiUploadFile(absPath) {
  ensureAuthed();
  const buf = await fs.readFile(absPath);
  const mime = mimeFor(absPath);
  const blob = new Blob([buf], { type: mime });
  const filename = path.basename(absPath);
  const form = new FormData();
  form.append("file", blob, filename);
  const res = await fetch(`${API_BASE}/api/v1/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* */
  }
  if (!res.ok) throw new Error(`upload ${absPath} → ${res.status} ${data?.error || text}`);
  return data.url;
}

const MIME_BY_EXT = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};
function mimeFor(p) {
  const ext = path.extname(p).toLowerCase().replace(/^\./, "");
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Markdown helpers (stay local — no rendering, just reading + image rewriting)
// ---------------------------------------------------------------------------
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    meta[kv[1]] = val;
  }
  return { meta, body: m[2].replace(/^\r?\n/, "") };
}

function firstH1(body) {
  const m = body.match(/^[ \t]*#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : "";
}

function stripHtmlTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function firstHtmlTitle(body) {
  const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (title) return stripHtmlTags(title);
  const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  return h1 ? stripHtmlTags(h1) : "";
}

function htmlMetaContent(body, name) {
  const attr = String.raw`(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`;
  const re = new RegExp(String.raw`<meta\b(?=[^>]*${attr})[^>]*\bcontent=["']([^"']*)["'][^>]*>`, "i");
  const match = body.match(re);
  return match ? stripHtmlTags(match[1]) : "";
}

// Walk a markdown body, find every local image reference (`![alt](path)` and
// raw `<img src="path">`), upload each via /api/v1/upload, and rewrite the
// body to the public URL. Returns { body, count }.
async function rewriteInlineImages(body, sourceDir) {
  const cache = new Map(); // localAbsPath → publicUrl|null
  let count = 0;

  async function rewrite(rawPath) {
    const trimmed = rawPath.trim();
    if (/^(https?:|data:)/i.test(trimmed)) return null;
    let cleaned = trimmed.replace(/\s+(["'])[^"']*\1\s*$/, "");
    cleaned = cleaned.replace(/^["']|["']$/g, "").trim();
    const abs = path.isAbsolute(cleaned) ? cleaned : path.resolve(sourceDir, cleaned);
    if (cache.has(abs)) return cache.get(abs);
    try {
      await fs.access(abs);
    } catch {
      console.warn(`  [img] missing, skipped: ${cleaned}`);
      cache.set(abs, null);
      return null;
    }
    const url = await apiUploadFile(abs);
    cache.set(abs, url);
    count++;
    console.log(`  [img] ${cleaned} → ${url}`);
    return url;
  }

  const replacements = [];
  for (const m of body.matchAll(/(!\[[^\]]*\]\()([^)]+)(\))/g)) {
    replacements.push({ match: m });
  }
  for (const m of body.matchAll(/(<img\s[^>]*\bsrc=["'])([^"']+)(["'])/gi)) {
    replacements.push({ match: m });
  }
  replacements.sort((a, b) => a.match.index - b.match.index);

  let out = "";
  let cursor = 0;
  for (const { match } of replacements) {
    const [full, prefix, oldPath, suffix] = match;
    out += body.slice(cursor, match.index);
    const newUrl = await rewrite(oldPath);
    out += newUrl ? prefix + newUrl + suffix : full;
    cursor = match.index + full.length;
  }
  out += body.slice(cursor);
  return { body: out, count };
}

// ---------------------------------------------------------------------------
// Subcommands
// ---------------------------------------------------------------------------
async function cmdList() {
  const { posts } = await apiJson("GET", "/api/v1/posts");
  if (!posts?.length) {
    console.log("(no posts)");
    return;
  }
  for (const p of posts) {
    const tag = (p.tag || "").padEnd(8);
    const lang = (p.lang || "").padEnd(2);
    console.log(`${p.date}  ${tag}  ${lang}  /${p.slug}  ·  ${p.title}`);
  }
}

async function cmdGet(slug) {
  if (!slug) throw new Error("usage: blog get <slug>");
  const { post } = await apiJson("GET", `/api/v1/posts/${encodeURIComponent(slug)}`);
  console.log(JSON.stringify(post, null, 2));
}

async function cmdPublish(file, opts = {}) {
  if (!file) throw new Error("usage: blog publish <file.md>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body: rawBody } = parseFrontmatter(text);

  const title = (
    meta.title ||
    firstH1(rawBody) ||
    path.basename(file, path.extname(file))
  ).trim();
  if (!title) throw new Error(`${file}: title is empty`);
  if (!rawBody.trim()) throw new Error(`${file}: body is empty`);

  // --tag overrides whatever's in frontmatter / what AI would pick.
  const overrideTag = opts.tag ? opts.tag : null;

  // Cover (if local path) — upload first.
  let cover = (meta.cover || "").trim() || null;
  if (cover && !/^https?:\/\//i.test(cover)) {
    const abs = path.isAbsolute(cover) ? cover : path.resolve(path.dirname(file), cover);
    if (opts.dry) {
      cover = `[dry-run] would upload ${abs}`;
    } else {
      cover = await apiUploadFile(abs);
      console.log(`  [cover] uploaded → ${cover}`);
    }
  }

  // Inline images. Skipped on dry-run (we don't want to touch R2 on a preview).
  let body = rawBody;
  if (!opts.dry) {
    const { body: rewritten, count } = await rewriteInlineImages(rawBody, path.dirname(file));
    body = rewritten;
    if (count > 0) console.log(`  [img] uploaded ${count} inline image(s)`);
  }

  const payload = {
    title,
    body_md: body,
    slug: meta.slug || undefined,
    tag: overrideTag || meta.tag || undefined,
    cover: cover ?? undefined,
    date: meta.date || undefined,
    lang: meta.lang || undefined,
    excerpt: meta.excerpt || undefined,
    read_time: meta.read_time || undefined,
  };

  if (opts.dry) {
    console.log(`[dry-run] ${file} →`);
    const preview = { ...payload, body_md: `${body.slice(0, 200)}…` };
    console.log(JSON.stringify(preview, null, 2));
    return null;
  }

  const { post } = await apiJson("POST", "/api/v1/posts", payload);
  console.log(`✓ published /${post.slug}  ·  ${post.title}`);
  return post.slug;
}

async function cmdPublishHtml(file, opts = {}) {
  if (!file) throw new Error("usage: blog publish-html <file.html>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body } = parseFrontmatter(text);

  const title = (
    meta.title ||
    firstHtmlTitle(body) ||
    path.basename(file, path.extname(file))
  ).trim();
  if (!title) throw new Error(`${file}: title is empty`);
  if (!body.trim()) throw new Error(`${file}: body is empty`);

  const payload = {
    title,
    body_html: body,
    body_format: "html_document",
    slug: meta.slug || undefined,
    tag: opts.tag || meta.tag || undefined,
    cover: meta.cover || undefined,
    date: meta.date || undefined,
    lang: meta.lang || undefined,
    excerpt:
      meta.excerpt ||
      meta.description ||
      htmlMetaContent(body, "description") ||
      htmlMetaContent(body, "og:description") ||
      undefined,
    read_time: meta.read_time || undefined,
  };

  if (opts.dry) {
    console.log(`[dry-run] ${file} →`);
    const preview = { ...payload, body_html: `${body.slice(0, 200)}…` };
    console.log(JSON.stringify(preview, null, 2));
    return null;
  }

  const { post } = await apiJson("POST", "/api/v1/posts", payload);
  console.log(`✓ published HTML document /${post.slug}  ·  ${post.title}`);
  return post.slug;
}

async function cmdPublishBatch(dir, opts = {}) {
  if (!dir) throw new Error("usage: blog publish-batch <dir>");
  const stat = await fs.stat(dir).catch(() => null);
  if (!stat || !stat.isDirectory()) throw new Error(`not a directory: ${dir}`);

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter((d) => d.isFile() && d.name.endsWith(".md"))
    .map((d) => path.join(dir, d.name))
    .sort();

  if (files.length === 0) {
    console.log("(no .md files found)");
    return;
  }

  console.log(`Publishing ${files.length} file(s) from ${dir}…`);
  let ok = 0;
  let fail = 0;
  for (const f of files) {
    try {
      await cmdPublish(f, opts);
      ok++;
    } catch (e) {
      fail++;
      console.error(`✗ ${f}: ${e.message}`);
    }
  }
  const verb = opts.dry ? "previewed" : "published";
  console.log(`---\n${ok} ${verb}, ${fail} failed (of ${files.length})`);
}

async function cmdEdit(slug, file) {
  if (!slug || !file) throw new Error("usage: blog edit <slug> <file.md>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body: rawBody } = parseFrontmatter(text);
  if (!rawBody.trim()) throw new Error(`${file}: body is empty`);

  const { body, count } = await rewriteInlineImages(rawBody, path.dirname(file));
  if (count > 0) console.log(`  [img] uploaded ${count} inline image(s)`);

  const patch = { body_md: body };
  if (meta.title) patch.title = meta.title;
  if (meta.tag) patch.tag = meta.tag;
  if (meta.lang) patch.lang = meta.lang;
  if (meta.date) patch.date = meta.date;
  if (meta.excerpt) patch.excerpt = meta.excerpt;
  if (meta.read_time) patch.read_time = meta.read_time;

  if (Object.prototype.hasOwnProperty.call(meta, "cover")) {
    let cover = (meta.cover || "").trim() || null;
    if (cover && !/^https?:\/\//i.test(cover)) {
      const abs = path.isAbsolute(cover) ? cover : path.resolve(path.dirname(file), cover);
      cover = await apiUploadFile(abs);
      console.log(`  [cover] uploaded → ${cover}`);
    }
    patch.cover = cover;
  }

  const { post } = await apiJson(
    "PATCH",
    `/api/v1/posts/${encodeURIComponent(slug)}`,
    patch
  );
  console.log(`✓ updated /${post.slug}`);
}

async function cmdEditHtml(slug, file) {
  if (!slug || !file) throw new Error("usage: blog edit-html <slug> <file.html>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body } = parseFrontmatter(text);
  if (!body.trim()) throw new Error(`${file}: body is empty`);

  const patch = {
    body_html: body,
    body_format: "html_document",
  };
  if (meta.title) patch.title = meta.title;
  if (meta.tag) patch.tag = meta.tag;
  if (meta.lang) patch.lang = meta.lang;
  if (meta.date) patch.date = meta.date;
  if (meta.excerpt || meta.description) patch.excerpt = meta.excerpt || meta.description;
  if (meta.read_time) patch.read_time = meta.read_time;
  if (Object.prototype.hasOwnProperty.call(meta, "cover")) {
    patch.cover = (meta.cover || "").trim() || null;
  }

  const { post } = await apiJson(
    "PATCH",
    `/api/v1/posts/${encodeURIComponent(slug)}`,
    patch
  );
  console.log(`✓ updated HTML document /${post.slug}`);
}

async function cmdDelete(slug) {
  if (!slug) throw new Error("usage: blog delete <slug>");
  await apiJson("DELETE", `/api/v1/posts/${encodeURIComponent(slug)}`);
  console.log(`✓ deleted /${slug}`);
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
function usage() {
  console.log(`PandaTalk blog CLI

usage:
  node scripts/blog.mjs <command> [args]

commands:
  list                          list all posts
  get <slug>                    print full post JSON
  publish <file.md>             create a post from a markdown file
  publish-html <file.html>      create a post from a complete HTML document
  publish-batch <dir>           publish every *.md in a directory
  edit <slug> <file.md>         replace post body/title/etc.
  edit-html <slug> <file.html>  replace post with a complete HTML document
  delete <slug>                 delete post by slug
  --dry                         (with publish/publish-batch) preview only
  --tag <value>                 (with publish/publish-batch) override every
                                post's tag with this value, regardless of
                                what's in frontmatter or what AI suggests.
                                Use for directory-as-category batches, e.g.
                                  --tag AI技术 / --tag 创业与IP

env (read from .env.local; .env.local OVERRIDES the shell):
  BLOG_API_BASE_URL    e.g. https://pandatalk8.com  (default)
  BLOG_API_KEY         bearer token (must match server)`);
}

function readFlagValue(argv, name) {
  const eqMatch = argv.find((a) => a.startsWith(`${name}=`));
  if (eqMatch) return eqMatch.slice(name.length + 1);
  const idx = argv.indexOf(name);
  if (idx >= 0 && idx + 1 < argv.length && !argv[idx + 1].startsWith("--")) {
    return argv[idx + 1];
  }
  return null;
}

const argv = process.argv.slice(2);
const cmd = argv[0];
const flags = new Set(argv.filter((a) => a.startsWith("--") && !a.includes("=")));
const tagValue = readFlagValue(argv, "--tag");
// Strip flag values from positional list so `--tag X file.md` works.
const positional = (() => {
  const out = [];
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      // Skip flag and (if it took a value via next arg) skip the value too.
      if (!a.includes("=") && a === "--tag" && i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
        i++;
      }
      continue;
    }
    out.push(a);
  }
  return out;
})();
const opts = { dry: flags.has("--dry"), tag: tagValue };

const COMMANDS = {
  list: () => cmdList(),
  get: () => cmdGet(positional[0]),
  publish: () => cmdPublish(positional[0], opts),
  "publish-html": () => cmdPublishHtml(positional[0], opts),
  "publish-batch": () => cmdPublishBatch(positional[0], opts),
  edit: () => cmdEdit(positional[0], positional[1]),
  "edit-html": () => cmdEditHtml(positional[0], positional[1]),
  delete: () => cmdDelete(positional[0]),
};

if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h" || !COMMANDS[cmd]) {
  usage();
  process.exit(cmd && !COMMANDS[cmd] ? 1 : 0);
}

try {
  await COMMANDS[cmd]();
} catch (e) {
  console.error(`ERROR: ${e?.message || e}`);
  process.exit(1);
}
