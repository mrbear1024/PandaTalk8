import { NextResponse, type NextRequest } from "next/server";
import { checkApiAuth } from "@/lib/api-auth";
import {
  createPost,
  listPostsAdmin,
  PostsServiceError,
  type CreatePostInput,
} from "@/lib/posts-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const fail = checkApiAuth(req);
  if (fail) return fail;
  try {
    const posts = await listPostsAdmin();
    return NextResponse.json({ posts });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  const fail = checkApiAuth(req);
  if (fail) return fail;

  let body: CreatePostInput;
  try {
    body = (await req.json()) as CreatePostInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}

function errorResponse(e: unknown): NextResponse {
  if (e instanceof PostsServiceError) {
    if (e.status >= 500) console.error(`[api/v1/posts] ${e.status}: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  const msg = e instanceof Error ? e.message : String(e);
  console.error(`[api/v1/posts] unexpected: ${msg}`);
  return NextResponse.json({ error: msg }, { status: 500 });
}
