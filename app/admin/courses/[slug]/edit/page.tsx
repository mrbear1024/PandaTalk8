import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import { adminGetCourse } from "@/lib/admin-fetch";
import { updateCourseAction } from "@/app/admin/_actions/courses";

type Params = { slug: string };

export default async function EditCoursePage({ params }: { params: Params }) {
  const course = await adminGetCourse(decodeURIComponent(params.slug));
  if (!course) notFound();
  const action = updateCourseAction.bind(null, course.slug);

  return (
    <>
      <div className="admin-toolbar">
        <h1>Edit course</h1>
      </div>
      <CourseForm initial={course} action={action} submitLabel="Save changes" />
    </>
  );
}
