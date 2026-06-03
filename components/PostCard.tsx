import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

function tagColor(tag: string) {
  if (tag === "dev") return "green";
  if (tag === "growth") return "mustard";
  return "red";
}

// Dan Koe-style 16:9 cover card used in the home "latest articles" grid.
// PostRow (row layout) is still used on the /blog index.
export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="home-post-card">
      <div className="home-post-cover">
        {post.cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={post.cover} alt="" />
        ) : (
          <span className="home-post-cover-fallback" aria-hidden="true">
            PANDA·TALK
          </span>
        )}
      </div>
      <div className="home-post-card-body">
        <div className="home-post-card-meta">
          <span className="date">{formatDate(post.date)}</span>
          <span className="dot" aria-hidden="true">·</span>
          <span>{post.read_time}</span>
        </div>
        <h3 className="home-post-card-title">{post.title}</h3>
        <p className="home-post-card-excerpt">{post.excerpt}</p>
        <div className="home-post-card-tags">
          {post.featured ? <span className="tag pinned">📌 pinned</span> : null}
          <span className={`tag ${tagColor(post.tag)}`}>{post.tag}</span>
          <span className="tag">{post.lang}</span>
        </div>
      </div>
    </Link>
  );
}
