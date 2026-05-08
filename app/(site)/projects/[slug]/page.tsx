import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";
import type { Metadata } from "next";

type Params = { slug: string };

// Slugs may include non-ASCII characters. Browsers send them percent-encoded;
// the DB stores the decoded form, so decode before querying.
function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = await getProject(decodeSlug(params.slug));
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} · PandaTalk`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const project = await getProject(decodeSlug(params.slug));
  if (!project) notFound();

  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <Link href="/projects" className="back-link">
          all projects
        </Link>
        <header>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sp-4)",
              marginBottom: "var(--sp-5)",
            }}
          >
            <div
              className="emoji"
              style={{
                fontSize: "2.25rem",
                width: "72px",
                height: "72px",
                background: "var(--paper-2)",
                border: "1.5px solid var(--ink)",
                display: "grid",
                placeItems: "center",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0 var(--panda-red)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              {project.glyph}
            </div>
            <div>
              <h1 style={{ fontSize: "var(--step-3)", margin: 0 }}>{project.title}</h1>
              <div className="mono muted" style={{ fontSize: "0.82rem", marginTop: "6px" }}>
                {project.year} · {project.status_label}
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: "var(--step-1)",
              color: "var(--ink-2)",
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {project.description}
          </p>
          <div className="meta">
            <span>stack:</span>
            {project.stack.map((s) => (
              <span key={s} className="tag" style={{ marginLeft: "4px" }}>
                {s}
              </span>
            ))}
          </div>
        </header>
        <div className="prose">
          <p>{project.long}</p>
          <p
            className="mono muted"
            style={{ fontSize: "0.85rem", marginTop: "var(--sp-6)" }}
          >
            ── More project notes coming. DM me on X if you want to talk about this one.
          </p>
        </div>
      </article>
    </div>
  );
}
