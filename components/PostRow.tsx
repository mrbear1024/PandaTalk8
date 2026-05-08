import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

function tagColor(tag: string) {
  if (tag === "dev") return "green";
  if (tag === "growth") return "mustard";
  return "red";
}

export default function PostRow({ post }: { post: Post }) {
  return (
    <li className={`post-item${post.featured ? " is-pinned" : ""}`}>
      <span className="date">{formatDate(post.date)}</span>
      <div className="post-item-main">
        {post.cover ? (
          <Link href={`/blog/${post.slug}`} className="post-thumb" aria-hidden="true" tabIndex={-1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" />
          </Link>
        ) : null}
        <div className="post-item-text">
          <Link href={`/blog/${post.slug}`} className="title">
            {post.title}
          </Link>
          <div className="excerpt">{post.excerpt}</div>
          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {post.featured ? <span className="tag pinned">📌 pinned</span> : null}
            <span className={`tag ${tagColor(post.tag)}`}>{post.tag}</span>
            <span className="tag">{post.lang}</span>
          </div>
        </div>
      </div>
      <span className="meta">{post.read_time}</span>
    </li>
  );
}
