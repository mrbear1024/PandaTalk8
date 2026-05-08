"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { key: "home", label: "home", href: "/" },
  { key: "blog", label: "blog", href: "/blog" },
  { key: "projects", label: "projects", href: "/projects" },
  { key: "community", label: "community", href: "/community" },
  { key: "courses", label: "courses", href: "/courses" },
  { key: "about", label: "about", href: "/about" },
];

function RssIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="6.18" cy="17.82" r="2.18" />
      <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83C19.56 11.34 12.66 4.44 4 4.44zM4 10.1v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83C13.9 14.41 9.59 10.1 4 10.1z" />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          <span className="brand-avatar" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/panda-avatar.png" alt="" className="brand-avatar-img" />
          </span>
          <span className="brand-name">
            <span className="zh">Mr Panda</span>
            <span className="en">AI / Indie / Builder / Seller</span>
          </span>
        </Link>
        <nav className="primary">
          {items.map((it) => (
            <Link key={it.key} href={it.href} className={isActive(pathname, it.href) ? "active" : ""}>
              {it.label}
            </Link>
          ))}
          <a
            href="/blog/rss.xml"
            className="nav-rss"
            aria-label="RSS feed"
            title="RSS feed"
          >
            <RssIcon />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
