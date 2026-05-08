import "server-only";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { getAdminSupabase } from "./supabase-admin";
import { generateSlugAndTag } from "./ai-meta";
import {
  deriveExcerptFromText,
  deriveReadTimeFromText,
  slugify,
  todayISO,
} from "./post-derive";
import type { Post } from "./types";

// Single source of truth for post writes. Both /api/v1/posts and the admin
// UI's server actions should funnel through here so the rendering pipeline,
// AI metadata fallback, slug uniqueness, and cache revalidation behave
// identically regardless of who initiated the write.
//
// Tags are stored as free-form strings — historical taxonomy was the fixed
// set { essay, dev, growth, thought, uses, note } the AI prompt suggests
// from, but callers can supply any string (e.g. "AI技术", "创业与IP") to
// categorise by directory or other axis.

export type CreatePostInput = {
  title: string;
  // Provide exactly one of body_md / body_html.
  body_md?: string;
  body_html?: string;
  // All of the below are optional — server fills in sensible defaults.
  slug?: string;
  tag?: string;
  cover?: string | null;
  date?: string;
  lang?: string;
  excerpt?: string;
  read_time?: string;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export class PostsServiceError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function renderMarkdown(md: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(md) as string;
}

function plainTextFromMarkdown(md: string): string {
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

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLang(text: string): string {
  return /[一-鿿]/.test(text) ? "ZH" : "EN";
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const sb = getAdminSupabase();
  let candidate = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await sb.from("posts").select("slug").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

function bustCaches(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const title = (input.title ?? "").trim();
  if (!title) throw new PostsServiceError("title is required", 400);

  const md = input.body_md?.trim();
  const givenHtml = input.body_html?.trim();
  if (!md && !givenHtml) {
    throw new PostsServiceError("body_md or body_html is required", 400);
  }
  if (md && givenHtml) {
    throw new PostsServiceError("provide exactly one of body_md / body_html", 400);
  }

  const html = md ? renderMarkdown(md) : givenHtml!;
  const plain = md ? plainTextFromMarkdown(md) : plainTextFromHtml(givenHtml!);

  let slug = (input.slug ?? "").trim();
  let tag = (input.tag ?? "").trim();
  if (!slug || !tag) {
    const meta = await generateSlugAndTag(title, plain);
    if (!slug) slug = meta.slug;
    if (!tag) tag = meta.tag;
  }
  slug = slugify(slug);
  if (!tag) tag = "note";
  slug = await ensureUniqueSlug(slug);

  const row = {
    slug,
    date: input.date?.trim() || todayISO(),
    read_time: input.read_time?.trim() || deriveReadTimeFromText(plain),
    lang: input.lang?.trim() || detectLang(plain || title),
    tag,
    title,
    excerpt: input.excerpt?.trim() || deriveExcerptFromText(plain),
    body: html,
    cover: input.cover ? input.cover.trim() : null,
  };

  const sb = getAdminSupabase();
  const { error } = await sb.from("posts").insert(row);
  if (error) throw new PostsServiceError(error.message, 500);
  bustCaches(slug);
  return row as unknown as Post;
}

export async function updatePost(slug: string, patch: UpdatePostInput): Promise<Post> {
  if (!slug) throw new PostsServiceError("slug is required", 400);

  const sb = getAdminSupabase();
  const { data: existing, error: e0 } = await sb
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (e0) throw new PostsServiceError(e0.message, 500);
  if (!existing) throw new PostsServiceError(`not found: ${slug}`, 404);

  const fields: Record<string, unknown> = {};
  let plainForDerive: string | null = null;

  if (patch.body_md != null || patch.body_html != null) {
    const md = patch.body_md?.trim();
    const givenHtml = patch.body_html?.trim();
    if (md && givenHtml) {
      throw new PostsServiceError("provide exactly one of body_md / body_html", 400);
    }
    if (!md && !givenHtml) {
      throw new PostsServiceError("body_md or body_html cannot be empty", 400);
    }
    fields.body = md ? renderMarkdown(md) : givenHtml!;
    plainForDerive = md ? plainTextFromMarkdown(md) : plainTextFromHtml(givenHtml!);
  }
  if (patch.title != null) fields.title = patch.title.trim();
  if (patch.tag != null && patch.tag.trim().length > 0) fields.tag = patch.tag.trim();
  if (patch.lang != null) fields.lang = patch.lang.trim();
  if (patch.date != null) fields.date = patch.date.trim();
  if (patch.cover !== undefined) fields.cover = patch.cover ? String(patch.cover).trim() : null;
  if (patch.excerpt != null) fields.excerpt = patch.excerpt.trim();
  if (patch.read_time != null) fields.read_time = patch.read_time.trim();

  // Re-derive read_time + excerpt from new body if the caller didn't supply them.
  if (plainForDerive != null) {
    if (fields.read_time == null) fields.read_time = deriveReadTimeFromText(plainForDerive);
    if (fields.excerpt == null) fields.excerpt = deriveExcerptFromText(plainForDerive);
  }

  if (Object.keys(fields).length === 0) {
    throw new PostsServiceError("nothing to update", 400);
  }

  const { error } = await sb.from("posts").update(fields).eq("slug", slug);
  if (error) throw new PostsServiceError(error.message, 500);
  bustCaches(slug);

  const merged = { ...(existing as Post), ...(fields as Partial<Post>) } as Post;
  return merged;
}

export async function deletePost(slug: string): Promise<void> {
  if (!slug) throw new PostsServiceError("slug is required", 400);
  const sb = getAdminSupabase();
  const { error } = await sb.from("posts").delete().eq("slug", slug);
  if (error) throw new PostsServiceError(error.message, 500);
  bustCaches(slug);
}

export async function listPostsAdmin(): Promise<Post[]> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .order("featured", { ascending: false })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new PostsServiceError(error.message, 500);
  return (data ?? []) as Post[];
}

export async function getPostAdmin(slug: string): Promise<Post | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new PostsServiceError(error.message, 500);
  return (data as Post) ?? null;
}
