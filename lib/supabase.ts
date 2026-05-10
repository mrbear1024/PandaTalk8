import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// New Supabase keys are `sb_publishable_*`; legacy projects use the anon JWT.
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;
let noStoreCached: SupabaseClient | null = null;

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    cache: "no-store",
  });

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;
  cached = createClient(url!, anonKey!, {
    auth: { persistSession: false },
  });
  return cached;
}

export function getSupabaseNoStore(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (noStoreCached) return noStoreCached;
  noStoreCached = createClient(url!, anonKey!, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch },
  });
  return noStoreCached;
}

export function getSupabaseTagged(tags: string[]): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  const taggedFetch: typeof fetch = (input, init) =>
    fetch(input, { ...init, next: { tags } });
  return createClient(url!, anonKey!, {
    auth: { persistSession: false },
    global: { fetch: taggedFetch },
  });
}
