import BlogTagFilter from "@/components/BlogTagFilter";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog · PandaTalk",
  description: "Long-form notes on indie building, AI, and the slow process of learning to make things in public.",
};

// CLI publishes (scripts/blog.mjs) write to Supabase outside the Next.js
// process and can't trigger revalidatePath. Render dynamically so new posts
// appear on the next request.
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 01 — writing</div>
          <h1>
            The
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              Notes
            </span>
          </h1>
        </div>
        <div className="side">
          Long-form notes on indie building, AI, and the slow process of learning to make things in public.
        </div>
      </section>

      <BlogTagFilter posts={posts} />
    </div>
  );
}
