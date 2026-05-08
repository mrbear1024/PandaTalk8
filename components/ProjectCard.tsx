import Link from "next/link";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      <div className="head">
        <div className="emoji">{project.glyph}</div>
        <span className={`status ${project.status}`}>
          <span className="dot" />
          {project.status_label}
        </span>
      </div>
      <h3>{project.title}</h3>
      <p className="project-desc">{project.description}</p>
      {project.audience ? <p className="project-audience">{project.audience}</p> : null}
      <div className="project-meta">
        <div className="tags">
          {project.stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        <span>{project.year}</span>
      </div>
      <span className="offer-action">{project.cta_label ?? "Read notes"} →</span>
    </Link>
  );
}
