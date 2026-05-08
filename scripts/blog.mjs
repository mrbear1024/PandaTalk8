#!/usr/bin/env node
// PandaTalk blog CLI
//
//   node scripts/blog.mjs <subcommand> [args...]
//
// Subcommands:
//   list                       — list all posts (date / tag / lang / slug / title)
//   get <slug>                 — print full post JSON
//   publish <file.md>          — create a post from a markdown file (frontmatter optional)
//   publish-batch <dir>        — publish every *.md in a directory
//   edit <slug> <file.md>      — replace an existing post's body/title/etc.
//   delete <slug>              — delete a post by slug
//   --dry                      — append to publish/publish-batch to preview only
//
// Reads .env.local for Supabase / R2 / DeepSeek credentials. No dev server needed.

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Env loading. Read .env.local manually so the CLI is independent of Next.js.
// .env.local OVERRIDES the shell — opposite of Next.js's default. Reason:
// the CLI is run from the same project tree by an author who owns the keys
// in .env.local; an inherited shell var (e.g. a stale fish universal var)
// would otherwise silently outrank the project file and cause confusing 401s.
// ---------------------------------------------------------------------------
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
    process.env[key] = val;
  }
}

// ---------------------------------------------------------------------------
// Inline copies of the small helpers in lib/post-derive.ts. Duplicated rather
// than imported because lib code is TypeScript with `server-only` markers that
// don't run cleanly under plain node.
// ---------------------------------------------------------------------------
function slugify(title) {
  return (
    title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿㐀-䶿豈-﫿\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `post-${Date.now()}`
  );
}

function deriveReadTimeFromText(text) {
  const cjk = (text.match(/[一-鿿]/g) ?? []).length;
  const latin = (text.replace(/[一-鿿]/g, " ").match(/\S+/g) ?? []).length;
  const minutes = Math.max(1, Math.ceil((cjk + latin) / 220));
  return `${minutes} min`;
}

function deriveExcerptFromText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const first = lines.find((l) => l.length > 30) ?? lines[0] ?? "";
  return clipExcerpt(first);
}

