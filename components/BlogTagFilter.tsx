"use client";

import { useMemo, useState } from "react";
import PostRow from "./PostRow";
import type { Post } from "@/lib/types";

export default function BlogTagFilter({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<string>("all");
  const tags = useMemo(() => ["all", ...Array.from(new Set(posts.map((p) => p.tag)))], [posts]);
  const list = filter === "all" ? posts : posts.filter((p) => p.tag === filter);

  return (
    <>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
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
              {t} {active && `(${list.length})`}
            </button>
          );
        })}
      </div>
      <ul className="post-list">
        {list.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </ul>
    </>
  );
}
