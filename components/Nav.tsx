"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHouse, LuFileText, LuFolderKanban, LuUsers, LuGraduationCap, LuCircleUser, LuRss } from "react-icons/lu";
import type { IconType } from "react-icons";
import ThemeToggle from "./ThemeToggle";

const items: { key: string; label: string; icon: IconType; href: string }[] = [
  { key: "home", label: "home", icon: LuHouse, href: "/" },
  { key: "blog", label: "articles", icon: LuFileText, href: "/blog" },
  { key: "projects", label: "projects", icon: LuFolderKanban, href: "/projects" },
  { key: "community", label: "community", icon: LuUsers, href: "/community" },
  { key: "courses", label: "courses", icon: LuGraduationCap, href: "/courses" },
  { key: "about", label: "about", icon: LuCircleUser, href: "/about" },
];


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
              <it.icon className="nav-icon" aria-hidden />{it.label}
            </Link>
          ))}
          <a
            href="/blog/rss.xml"
            className="nav-rss"
            aria-label="RSS feed"
            title="RSS feed"
          >
            <LuRss size={16} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
