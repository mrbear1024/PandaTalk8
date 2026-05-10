import { getSupabase, isSupabaseConfigured } from "./supabase";
import { SEED_COMMUNITIES } from "./seed";
import type { Community } from "./types";

function sortCommunities(items: Community[]) {
  return [...items]
    .filter((c) => c.status === "published")
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

export async function getAllCommunities(): Promise<Community[]> {
  if (!isSupabaseConfigured) return sortCommunities(SEED_COMMUNITIES);
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("communities")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[communities] supabase error, falling back to seed:", error.message);
    return sortCommunities(SEED_COMMUNITIES);
  }
  if (!data || data.length === 0) return sortCommunities(SEED_COMMUNITIES);
  return data as Community[];
}

export async function getCommunity(slug: string): Promise<Community | null> {
  if (!isSupabaseConfigured) {
    return SEED_COMMUNITIES.find((c) => c.slug === slug && c.status === "published") ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("communities")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.warn("[communities] supabase error, falling back to seed:", error.message);
    return SEED_COMMUNITIES.find((c) => c.slug === slug && c.status === "published") ?? null;
  }
  return (data as Community) ?? null;
}
