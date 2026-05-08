"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase-admin";
import type { CourseStatus } from "@/lib/types";

async function guard() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

const STATUSES: CourseStatus[] = ["coming_soon", "available", "archived"];

function readCourseFields(fd: FormData) {
  const statusRaw = String(fd.get("status") ?? "coming_soon").trim();
  const status = (STATUSES.includes(statusRaw as CourseStatus) ? statusRaw : "coming_soon") as CourseStatus;
  return {
    slug: String(fd.get("slug") ?? "").trim(),
    title: String(fd.get("title") ?? "").trim(),
    subtitle: String(fd.get("subtitle") ?? "").trim(),
    cover: String(fd.get("cover") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim(),
    price: String(fd.get("price") ?? "").trim(),
    status,
    external_url: String(fd.get("external_url") ?? "#").trim() || "#",
    cta_label: String(fd.get("cta_label") ?? "查看课程系统").trim() || "查看课程系统",
    sort_order: Number(String(fd.get("sort_order") ?? "100")) || 100,
    featured: fd.get("featured") === "on",
  };
}

function validate(c: ReturnType<typeof readCourseFields>): string | null {
  if (!c.slug || !/^[a-z0-9-]+$/.test(c.slug)) return "Slug must be lowercase letters, numbers, dashes.";
  if (!c.title) return "Title is required.";
  if (!c.subtitle) return "Subtitle is required.";
  if (!c.description) return "Description is required.";
  if (!c.price) return "Price or status text is required.";
  return null;
}

function bustCaches(slug: string) {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath(`/courses/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
}

export async function createCourseAction(formData: FormData): Promise<{ error?: string }> {
  await guard();
  const course = readCourseFields(formData);
  const err = validate(course);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("courses").insert(course);
  if (error) return { error: error.message };
  bustCaches(course.slug);
  redirect("/admin/courses");
}

export async function updateCourseAction(
  originalSlug: string,
  formData: FormData
): Promise<{ error?: string }> {
  await guard();
  const course = readCourseFields(formData);
  const err = validate(course);
  if (err) return { error: err };
  const sb = getAdminSupabase();
  const { error } = await sb.from("courses").update(course).eq("slug", originalSlug);
  if (error) return { error: error.message };
  bustCaches(originalSlug);
  if (course.slug !== originalSlug) bustCaches(course.slug);
  redirect("/admin/courses");
}

export async function deleteCourseAction(slug: string): Promise<void> {
  await guard();
  const sb = getAdminSupabase();
  const { error } = await sb.from("courses").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  bustCaches(slug);
  redirect("/admin/courses");
}
