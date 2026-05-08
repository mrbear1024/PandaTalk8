import { getSupabase, isSupabaseConfigured } from "./supabase";
import { SEED_POSTS } from "./seed";
import type { Post } from "./types";

export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return SEED_POSTS;
  const sb = getSupabase()!;
  // Order by date first (the editorial date the author chose), then by
  // created_at as a tiebreaker so multiple posts published on the same day
  // surface in the order they were written. Without the tiebreaker the order
  // is unstable and brand-new posts can be hidden behind older same-day ones.
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[posts] supabase error, falling back to seed:", error.message);
    return SEED_POSTS;
  }
  return (data ?? []) as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) {
    return SEED_POSTS.find((p) => p.slug === slug) ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[posts] supabase error, falling back to seed:", error.message);
    return SEED_POSTS.find((p) => p.slug === slug) ?? null;
  }
  return (data as Post) ?? null;
}
