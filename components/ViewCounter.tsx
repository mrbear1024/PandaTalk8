"use client";

import { useEffect, useState } from "react";
import { formatViews } from "@/lib/format";

// Displays an article's reader count and fires a single view beacon per
// browser session (deduped via sessionStorage) so refreshes within a session
// don't inflate the number. The server-rendered `initialViews` shows
// immediately; once the beacon responds we swap in the fresh total.
export default function ViewCounter({
  slug,
  initialViews,
}: {
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `pv:${slug}`;
    let sessionKnown = false;
    try {
      sessionKnown = sessionStorage.getItem(key) === "1";
    } catch {
      // sessionStorage can throw in private mode / sandboxed iframes — just
      // fall through and count this load.
    }
    if (sessionKnown) return;
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }

    let cancelled = false;
    fetch(`/api/v1/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      cache: "no-store",
      keepalive: true,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { views?: number | null } | null) => {
        if (!cancelled && data && typeof data.views === "number") {
          setViews(data.views);
        }
      })
      .catch(() => {
        /* network errors are non-fatal for a view beacon */
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return <span>{formatViews(views)} 阅读</span>;
}
