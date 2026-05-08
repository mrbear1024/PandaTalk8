import { getSupabase, isSupabaseConfigured } from "./supabase";
import { SEED_PROJECTS } from "./seed";
import type { Project } from "./types";

export async function getAllProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return SEED_PROJECTS;
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[projects] supabase error, falling back to seed:", error.message);
    return SEED_PROJECTS;
  }
  return (data ?? []) as Project[];
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[projects] supabase error, falling back to seed:", error.message);
    return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  return (data as Project) ?? null;
}
