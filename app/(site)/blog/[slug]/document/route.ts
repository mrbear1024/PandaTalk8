import { getPost } from "@/lib/posts";

type Params = { slug: string };

export const dynamic = "force-dynamic";

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function GET(_: Request, { params }: { params: Params }) {
  const post = await getPost(decodeSlug(params.slug));
  if (!post || post.body_format !== "html_document") {
    return new Response("Not found", { status: 404 });
  }

  if (typeof post.body !== "string") {
    return new Response("Invalid HTML document", { status: 500 });
  }

  return new Response(post.body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
