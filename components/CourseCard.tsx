import Link from "next/link";
import type { Course } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className={`course-card${course.featured ? " featured" : ""}`}>
      {course.cover ? (
        <div className="course-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.cover} alt="" />
        </div>
      ) : (
        <div className="course-cover placeholder" aria-hidden="true">COURSE</div>
      )}
      <div className="course-card-body">
        <div className="course-card-meta">
          <span className="tag">{course.status.replace("_", " ")}</span>
          <span>{course.price}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.subtitle}</p>
        <span className="offer-action">{course.cta_label} →</span>
      </div>
    </Link>
  );
}
