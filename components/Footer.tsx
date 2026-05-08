import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>© {new Date().getFullYear()} PandaTalk · built with ♥ and Claude</div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/blog">blog</Link>
          <Link href="/projects">projects</Link>
          <Link href="/courses">courses</Link>
          <Link href="/about">about</Link>
          <a href="https://x.com/pandatalk8" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="/blog/rss.xml">rss</a>
        </div>
      </div>
    </footer>
  );
}