function clipExcerpt(text) {
  const t = text.trim();
  if (t.length <= 180) return t;
  return t.slice(0, 177).trimEnd() + "…";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function detectLang(text) {
  return /[一-鿿]/.test(text) ? "ZH" : "EN";
}

// ---------------------------------------------------------------------------
// Front matter — flat string keys only. Keep deps zero.
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

function markdownToHtml(md) {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(md);
}

function plainTextFromMarkdown(md) {
  // Keep \n between blocks so deriveExcerptFromText can pick a real paragraph
  // (it skips lines shorter than 30 chars — i.e. headings).
  return md
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/^[#>*_~-]+\s*/gm, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Service clients
// ---------------------------------------------------------------------------
function getDB() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

let _r2 = null;
function getR2() {
  if (_r2) return _r2;
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing CLOUDFLARE_R2_* credentials in .env.local");
  }
  _r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _r2;
}

const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

async function uploadCover(localPath) {
  const buf = await fs.readFile(localPath);
  const ext = path.extname(localPath).toLowerCase().replace(/^\./, "") || "jpg";
  const mime = MIME[ext] || "application/octet-stream";
  const key = `pandatalk/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (!bucket || !publicBase) {
    throw new Error("Missing CLOUDFLARE_R2_BUCKET or CLOUDFLARE_R2_PUBLIC_URL in .env.local");
  }
  await getR2().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buf,
      ContentType: mime,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

// ---------------------------------------------------------------------------
// AI metadata. Mirrors lib/ai-meta.ts but inlined so this script has no
// dependency on the Next.js source tree.
// ---------------------------------------------------------------------------
const TAGS = ["essay", "dev", "growth", "thought", "uses", "note"];

const AI_SYSTEM_PROMPT = `You generate metadata for a personal bilingual (中/英) blog by an indie AI builder.

For each post, choose:

- A short Chinese slug — 2 to 4 short Chinese keywords joined by ASCII hyphens.
  - Example: title "AI 如何改变人的劳动？" → slug "ai-改变-劳动" or "ai-劳动变革".
  - Example: title "Git 入门教程" → slug "git-入门-教程".
  - Use Chinese keywords that capture the topic, not the full title verbatim.
  - ASCII tokens (like product names: ai, git, openai, react) stay lowercase.
  - No spaces, no punctuation other than hyphens, no leading/trailing hyphens.
  - If the post is purely English with no Chinese content, fall back to ASCII
    kebab-case (2–5 lowercase words, e.g. "claude-code-workflow").

- One tag from this fixed taxonomy:
  - "essay" — first-person reflective writing, life/career narrative
  - "dev" — coding, tools, AI development workflows, technical
  - "growth" — audience growth, content strategy, marketing
  - "thought" — short-form opinion, philosophy, observation
  - "uses" — tool/setup posts (what I use to do X)
  - "note" — anything else / general

Always respond by calling the set_metadata tool. Never write prose.`;

async function generateMetadata(title, bodyText) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return { slug: slugify(title), tag: "note", source: "fallback", error: "no DEEPSEEK_API_KEY" };
  }
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const client = new OpenAI({ apiKey, baseURL });

  const sample = bodyText.slice(0, 1500);
  const userInput = `Title: ${title}\n\nBody (excerpt):\n${sample || "(empty)"}`;

  try {
    const res = await client.chat.completions.create({
      model,
      max_tokens: 200,
      temperature: 0.2,
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "set_metadata",
            description: "Set the slug and tag for the blog post.",
            parameters: {
              type: "object",
              properties: {
                slug: { type: "string" },
                tag: { type: "string", enum: TAGS },
              },
              required: ["slug", "tag"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "set_metadata" } },
    });
    const call = res.choices[0]?.message.tool_calls?.[0];
    if (!call || call.type !== "function") {
      return { slug: slugify(title), tag: "note", source: "fallback", error: "no tool_call" };
    }
    let args;
    try {
      args = JSON.parse(call.function.arguments);
    } catch {
      return { slug: slugify(title), tag: "note", source: "fallback", error: "invalid JSON args" };
    }
    const slug = typeof args.slug === "string" && args.slug.length > 0
      ? slugify(args.slug)
      : slugify(title);
    const tag = TAGS.includes(args.tag) ? args.tag : "note";
    return { slug, tag, source: "ai" };
  } catch (e) {
    return {
      slug: slugify(title),
      tag: "note",
      source: "fallback",
      error: e?.message || String(e),
    };
  }
}

// ---------------------------------------------------------------------------
// Subcommand: list
// ---------------------------------------------------------------------------
async function cmdList() {
  const db = getDB();
  const { data, error } = await db
    .from("posts")
    .select("slug,title,date,tag,read_time,lang")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!data?.length) {
    console.log("(no posts)");
    return;
  }
  for (const p of data) {
    const tag = (p.tag || "").padEnd(8);
    const lang = (p.lang || "").padEnd(2);
    console.log(`${p.date}  ${tag}  ${lang}  /${p.slug}  ·  ${p.title}`);
  }
}

// ---------------------------------------------------------------------------
// Subcommand: get
// ---------------------------------------------------------------------------
async function cmdGet(slug) {
  if (!slug) throw new Error("usage: blog get <slug>");
  const db = getDB();
  const { data, error } = await db.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`not found: ${slug}`);
  console.log(JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// Subcommand: publish (single file)
// ---------------------------------------------------------------------------
async function ensureUniqueSlug(db, base) {
  let candidate = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await db.from("posts").select("slug").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

async function cmdPublish(file, opts = {}) {
  if (!file) throw new Error("usage: blog publish <file.md>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body } = parseFrontmatter(text);

  const title = (meta.title || path.basename(file, path.extname(file))).trim();
  if (!title) throw new Error(`${file}: title is empty`);
  if (!body.trim()) throw new Error(`${file}: body is empty`);

  const html = markdownToHtml(body);
  const plain = plainTextFromMarkdown(body);

  let slug = (meta.slug || "").trim();
  let tag = (meta.tag || "").trim();
  if (!slug || !tag) {
    const ai = await generateMetadata(title, plain);
    if (!slug) slug = ai.slug;
    if (!tag) tag = ai.tag;
    if (ai.error) console.warn(`  [ai] ${ai.error} — used fallback`);
  }
  slug = slugify(slug);
  if (!TAGS.includes(tag)) tag = "note";

  let cover = (meta.cover || "").trim() || null;
  if (cover && !/^https?:\/\//i.test(cover)) {
    const abs = path.isAbsolute(cover) ? cover : path.resolve(path.dirname(file), cover);
    if (opts.dry) {
      cover = `[dry-run] would upload ${abs}`;
    } else {
      cover = await uploadCover(abs);
      console.log(`  [cover] uploaded → ${cover}`);
    }
  }

  const db = getDB();
  if (!opts.dry) {
    slug = await ensureUniqueSlug(db, slug);
  }

  const row = {
    slug,
    date: meta.date || todayISO(),
    read_time: meta.read_time || deriveReadTimeFromText(plain),
    lang: meta.lang || detectLang(plain || title),
    tag,
    title,
    excerpt: meta.excerpt || deriveExcerptFromText(plain),
    body: html,
    cover,
  };

  if (opts.dry) {
    console.log(`[dry-run] ${file} →`);
    console.log(JSON.stringify({ ...row, body: `${html.slice(0, 120)}…` }, null, 2));
    return slug;
  }

  const { error } = await db.from("posts").insert(row);
  if (error) throw new Error(error.message);
  console.log(`✓ published /${slug}  ·  ${title}`);
  return slug;
}

// ---------------------------------------------------------------------------
// Subcommand: publish-batch
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Subcommand: edit
// ---------------------------------------------------------------------------
async function cmdEdit(slug, file) {
  if (!slug || !file) throw new Error("usage: blog edit <slug> <file.md>");
  const text = await fs.readFile(file, "utf8");
  const { meta, body } = parseFrontmatter(text);
  if (!body.trim()) throw new Error(`${file}: body is empty`);

  const db = getDB();
  const { data: existing, error: e0 } = await db
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (e0) throw new Error(e0.message);
  if (!existing) throw new Error(`not found: ${slug}`);

  const html = markdownToHtml(body);
  const plain = plainTextFromMarkdown(body);
  const patch = {
    title: meta.title?.trim() || existing.title,
    body: html,
    read_time: meta.read_time || deriveReadTimeFromText(plain),
    excerpt: meta.excerpt || deriveExcerptFromText(plain),
  };
  if (meta.tag && TAGS.includes(meta.tag.trim())) patch.tag = meta.tag.trim();
  if (meta.lang) patch.lang = meta.lang.trim();
  if (meta.date) patch.date = meta.date.trim();

  if (Object.prototype.hasOwnProperty.call(meta, "cover")) {
    let cover = (meta.cover || "").trim() || null;
    if (cover && !/^https?:\/\//i.test(cover)) {
      const abs = path.isAbsolute(cover) ? cover : path.resolve(path.dirname(file), cover);
      cover = await uploadCover(abs);
      console.log(`  [cover] uploaded → ${cover}`);
    }
    patch.cover = cover;
  }

  const { error } = await db.from("posts").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  console.log(`✓ updated /${slug}`);
}

// ---------------------------------------------------------------------------
// Subcommand: delete
// ---------------------------------------------------------------------------
async function cmdDelete(slug) {
  if (!slug) throw new Error("usage: blog delete <slug>");
  const db = getDB();
  const { error } = await db.from("posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
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
  publish-batch <dir>           publish every *.md in a directory
  edit <slug> <file.md>         replace post body/title/etc.
  delete <slug>                 delete post by slug
  --dry                         (with publish/publish-batch) preview only

env (read from .env.local):
  NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY  — required
  CLOUDFLARE_R2_*                                — required only if cover upload
  DEEPSEEK_API_KEY (+ DEEPSEEK_BASE_URL/MODEL)   — optional, fallback slug+tag if absent`);
}

await loadDotEnv();

const argv = process.argv.slice(2);
const cmd = argv[0];
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const positional = argv.slice(1).filter((a) => !a.startsWith("--"));
const opts = { dry: flags.has("--dry") };

const COMMANDS = {
  list: () => cmdList(),
  get: () => cmdGet(positional[0]),
  publish: () => cmdPublish(positional[0], opts),
  "publish-batch": () => cmdPublishBatch(positional[0], opts),
  edit: () => cmdEdit(positional[0], positional[1]),
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
