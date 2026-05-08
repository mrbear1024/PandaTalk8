import { getSupabase, isSupabaseConfigured } from "./supabase";
import { SEED_COURSES } from "./seed";
import type { Course } from "./types";

function sortCourses(items: Course[]) {
  return [...items]
    .filter((c) => c.status !== "archived")
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

export async function getAllCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return sortCourses(SEED_COURSES);
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("courses")
    .select("*")
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[courses] supabase error, falling back to seed:", error.message);
    return sortCourses(SEED_COURSES);
  }
  return (data ?? []) as Course[];
}

export async function getCourse(slug: string): Promise<Course | null> {
  if (!isSupabaseConfigured) {
    return SEED_COURSES.find((c) => c.slug === slug && c.status !== "archived") ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .neq("status", "archived")
    .maybeSingle();
  if (error) {
    console.warn("[courses] supabase error, falling back to seed:", error.message);
    return SEED_COURSES.find((c) => c.slug === slug && c.status !== "archived") ?? null;
  }
  return (data as Course) ?? null;
}
