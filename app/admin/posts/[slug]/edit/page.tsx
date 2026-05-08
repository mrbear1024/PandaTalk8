import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { adminGetPost } from "@/lib/admin-fetch";
import { updatePostAction } from "@/app/admin/_actions/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  // Next.js gives us the raw URL segment, which is percent-encoded for
  // non-ASCII characters. DB rows store the decoded form, so decode here
  // before lookup. Wrap in try/catch — malformed sequences shouldn't 500.
  let slug = params.slug;
  try {
    slug = decodeURIComponent(params.slug);
  } catch {
    // fall through with raw value
  }
  const post = await adminGetPost(slug);
  if (!post) notFound();
  const action = updatePostAction.bind(null, slug);
  return (
    <>
      <div className="admin-toolbar">
        <h1>Edit post</h1>
        <span className="mono muted">/{slug}</span>
      </div>
      <PostForm initial={post} action={action} submitLabel="Save changes" />
    </>
  );
}
