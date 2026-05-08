"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase-admin";
import type { CommunityStatus } from "@/lib/types";

async function guard() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

const STATUSES: CommunityStatus[] = ["published", "draft", "archived"];

function listFromText(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function faqFromText(raw: FormDataEntryValue | null) {
  return listFromText(raw).map((line) => {
    const [q, ...rest] = line.split("|");
    return { q: (q ?? "").trim(), a: rest.join("|").trim() };
  }).filter((item) => item.q && item.a);
}

function readCommunityFields(fd: FormData) {
  const statusRaw = String(fd.get("status") ?? "published").trim();
  const status = (STATUSES.includes(statusRaw as CommunityStatus) ? statusRaw : "published") as CommunityStatus;
  return {
    slug: String(fd.get("slug") ?? "").trim(),
    name: String(fd.get("name") ?? "").trim(),
    subtitle: String(fd.get("subtitle") ?? "").trim(),
    price: String(fd.get("price") ?? "").trim(),
    currency: String(fd.get("currency") ?? "¥").trim() || "¥",
    cover: String(fd.get("cover") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim(),
    audience: String(fd.get("audience") ?? "").trim(),
    highlights: listFromText(fd.get("highlights")),
    includes: listFromText(fd.get("includes")),
    faq: faqFromText(fd.get("faq")),
    join_instructions: String(fd.get("join_instructions") ?? "").trim(),
    cta_label: String(fd.get("cta_label") ?? "查看加入方式").trim() || "查看加入方式",
    sort_order: Number(String(fd.get("sort_order") ?? "100")) || 100,
    featured: fd.get("featured") === "on",
    status,
  };
}

function validate(c: ReturnType<typeof readCommunityFields>): string | null {
  if (!c.slug || !/^[a-z0-9-]+$/.test(c.slug)) return "Slug must be lowercase letters, numbers, dashes.";
  if (!c.name) return "Name is required.";
  if (!c.subtitle) return "Subtitle is required.";
  if (!c.price) return "Price is required.";
  if (!c.description) return "Description is required.";
  if (!c.audience) return "Audience is required.";
  if (!c.join_instructions) return "Join instructions are required.";
  return null;
}

function bustCaches(slug: string) {
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath(`/community/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/communities");
}

export async function createCommunityAction(formData: FormData): Promise<{ error?: string }> {
  await guard();
  const community = readCommunityFields(formData);
  const err = validate(community);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("communities").insert(community);
  if (error) return { error: error.message };
  bustCaches(community.slug);
  redirect("/admin/communities");
}

export async function updateCommunityAction(
  originalSlug: string,
  formData: FormData
): Promise<{ error?: string }> {
  await guard();
  const community = readCommunityFields(formData);
  const err = validate(community);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("communities").update(community).eq("slug", originalSlug);
  if (error) return { error: error.message };
  bustCaches(originalSlug);
  if (community.slug !== originalSlug) bustCaches(community.slug);
  redirect("/admin/communities");
}

export async function deleteCommunityAction(slug: string): Promise<void> {
  await guard();
  const sb = getAdminSupabase();
  const { error } = await sb.from("communities").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  bustCaches(slug);
  redirect("/admin/communities");
}
