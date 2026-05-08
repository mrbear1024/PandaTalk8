import { NextResponse, type NextRequest } from "next/server";
import { checkApiAuth } from "@/lib/api-auth";
import {
  deletePost,
  getPostAdmin,
  updatePost,
  PostsServiceError,
  type UpdatePostInput,
} from "@/lib/posts-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decode(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function GET(req: NextRequest, ctx: { params: { slug: string } }) {
  const fail = checkApiAuth(req);
  if (fail) return fail;
  const slug = decode(ctx.params.slug);
  try {
    const post = await getPostAdmin(slug);
    if (!post) return NextResponse.json({ error: `not found: ${slug}` }, { status: 404 });
    return NextResponse.json({ post });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { slug: string } }) {
  const fail = checkApiAuth(req);
  if (fail) return fail;
  const slug = decode(ctx.params.slug);

  let body: UpdatePostInput;
  try {
    body = (await req.json()) as UpdatePostInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const post = await updatePost(slug, body);
    return NextResponse.json({ post });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { slug: string } }) {
  const fail = checkApiAuth(req);
  if (fail) return fail;
  const slug = decode(ctx.params.slug);
  try {
    await deletePost(slug);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return errorResponse(e);
  }
}

function errorResponse(e: unknown): NextResponse {
  if (e instanceof PostsServiceError) {
    if (e.status >= 500) console.error(`[api/v1/posts/[slug]] ${e.status}: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  const msg = e instanceof Error ? e.message : String(e);
  console.error(`[api/v1/posts/[slug]] unexpected: ${msg}`);
  return NextResponse.json({ error: msg }, { status: 500 });
}
