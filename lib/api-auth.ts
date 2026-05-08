import "server-only";
import { NextResponse, type NextRequest } from "next/server";

// Bearer-token auth for the public-facing /api/v1/* routes used by the
// pt-blog CLI / skill. Separate from the cookie-based admin UI auth — these
// two access patterns coexist deliberately.

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkApiAuth(req: NextRequest): NextResponse | null {
  const expected = process.env.BLOG_API_KEY;
  if (!expected) {
    console.error("[api-auth] BLOG_API_KEY env var is not set on this deployment");
    return NextResponse.json(
      { error: "Server is not configured for API access (BLOG_API_KEY missing)." },
      { status: 503 }
    );
  }
  const header = req.headers.get("authorization") ?? "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m || !timingSafeEqual(m[1].trim(), expected)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null; // ok
}
