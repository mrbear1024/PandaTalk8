import "server-only";
import { getAdminSupabase } from "./supabase-admin";
import type { Post, Project } from "./types";

export async function adminListPosts(): Promise<Post[]> {
  const sb = getAdminSupabase();
  // Same dual-order as the public list — see lib/posts.ts.
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function adminGetPost(slug: string): Promise<Post | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Post) ?? null;
}

export async function adminListProjects(): Promise<Project[]> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function adminGetProject(slug: string): Promise<Project | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Project) ?? null;
}
