import Link from "next/link";
import { adminListPosts, adminListProjects } from "@/lib/admin-fetch";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let posts = 0;
  let projects = 0;
  let shipped = 0;
  let wip = 0;
  let ideas = 0;
  let connectionError: string | null = null;

  try {
    const [p, pr] = await Promise.all([adminListPosts(), adminListProjects()]);
    posts = p.length;
    projects = pr.length;
    shipped = pr.filter((x) => x.status === "ship").length;
    wip = pr.filter((x) => x.status === "wip").length;
    ideas = pr.filter((x) => x.status === "idea").length;
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
        </div>
      </div>

      {connectionError ? (
        <div className="alert">
          Couldn&apos;t reach Supabase: {connectionError}. Check{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>, and that{" "}
          <code>supabase/schema.sql</code> has been applied.
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
        <div className="stat-card">
          <div className="k">shipped</div>
          <div className="v" style={{ color: "var(--bamboo-deep)" }}>{shipped}</div>
        </div>
        <div className="stat-card">
          <div className="k">in progress</div>
          <div className="v" style={{ color: "#7B5414" }}>{wip}</div>
        </div>
        <div className="stat-card">
          <div className="k">ideas</div>
          <div className="v" style={{ color: "var(--ink-3)" }}>{ideas}</div>
        </div>
      </div>
    </>
  );
}
