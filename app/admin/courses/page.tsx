import Link from "next/link";
import { adminListCourses } from "@/lib/admin-fetch";
import { deleteCourseAction } from "@/app/admin/_actions/courses";
import DeleteForm from "@/components/admin/DeleteForm";
import type { Course } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_TAG: Record<string, string> = {
  available: "green",
  coming_soon: "mustard",
  archived: "",
};

export default async function AdminCoursesPage() {
  let courses: Course[] = [];
  let error: string | null = null;
  try {
    courses = await adminListCourses();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Courses</h1>
        <Link href="/admin/courses/new" className="btn">
          + new course
        </Link>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      {courses.length === 0 && !error ? (
        <p className="muted">No courses yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>title</th>
              <th style={{ width: "120px" }}>price</th>
              <th style={{ width: "140px" }}>status</th>
              <th style={{ width: "90px" }}>sort</th>
              <th style={{ width: "180px" }}></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => {
              const del = deleteCourseAction.bind(null, c.slug);
              return (
                <tr key={c.slug}>
                  <td>
                    <div className="row-title">
                      {c.featured ? <span title="Featured" style={{ marginRight: 6 }}>★</span> : null}
                      {c.title}
                    </div>
                    <div className="row-meta">/{c.slug} · {c.subtitle}</div>
                  </td>
                  <td className="mono">{c.price}</td>
                  <td><span className={`tag ${STATUS_TAG[c.status]}`}>{c.status.replace("_", " ")}</span></td>
                  <td className="mono muted">{c.sort_order}</td>
                  <td className="actions">
                    <Link className="link-action" href={`/courses/${c.slug}`} target="_blank" rel="noopener">
                      view
                    </Link>
                    <Link className="link-action" href={`/admin/courses/${c.slug}/edit`}>
                      edit
                    </Link>
                    <span style={{ marginLeft: "var(--sp-3)" }}>
                      <DeleteForm action={del} confirm={`Delete "${c.title}"?`} />
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
