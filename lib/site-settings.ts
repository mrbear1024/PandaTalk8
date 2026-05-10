import { ABOUT, HOME, SITE } from "./site";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { About, HomeSettings, Site, SiteSettings, Social } from "./types";

type SettingsRow = {
  id: string;
  site: Partial<Site> | null;
  about: About | null;
  home: Partial<HomeSettings> | null;
  socials: Social[] | null;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site: SITE,
  about: ABOUT,
  home: HOME,
};

function mergeSettings(row?: SettingsRow | null): SiteSettings {
  const site = {
    ...SITE,
    ...(row?.site ?? {}),
    socials: row?.socials?.length ? row.socials : SITE.socials,
    now: {
      ...SITE.now,
      ...(row?.site?.now ?? {}),
    },
  };

  return {
    site,
    about: row?.about ?? ABOUT,
    home: {
      ...HOME,
      ...(row?.home ?? {}),
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SITE_SETTINGS;
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.warn("[site_settings] supabase error, falling back to defaults:", error.message);
    return DEFAULT_SITE_SETTINGS;
  }

  return mergeSettings(data as SettingsRow | null);
}
