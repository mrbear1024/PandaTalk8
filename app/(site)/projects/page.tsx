import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";

export const metadata = {
  title: "Projects · PandaTalk8",
  description: "Products built by one person. Some shipped, some in progress, some still only ideas.",
};

// Match home + blog list — render dynamically so writes from outside Next.js
// (CLI, direct DB) show up immediately.
export const dynamic = "force-dynamic";

function Group({ title, projects }: { title: string; projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <>
      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "var(--step-2)", margin: 0 }}>{title}</h2>
        </div>
        <div className="index">{String(projects.length).padStart(2, "0")} projects</div>
      </div>
      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects();
  const ship = projects.filter((p) => p.status === "ship");
  const wip = projects.filter((p) => p.status === "wip");
  const idea = projects.filter((p) => p.status === "idea");
  const hasAny = projects.length > 0;

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 02 — projects</div>
          <h1>
            Things
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              I make
            </span>
          </h1>
        </div>
        <div className="side">
          Products built by one person. Some shipped, some in progress, some still only ideas.
        </div>
      </section>

      {hasAny ? (
        <>
          <Group title="Shipped" projects={ship} />
          {wip.length > 0 ? (
            <>
              <div style={{ height: "var(--sp-7)" }} />
              <Group title="In progress" projects={wip} />
            </>
          ) : null}
          {idea.length > 0 ? (
            <>
              <div style={{ height: "var(--sp-7)" }} />
              <Group title="Ideas" projects={idea} />
            </>
          ) : null}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-glyph" aria-hidden="true">⚙</div>
          <h2 className="empty-title">Nothing here yet</h2>
          <p className="empty-copy">More projects on the way.</p>
        </div>
      )}
    </div>
  );
}
