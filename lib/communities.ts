import { getSupabaseNoStore, isSupabaseConfigured } from "./supabase";
import { SEED_COMMUNITIES } from "./seed";
import type { Community } from "./types";

function sortCommunities(items: Community[]) {
  return [...items]
    .filter((c) => c.status === "published")
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

function withSeedDefaults(community: Community): Community {
  const seed = SEED_COMMUNITIES.find((item) => item.slug === community.slug);
  if (!seed) return community;
  return {
    ...seed,
    ...community,
    cover: community.cover || seed.cover,
    description: community.description || seed.description,
    audience: community.audience || seed.audience,
    join_instructions: community.join_instructions || seed.join_instructions,
    cta_label: community.cta_label || seed.cta_label,
    highlights: community.highlights?.length ? community.highlights : seed.highlights,
    includes: community.includes?.length ? community.includes : seed.includes,
    faq: community.faq?.length ? community.faq : seed.faq,
  };
}

export async function getAllCommunities(): Promise<Community[]> {
  if (!isSupabaseConfigured) return sortCommunities(SEED_COMMUNITIES);
  const sb = getSupabaseNoStore()!;
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
  return (data as Community[]).map(withSeedDefaults);
}

export async function getCommunity(slug: string): Promise<Community | null> {
  if (!isSupabaseConfigured) {
    return SEED_COMMUNITIES.find((c) => c.slug === slug && c.status === "published") ?? null;
  }
  const sb = getSupabaseNoStore()!;
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
  return data ? withSeedDefaults(data as Community) : null;
}
