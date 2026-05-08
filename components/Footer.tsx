import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>© {new Date().getFullYear()} {SITE.brandName} · built with ♥ and Claude</div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/blog">blog</Link>
          <Link href="/projects">projects</Link>
          <Link href="/community">community</Link>
          <Link href="/courses">courses</Link>
          <Link href="/about">about</Link>
          <a href={SITE.xUrl} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="/blog/rss.xml">rss</a>
        </div>
      </div>
    </footer>
  );
}
