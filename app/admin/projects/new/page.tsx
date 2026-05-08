import ProjectForm from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/app/admin/_actions/projects";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <>
      <div className="admin-toolbar">
        <h1>New project</h1>
      </div>
      <ProjectForm action={createProjectAction} submitLabel="Create project →" />
    </>
  );
}
