import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const { site } = await getSiteSettings();
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>© {new Date().getFullYear()} {site.brandName} · built with ♥ and Claude</div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/blog">articles</Link>
          <Link href="/projects">projects</Link>
          <Link href="/community">community</Link>
          <Link href="/courses">courses</Link>
          <Link href="/about">about</Link>
          <a href={site.xUrl} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="/blog/rss.xml">rss</a>
        </div>
      </div>
    </footer>
  );
}
