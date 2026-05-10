"use client";

import { useMemo, useState } from "react";
import PostRow from "./PostRow";
import type { Post } from "@/lib/types";

export default function BlogTagFilter({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const tags = useMemo(() => ["all", ...Array.from(new Set(posts.map((p) => p.tag)))], [posts]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== "all" && p.tag !== filter) return false;
      if (!q) return true;
      const haystack = [p.title, p.excerpt, p.tag, p.lang]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, filter, query]);

  const pinned = list.filter((p) => p.featured);
  const rest = list.filter((p) => !p.featured);

  return (
    <>
      <div className="blog-toolbar">
        <div className="blog-search">
          <span aria-hidden="true" className="blog-search-icon">⌕</span>
          <input
            type="search"
            className="blog-search-input"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search articles"
          />
          {query ? (
            <button
              type="button"
              className="blog-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          ) : null}
        </div>
        <a className="rss-pill" href="/blog/rss.xml" aria-label="Subscribe via RSS">
          <span className="rss-icon" aria-hidden="true">📡</span>
          RSS
        </a>
      </div>

      <div className="blog-tags">
        {tags.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className="tag"
              style={{
                cursor: "pointer",
                border: active ? "1px solid var(--ink)" : undefined,
                color: active ? "var(--ink)" : undefined,
                background: active ? "var(--paper-3)" : undefined,
                fontWeight: active ? 600 : 400,
              }}
            >
              {t}
            </button>
          );
        })}
        <span className="blog-count">
          {list.length} {list.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="muted" style={{ marginTop: "var(--sp-6)" }}>
          No articles match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          {pinned.length > 0 ? (
            <>
              <div className="blog-subhead">📌 Pinned</div>
              <ul className="post-list">
                {pinned.map((p) => (
                  <PostRow key={p.slug} post={p} />
                ))}
              </ul>
              {rest.length > 0 ? <div className="blog-subhead">Latest</div> : null}
            </>
          ) : null}
          <ul className="post-list">
            {rest.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
