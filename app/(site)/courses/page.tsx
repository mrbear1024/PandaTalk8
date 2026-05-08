import CourseCard from "@/components/CourseCard";
import { getAllCourses } from "@/lib/courses";

export const metadata = {
  title: "Courses · PandaTalk8",
  description: "Courses by Mr Panda on AI, indie building, and creator workflow.",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 04 — courses</div>
          <h1>
            The
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              Courses
            </span>
          </h1>
        </div>
        <div className="side">
          Practical courses for AI builders and creators. Hand-recorded, no fluff.
        </div>
      </section>

      {courses.length > 0 ? (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-glyph" aria-hidden="true">⏳</div>
          <h2 className="empty-title">Building…</h2>
          <p className="empty-copy">课程系统独立承接。新课程上线后会在这里展示入口。</p>
        </div>
      )}
    </div>
  );
}
