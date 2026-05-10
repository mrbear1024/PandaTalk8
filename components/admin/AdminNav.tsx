"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/_actions/auth";

const items = [
  { href: "/admin", label: "dashboard", exact: true },
  { href: "/admin/posts", label: "posts" },
  { href: "/admin/projects", label: "projects" },
  { href: "/admin/communities", label: "communities" },
  { href: "/admin/courses", label: "courses" },
  { href: "/admin/settings", label: "settings" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname() ?? "/admin";
  return (
    <header className="admin-header">
      <div className="inner">
        <Link href="/admin" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/panda-avatar.png" alt="" className="brand-avatar" />
          <span className="brand-name">
            <span className="zh">Admin</span>
            <span className="en">pandatalk8 control room</span>
          </span>
        </Link>
        <nav className="primary">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={isActive(pathname, it.href, it.exact) ? "active" : ""}
            >
              {it.label}
            </Link>
          ))}
          <Link href="/" target="_blank" rel="noopener noreferrer" className="muted-link">
            view site ↗
          </Link>
          <form action={logoutAction}>
            <button className="theme-toggle" type="submit">
              logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
