import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourse } from "@/lib/courses";
import type { Metadata } from "next";

type Params = { slug: string };

export const dynamic = "force-dynamic";

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const courses = await getAllCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const course = await getCourse(decodeSlug(params.slug));
  if (!course) return { title: "Not found" };
  return {
    title: `${course.title} · PandaTalk8`,
    description: course.subtitle,
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const course = await getCourse(decodeSlug(params.slug));
  if (!course) notFound();

  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <Link href="/courses" className="back-link">
          all courses
        </Link>
        {course.cover ? (
          <div className="article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.cover} alt="" />
          </div>
        ) : null}
        <header>
          <div className="eyebrow">{course.status.replace("_", " ")}</div>
          <h1>{course.title}</h1>
          <p style={{ fontSize: "var(--step-1)", color: "var(--ink-2)", lineHeight: 1.55 }}>
            {course.subtitle}
          </p>
          <div className="meta">
            <span>{course.price}</span>
            <span>·</span>
            <span>external course system</span>
          </div>
        </header>
        <div className="prose">
          <p>{course.description}</p>
          <p>
            <a href={course.external_url} target="_blank" rel="noopener noreferrer" className="btn">
              {course.cta_label} →
            </a>
          </p>
        </div>
      </article>
    </div>
  );
}
