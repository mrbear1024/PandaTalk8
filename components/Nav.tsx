"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { key: "home", label: "home", href: "/" },
  { key: "blog", label: "blog", href: "/blog" },
  { key: "projects", label: "projects", href: "/projects" },
  { key: "about", label: "about", href: "/about" },
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/panda-avatar.png"
            alt=""
            className="brand-avatar"
            style={{ borderWidth: "2px 2px 2px 0px" }}
          />
          <span className="brand-name">
            <span className="zh">Panda</span>
            <span className="en">solo / ai / builder</span>
          </span>
        </Link>
        <nav className="primary">
          {items.map((it) => (
            <Link key={it.key} href={it.href} className={isActive(pathname, it.href) ? "active" : ""}>
              {it.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
