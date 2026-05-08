import Link from "next/link";
import { adminListPosts } from "@/lib/admin-fetch";
import { deletePostAction } from "@/app/admin/_actions/posts";
import DeleteForm from "@/components/admin/DeleteForm";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { notice?: string; reason?: string };

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  let posts: Post[] = [];
  let error: string | null = null;
  try {
    posts = await adminListPosts();
  } catch (e) {
    error = (e as Error).message;
  }

  const aiFailed = searchParams?.notice === "ai-failed";

  return (
    <>
      <div className="admin-toolbar">
        <h1>Posts</h1>
        <Link href="/admin/posts/new" className="btn">
          + new post
        </Link>
      </div>

      {aiFailed ? (
        <div className="notice">
          Saved — but AI metadata generation failed; we used a fallback slug + the
          &ldquo;note&rdquo; tag. You can edit this post to refine them.
          {searchParams?.reason ? (
            <div className="notice-detail">{searchParams.reason}</div>
          ) : null}
        </div>
      ) : null}

      {error ? <div className="alert">{error}</div> : null}

      {posts.length === 0 && !error ? (
        <p className="muted">No posts yet. Create your first one.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "150px" }}>date</th>
              <th>title</th>
              <th style={{ width: "100px" }}>tag</th>
              <th style={{ width: "180px" }}></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const del = deletePostAction.bind(null, p.slug);
              return (
                <tr key={p.slug}>
                  <td className="mono muted" style={{ fontSize: "0.85rem" }}>
                    {formatDate(p.date)}
                  </td>
                  <td>
                    <div className="row-title">{p.title}</div>
                    <div className="row-meta">
                      /{p.slug} · {p.read_time} · {p.lang}
                    </div>
                  </td>
                  <td>
                    <span className="tag">{p.tag}</span>
                  </td>
                  <td className="actions">
                    <Link className="link-action" href={`/blog/${p.slug}`} target="_blank" rel="noopener">
                      view
                    </Link>
                    <Link className="link-action" href={`/admin/posts/${p.slug}/edit`}>
                      edit
                    </Link>
                    <span style={{ marginLeft: "var(--sp-3)" }}>
                      <DeleteForm action={del} confirm={`Delete "${p.title}"?`} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
