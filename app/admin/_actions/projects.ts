"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase-admin";
import type { ProjectStatus } from "@/lib/types";

async function guard() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

const STATUSES: ProjectStatus[] = ["ship", "wip", "idea"];

function readProjectFields(fd: FormData) {
  const slug = String(fd.get("slug") ?? "").trim();
  const glyph = String(fd.get("glyph") ?? "").trim();
  const title = String(fd.get("title") ?? "").trim();
  const description = String(fd.get("description") ?? "").trim();
  const statusRaw = String(fd.get("status") ?? "ship").trim();
  const status = (STATUSES.includes(statusRaw as ProjectStatus) ? statusRaw : "ship") as ProjectStatus;
  const status_label = String(fd.get("status_label") ?? "").trim();
  const stack = String(fd.get("stack") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const year = String(fd.get("year") ?? "").trim();
  const href = String(fd.get("href") ?? "#").trim() || "#";
  const long = String(fd.get("long") ?? "").trim();
  return { slug, glyph, title, description, status, status_label, stack, year, href, long };
}

function validate(p: ReturnType<typeof readProjectFields>): string | null {
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) return "Slug must be lowercase letters, numbers, dashes.";
  if (!p.title) return "Title is required.";
  if (!p.glyph) return "Glyph is required.";
  if (!p.description) return "Description is required.";
  if (!p.status_label) return "Status label is required.";
  if (!p.year) return "Year is required.";
  if (!p.long) return "Long description is required.";
  return null;
}

function bustCaches(slug: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

export async function createProjectAction(formData: FormData): Promise<{ error?: string }> {
  await guard();
  const p = readProjectFields(formData);
  const err = validate(p);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("projects").insert(p);
  if (error) return { error: error.message };
  bustCaches(p.slug);
  redirect(`/admin/projects`);
}

export async function updateProjectAction(
  originalSlug: string,
  formData: FormData
): Promise<{ error?: string }> {
  await guard();
  const p = readProjectFields(formData);
  const err = validate(p);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("projects").update(p).eq("slug", originalSlug);
  if (error) return { error: error.message };
  bustCaches(originalSlug);
  if (p.slug !== originalSlug) bustCaches(p.slug);
  redirect(`/admin/projects`);
}

export async function deleteProjectAction(slug: string): Promise<void> {
  await guard();
  const sb = getAdminSupabase();
  const { error } = await sb.from("projects").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  bustCaches(slug);
  redirect("/admin/projects");
}
