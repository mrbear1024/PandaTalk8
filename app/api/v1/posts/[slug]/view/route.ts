import { NextResponse, type NextRequest } from "next/server";
import { recordPostView } from "@/lib/posts-service";

// Public, unauthenticated beacon: the article page's ViewCounter POSTs here
// once per session to bump the reader count. Kept deliberately cheap and
// failure-tolerant — a missing column / RPC or unconfigured Supabase just
// yields { views: null } instead of an error.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decode(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function POST(_req: NextRequest, ctx: { params: { slug: string } }) {
  const slug = decode(ctx.params.slug);
  const views = await recordPostView(slug);
  return NextResponse.json({ views }, { headers: { "cache-control": "no-store" } });
}
