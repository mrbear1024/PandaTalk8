export const metadata = {
  title: "Courses · PandaTalk",
  description: "Courses by PandaTalk on AI, indie building, and creator workflow.",
};

export default function CoursesPage() {
  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 03 — courses</div>
          <h1>
            The
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              Courses
            </span>
          </h1>
        </div>
        <div className="side">
          Practical courses for AI builders and creators. Hand-recorded, no fluff.
        </div>
      </section>

      <div className="empty-state">
        <div className="empty-glyph" aria-hidden="true">⏳</div>
        <h2 className="empty-title">Building…</h2>
        <p className="empty-copy">
          The first course is in production. Subscribe to the{" "}
          <a href="/blog/rss.xml">RSS feed</a> or follow on{" "}
          <a href="https://x.com/pandatalk8" target="_blank" rel="noopener noreferrer">
            X
          </a>{" "}
          to be the first to know when it ships.
        </p>
      </div>
    </div>
  );
}
