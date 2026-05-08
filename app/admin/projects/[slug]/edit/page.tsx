import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { adminGetProject } from "@/lib/admin-fetch";
import { updateProjectAction } from "@/app/admin/_actions/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  // Slugs may contain non-ASCII chars — Next.js delivers percent-encoded
  // segments. Decode before DB lookup; the DB stores decoded slugs.
  let slug = params.slug;
  try {
    slug = decodeURIComponent(params.slug);
  } catch {
    // fall through with raw value
  }
  const project = await adminGetProject(slug);
  if (!project) notFound();
  const action = updateProjectAction.bind(null, slug);
  return (
    <>
      <div className="admin-toolbar">
        <h1>Edit project</h1>
        <span className="mono muted">/{slug}</span>
      </div>
      <ProjectForm initial={project} action={action} submitLabel="Save changes" />
    </>
  );
}
