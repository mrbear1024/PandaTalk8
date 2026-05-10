import "server-only";
import { getAdminSupabase } from "./supabase-admin";
import { DEFAULT_SITE_SETTINGS } from "./site-settings";
import type { Community, Course, Post, Project, SiteSettings } from "./types";

export async function adminListPosts(): Promise<Post[]> {
  const sb = getAdminSupabase();
  // Same dual-order as the public list — see lib/posts.ts.
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
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error && error.message.includes("sort_order")) {
    const fallback = await sb.from("projects").select("*").order("created_at", { ascending: false });
    if (!fallback.error) return (fallback.data ?? []) as Project[];
  }
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function adminGetProject(slug: string): Promise<Project | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Project) ?? null;
}

export async function adminListCommunities(): Promise<Community[]> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("communities")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Community[];
}

export async function adminGetCommunity(slug: string): Promise<Community | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("communities").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Community) ?? null;
}

export async function adminListCourses(): Promise<Course[]> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
}

export async function adminGetCourse(slug: string): Promise<Course | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("courses").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Course) ?? null;
}

export async function adminGetSiteSettings(): Promise<SiteSettings> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return DEFAULT_SITE_SETTINGS;
  return {
    site: {
      ...DEFAULT_SITE_SETTINGS.site,
      ...(data.site ?? {}),
      socials: data.socials?.length ? data.socials : DEFAULT_SITE_SETTINGS.site.socials,
      now: {
        ...DEFAULT_SITE_SETTINGS.site.now,
        ...(data.site?.now ?? {}),
      },
    },
    about: data.about ?? DEFAULT_SITE_SETTINGS.about,
    home: {
      ...DEFAULT_SITE_SETTINGS.home,
      ...(data.home ?? {}),
    },
  };
}
