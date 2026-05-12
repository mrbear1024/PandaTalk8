"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuHouse,
  LuFileText,
  LuFolderKanban,
  LuUsers,
  LuGraduationCap,
  LuCircleUser,
  LuRss,
  LuMenu,
  LuX,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import ThemeToggle from "./ThemeToggle";

const items: { key: string; label: string; icon: IconType; href: string }[] = [
  { key: "home", label: "Home", icon: LuHouse, href: "/" },
  { key: "blog", label: "Articles", icon: LuFileText, href: "/blog" },
  { key: "projects", label: "Projects", icon: LuFolderKanban, href: "/projects" },
  { key: "community", label: "Community", icon: LuUsers, href: "/community" },
  { key: "courses", label: "Courses", icon: LuGraduationCap, href: "/courses" },
  { key: "about", label: "About", icon: LuCircleUser, href: "/about" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            <span className="en">AI Builder · Indie Maker</span>
          </span>
        </Link>
        <nav className="primary nav-desktop" aria-label="Primary navigation">
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
        <div className="mobile-actions">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <LuX aria-hidden /> : <LuMenu aria-hidden />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="mobile-menu" aria-label="Mobile navigation">
          {items.map((it) => (
            <Link key={it.key} href={it.href} className={isActive(pathname, it.href) ? "active" : ""}>
              <it.icon className="nav-icon" aria-hidden />
              <span>{it.label}</span>
            </Link>
          ))}
          <div className="mobile-menu-tools">
            <a href="/blog/rss.xml" className="mobile-tool">
              <LuRss aria-hidden />
              <span>RSS</span>
            </a>
            <div className="mobile-tool theme-tool">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
