import Link from "next/link";
import { adminListProjects } from "@/lib/admin-fetch";
import { deleteProjectAction } from "@/app/admin/_actions/projects";
import DeleteForm from "@/components/admin/DeleteForm";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_TAG: Record<string, string> = {
  ship: "green",
  wip: "mustard",
  idea: "",
};

export default async function AdminProjectsPage() {
  let projects: Project[] = [];
  let error: string | null = null;
  try {
    projects = await adminListProjects();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Projects</h1>
        <Link href="/admin/projects/new" className="btn">
          + new project
        </Link>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      {projects.length === 0 && !error ? (
        <p className="muted">No projects yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>glyph</th>
              <th>title</th>
              <th style={{ width: "120px" }}>status</th>
              <th style={{ width: "100px" }}>year</th>
              <th style={{ width: "180px" }}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const del = deleteProjectAction.bind(null, p.slug);
              return (
                <tr key={p.slug}>
                  <td className="mono">{p.glyph}</td>
                  <td>
                    <div className="row-title">{p.title}</div>
                    <div className="row-meta">
                      /{p.slug} · {p.stack.join(" · ")}
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${STATUS_TAG[p.status]}`}>{p.status_label}</span>
                  </td>
                  <td className="mono muted" style={{ fontSize: "0.85rem" }}>
                    {p.year}
                  </td>
                  <td className="actions">
                    <Link className="link-action" href={`/projects/${p.slug}`} target="_blank" rel="noopener">
                      view
                    </Link>
                    <Link className="link-action" href={`/admin/projects/${p.slug}/edit`}>
                      edit
                    </Link>
                    <span style={{ marginLeft: "var(--sp-3)" }}>
                      <DeleteForm action={del} confirm={`Delete "${p.title}"?`} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
