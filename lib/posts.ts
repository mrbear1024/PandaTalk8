import { getSupabase, getSupabaseNoStore, getSupabaseTagged, isSupabaseConfigured } from "./supabase";
import { SEED_POSTS } from "./seed";
import type { Post } from "./types";

const POST_LIST_COLUMNS = "slug,date,read_time,lang,tag,title,excerpt,cover,featured,created_at";

export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return SEED_POSTS;
  const sb = getSupabase()!;
  // Order by date first (the editorial date the author chose), then by
  // created_at as a tiebreaker so multiple posts published on the same day
  // surface in the order they were written. Without the tiebreaker the order
  // is unstable and brand-new posts can be hidden behind older same-day ones.
  const { data, error } = await sb
    .from("posts")
    .select(POST_LIST_COLUMNS)
    // Featured posts surface above non-featured ones, then newest first,
    // then created_at as a stable tiebreaker for same-day publishes.
    .order("featured", { ascending: false })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error && error.message.includes("featured")) {
    const fallback = await sb
      .from("posts")
      .select("slug,date,read_time,lang,tag,title,excerpt,cover,created_at")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    if (!fallback.error) return (fallback.data ?? []) as Post[];
  }
  if (error) {
    console.warn("[posts] supabase error, falling back to seed:", error.message);
    return SEED_POSTS;
  }
  return (data ?? []) as Post[];
}

export async function getAllPostsWithBody(): Promise<Post[]> {
  if (!isSupabaseConfigured) return SEED_POSTS;
  const sb = getSupabaseNoStore()!;
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .order("featured", { ascending: false })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error && error.message.includes("featured")) {
    const fallback = await sb
      .from("posts")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    if (!fallback.error) return (fallback.data ?? []) as Post[];
  }
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
  const sb = getSupabaseTagged([`post:${slug}`])!;
  const { data, error } = await sb.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[posts] supabase error, falling back to seed:", error.message);
    return SEED_POSTS.find((p) => p.slug === slug) ?? null;
  }
  return (data as Post) ?? null;
}
