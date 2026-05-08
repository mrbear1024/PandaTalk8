import CourseForm from "@/components/admin/CourseForm";
import { createCourseAction } from "@/app/admin/_actions/courses";

export default function NewCoursePage() {
  return (
    <>
      <div className="admin-toolbar">
        <h1>New course</h1>
      </div>
      <CourseForm action={createCourseAction} submitLabel="Create course →" />
    </>
  );
}
