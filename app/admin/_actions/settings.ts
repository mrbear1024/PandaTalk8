"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLoggedIn } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import type { About, AboutSection, Site, Social, TimelineEntry } from "@/lib/types";

async function guard() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

function bool(fd: FormData, key: string) {
  return fd.get(key) === "on";
}

function readLines(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readSocials(raw: FormDataEntryValue | null): Social[] {
  return readLines(raw)
    .map((line) => {
      const [label, handle, href] = line.split("|").map((part) => part.trim());
      return { label, handle, href };
    })
    .filter((item) => item.label && item.href);
}

function readAboutSections(raw: FormDataEntryValue | null): AboutSection[] {
  return String(raw ?? "")
    .split(/\n---+\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const heading = (lines.shift() ?? "").trim();
      const paragraphs = lines.join("\n").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
      return { heading, paragraphs };
    })
    .filter((section) => section.heading);
}

function readTimeline(raw: FormDataEntryValue | null): TimelineEntry[] {
  return readLines(raw)
    .map((line) => {
      const [year, what, detail] = line.split("|").map((part) => part.trim());
      return { year, what, detail };
    })
    .filter((item) => item.year && item.what);
}

function bustCaches() {
  [
    "/",
    "/about",
    "/blog",
    "/blog/rss.xml",
    "/community",
    "/courses",
    "/projects",
    "/admin",
    "/admin/settings",
  ].forEach((path) => revalidatePath(path));
}

export async function updateSiteSettingsAction(formData: FormData): Promise<{ error?: string }> {
  await guard();

  const site: Site = {
    ...DEFAULT_SITE_SETTINGS.site,
    name: String(formData.get("site_name") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.name,
    displayName: String(formData.get("display_name") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.displayName,
    brandName: String(formData.get("brand_name") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.brandName,
    tagline: String(formData.get("tagline") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.tagline,
    location: String(formData.get("location") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.location,
    xHandle: String(formData.get("x_handle") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.xHandle,
    xUrl: String(formData.get("x_url") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.xUrl,
    xFollowers: String(formData.get("x_followers") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.xFollowers,
    wechatName: String(formData.get("wechat_name") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.wechatName,
    wechatQr: String(formData.get("wechat_qr") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.wechatQr,
    wechatMaterial: String(formData.get("wechat_material") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.wechatMaterial,
    domain: String(formData.get("domain") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.domain,
    now: {
      status: String(formData.get("now_status") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.now.status,
      text: String(formData.get("now_text") ?? "").trim() || DEFAULT_SITE_SETTINGS.site.now.text,
    },
    socials: [],
  };

  const socials = readSocials(formData.get("socials"));
  const about: About = {
    sections: readAboutSections(formData.get("about_sections")),
    timeline: readTimeline(formData.get("timeline")),
  };

  const home = {
    kicker: String(formData.get("home_kicker") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.kicker,
    title: String(formData.get("home_title") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.title,
    titleAccent: String(formData.get("home_title_accent") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.titleAccent,
    lede: String(formData.get("home_lede") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.lede,
    primaryCtaLabel: String(formData.get("primary_cta_label") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.primaryCtaLabel,
    primaryCtaHref: String(formData.get("primary_cta_href") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.primaryCtaHref,
    secondaryCtaLabel: String(formData.get("secondary_cta_label") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.secondaryCtaLabel,
    secondaryCtaHref: String(formData.get("secondary_cta_href") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.secondaryCtaHref,
    socialsTitle: String(formData.get("socials_title") ?? "").trim() || DEFAULT_SITE_SETTINGS.home.socialsTitle,
    showSocials: bool(formData, "show_socials"),
    showCommunities: bool(formData, "show_communities"),
    showPosts: bool(formData, "show_posts"),
    showProjects: bool(formData, "show_projects"),
    showCourses: bool(formData, "show_courses"),
  };

  if (socials.length === 0) return { error: "Add at least one social account." };
  if (about.sections.length === 0) return { error: "About sections cannot be empty." };

  const sb = getAdminSupabase();
  const { error } = await sb.from("site_settings").upsert({
    id: "main",
    site,
    socials,
    about,
    home,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };
  bustCaches();
  redirect("/admin/settings?saved=1");
}
