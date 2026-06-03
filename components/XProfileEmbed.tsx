type Props = {
  /** Public profile URL for the Follow button (e.g. https://x.com/PandaTalk8). */
  profileUrl: string;
  /** Handle including the leading @ (e.g. @PandaTalk8). */
  handle: string;
  followers?: string;
};

// "Follow me on X" card for the About page — mirrors the WeChat promo card,
// with the panda avatar as the visual on the right.
export default function XProfileEmbed({ profileUrl, handle, followers }: Props) {
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
      <a
        className="x-embed-avatar"
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${handle} on X`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/panda-avatar.png" alt="Mr Panda" />
      </a>
    </section>
  );
}
