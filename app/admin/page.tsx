import Link from "next/link";
import { adminListCommunities, adminListCourses, adminListPosts, adminListProjects } from "@/lib/admin-fetch";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let posts = 0;
  let projects = 0;
  let communities = 0;
  let courses = 0;
  let shipped = 0;
  let wip = 0;
  let published = 0;
  let comingSoon = 0;
  let connectionError: string | null = null;

  try {
    const [p, pr, cm, co] = await Promise.all([
      adminListPosts(),
      adminListProjects(),
      adminListCommunities(),
      adminListCourses(),
    ]);
    posts = p.length;
    projects = pr.length;
    communities = cm.length;
    courses = co.length;
    shipped = pr.filter((x) => x.status === "ship").length;
    wip = pr.filter((x) => x.status === "wip").length;
    published = cm.filter((x) => x.status === "published").length + co.filter((x) => x.status === "available").length;
    comingSoon = co.filter((x) => x.status === "coming_soon").length;
  } catch (e) {
    connectionError = (e as Error).message;
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Dashboard</h1>
        <div style={{ display: "flex", gap: "var(--sp-3)" }}>
          <Link href="/admin/posts/new" className="btn ghost">
            + new post
          </Link>
          <Link href="/admin/projects/new" className="btn">
            + new project
          </Link>
          <Link href="/admin/communities/new" className="btn ghost">
            + new community
          </Link>
        </div>
      </div>

      {connectionError ? (
        <div className="alert">
          Supabase is not ready: {connectionError}. Apply <code>supabase/schema.sql</code> and check the env keys.
        </div>
      ) : null}

      <div className="dashboard-grid">
        <Link href="/admin/posts" className="stat-card" style={{ textDecoration: "none" }}>
          <div className="k">posts</div>
          <div className="v">{posts}</div>
        </Link>
        <Link href="/admin/projects" className="stat-card" style={{ textDecoration: "none" }}>
          <div className="k">projects</div>
          <div className="v">{projects}</div>
        </Link>
        <Link href="/admin/communities" className="stat-card" style={{ textDecoration: "none" }}>
          <div className="k">communities</div>
          <div className="v">{communities}</div>
        </Link>
        <Link href="/admin/courses" className="stat-card" style={{ textDecoration: "none" }}>
          <div className="k">courses</div>
          <div className="v">{courses}</div>
        </Link>
        <div className="stat-card">
          <div className="k">shipped</div>
          <div className="v" style={{ color: "var(--bamboo-deep)" }}>{shipped}</div>
        </div>
        <div className="stat-card">
          <div className="k">in progress</div>
          <div className="v" style={{ color: "#7B5414" }}>{wip}</div>
        </div>
        <div className="stat-card">
          <div className="k">published</div>
          <div className="v" style={{ color: "var(--panda-red-deep)" }}>{published}</div>
        </div>
        <div className="stat-card">
          <div className="k">coming soon</div>
          <div className="v" style={{ color: "var(--ink-3)" }}>{comingSoon}</div>
        </div>
      </div>
    </>
  );
}
