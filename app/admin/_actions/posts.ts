"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase-admin";
import {
  deriveExcerptFromText,
  deriveReadTimeFromText,
  slugify,
  todayISO,
} from "@/lib/post-derive";
import { generateSlugAndTag, type AiMetaResult } from "@/lib/ai-meta";

async function guard() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

function readFields(fd: FormData) {
  const title = String(fd.get("title") ?? "").trim();
  const cover = String(fd.get("cover") ?? "").trim() || null;
  const bodyHtml = String(fd.get("body_html") ?? "").trim();
  const bodyText = String(fd.get("body_text") ?? "").trim();
  return { title, cover, bodyHtml, bodyText };
}

function bustCaches(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
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

function noticeQuery(meta: AiMetaResult): string {
  if (meta.source === "ai" || !meta.error) return "";
  const params = new URLSearchParams({ notice: "ai-failed", reason: meta.error.slice(0, 200) });
  return `?${params.toString()}`;
}

function isHtmlEffectivelyEmpty(html: string): boolean {
  // Tiptap emits <p></p> for an empty doc; strip tags + whitespace and check.
  return html.replace(/<[^>]+>/g, "").replace(/\s|&nbsp;/g, "").length === 0;
}

export async function createPostAction(formData: FormData): Promise<{ error?: string }> {
  await guard();
  const { title, cover, bodyHtml, bodyText } = readFields(formData);
  if (!title) return { error: "Title is required." };
  if (!bodyHtml || isHtmlEffectivelyEmpty(bodyHtml)) return { error: "Body is empty." };

  const meta = await generateSlugAndTag(title, bodyText);
  const slug = await ensureUniqueSlug(meta.slug || slugify(title));

  // body is jsonb. New posts store the rendered HTML as a JSON string;
  // legacy posts have an array of typed blocks. Reader/edit form branch on
  // the runtime type. Storing as a string avoids needing a separate
  // body_html column (and the migration that would require).
  const row = {
    slug,
    date: todayISO(),
    read_time: deriveReadTimeFromText(bodyText),
    lang: "EN",
    tag: meta.tag,
    title,
    excerpt: deriveExcerptFromText(bodyText),
    body: bodyHtml,
    cover,
  };

  const sb = getAdminSupabase();
  const { error } = await sb.from("posts").insert(row);
  if (error) {
    console.error(`[posts] insert FAILED slug=${slug}: ${error.message}`);
    return { error: error.message };
  }
  bustCaches(slug);
  redirect(`/admin/posts${noticeQuery(meta)}`);
}

export async function updatePostAction(
  originalSlug: string,
  formData: FormData
): Promise<{ error?: string }> {
  await guard();
  const { title, cover, bodyHtml, bodyText } = readFields(formData);
  if (!title) return { error: "Title is required." };
  if (!bodyHtml || isHtmlEffectivelyEmpty(bodyHtml)) return { error: "Body is empty." };

  // On edit we keep slug/date/lang/tag as-is. Only title/body/cover (and
  // derived read_time + excerpt) change. Body is stored as a JSON string
  // in the existing jsonb column — see createPostAction for rationale.
  const patch = {
    title,
    body: bodyHtml,
    cover,
    read_time: deriveReadTimeFromText(bodyText),
    excerpt: deriveExcerptFromText(bodyText),
  };

  const sb = getAdminSupabase();
  const { error } = await sb.from("posts").update(patch).eq("slug", originalSlug);
  if (error) {
    console.error(`[posts] update FAILED slug=${originalSlug}: ${error.message}`);
    return { error: error.message };
  }
  bustCaches(originalSlug);
  redirect(`/admin/posts`);
}

export async function deletePostAction(slug: string): Promise<void> {
  await guard();
  const sb = getAdminSupabase();
  const { error } = await sb.from("posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  bustCaches(slug);
  redirect("/admin/posts");
}
