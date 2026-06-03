"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement | null) => void } };
  }
}

type Props = {
  /** Public profile URL for the Follow button (e.g. https://x.com/PandaTalk8). */
  profileUrl: string;
  /** Handle including the leading @ (e.g. @PandaTalk8). */
  handle: string;
  followers?: string;
};

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

// Embeds the live X/Twitter profile timeline via the official widgets.js.
// The inner <a.twitter-timeline> doubles as a graceful fallback link if the
// script is blocked or still loading.
export default function XProfileEmbed({ profileUrl, handle, followers }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => window.twttr?.widgets?.load(ref.current);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGETS_SRC}"]`);
    if (existing) {
      render();
      return;
    }
    const s = document.createElement("script");
    s.src = WIDGETS_SRC;
    s.async = true;
    s.onload = render;
    document.body.appendChild(s);
  }, []);

  const cleanHandle = handle.replace(/^@/, "");
  const timelineHref = `https://twitter.com/${cleanHandle}`;

  return (
    <section id="x" className="x-embed" aria-label="X / Twitter">
      <div className="x-embed-copy">
        <div className="eyebrow">X / Twitter</div>
        <h2>在 X 上关注我</h2>
        <p>
          我每天在 X 上写 AI、编程与独立开发的实战思考、产品复盘和增长笔记。
          {followers ? (
            <>
              {" "}
              已有 <strong>{followers}</strong> 位关注者。
            </>
          ) : null}
        </p>
        <a className="btn" href={profileUrl} target="_blank" rel="noopener noreferrer">
          Follow {handle} →
        </a>
      </div>
      <div className="x-embed-timeline" ref={ref}>
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-height="460"
          data-chrome="noheader nofooter noborders transparent"
          href={timelineHref}
        >
          Tweets by {handle}
        </a>
      </div>
    </section>
  );
}
