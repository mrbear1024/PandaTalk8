import Link from "next/link";
import CommunityCard from "@/components/CommunityCard";
import CourseCard from "@/components/CourseCard";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import { getAllCommunities } from "@/lib/communities";
import { getAllCourses } from "@/lib/courses";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/site-settings";
import { BOOK } from "@/lib/site";

// Posts/projects are written by both the admin UI (which calls revalidatePath)
// and a standalone CLI (scripts/blog.mjs) which can't. Dynamic rendering means
// either path shows up on the next request without coordination.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects, communities, courses] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getAllCommunities(),
    getAllCourses(),
  ]);
  const { site, home, about } = await getSiteSettings();
  const featuredPosts = posts.filter((p) => p.featured).slice(0, 1);
  const latestPosts = posts.filter((p) => !p.featured).slice(0, 5);
  const homePosts = [...featuredPosts, ...latestPosts].slice(0, 6);
  const featuredProjects = projects.slice(0, 3);
  // Resources block (Dan Koe): paid products first — courses + communities.
  const featuredCourses = courses.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);
  const aboutIntro = about.sections[0];

  return (
    <div className="route-enter">
      <section className="container home">
        {/* ---- Hero (centered) ---- */}
        <header className="home-hero">
          <div className="home-hero-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/panda-avatar.png" alt="Mr Panda" />
          </div>
          <div className="kicker">{home.kicker}</div>
          <h1 className="home-title">
            {home.title}{" "}
            <span className="stroke">{home.titleAccent}</span>.
          </h1>
          <p className="home-lede">{home.lede}</p>
          <div className="home-cta-row">
            <a
              href={home.primaryCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {home.primaryCtaLabel}
            </a>
            <Link href={home.secondaryCtaHref} className="btn ghost">
              {home.secondaryCtaLabel}
            </Link>
          </div>
          <p className="home-proof">
            Join <strong>{site.xFollowers}</strong> followers on X
            <span className="sep">·</span>
            公众号 {site.wechatName}
          </p>
        </header>

        {/* ---- Featured ebook / 免费电子书 ---- */}
        {BOOK.show ? (
          <section className="home-section" id="book">
            <div className="section-head centered">
              <div className="eyebrow">{BOOK.eyebrow}</div>
              <h2>{BOOK.heading}</h2>
            </div>
            <div className="book-feature">
              <a
                className="book-cover"
                href={BOOK.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${BOOK.title} — 下载阅读`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BOOK.cover} alt={`《${BOOK.title}》封面`} />
              </a>
              <div className="book-copy">
                <h3 className="book-title">{BOOK.title}</h3>
                <p className="book-subtitle">{BOOK.subtitle}</p>
                <p className="book-desc">{BOOK.description}</p>
                <div className="book-meta">
                  <span>{BOOK.pages}</span>
                  <span>·</span>
                  <span>{BOOK.lang}</span>
                  <span>·</span>
                  <span>{BOOK.format}</span>
                </div>
                <div className="book-actions">
                  <a className="btn" href={BOOK.href} target="_blank" rel="noopener noreferrer">
                    {BOOK.ctaLabel} →
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ---- Courses / 课程 ---- */}
        {home.showCourses && featuredCourses.length > 0 ? (
          <section className="home-section">
            <div className="section-head centered">
              <div className="eyebrow">Courses</div>
              <h2>课程</h2>
            </div>
            <div className="course-grid">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
            <div className="home-section-more">
              <Link href="/courses">all courses →</Link>
            </div>
          </section>
        ) : null}

        {/* ---- Community / 社群 ---- */}
        {home.showCommunities && featuredCommunities.length > 0 ? (
          <section className="home-section">
            <div className="section-head centered">
              <div className="eyebrow">Community</div>
              <h2>社群 · 一起成长</h2>
            </div>
            <div className="offer-grid">
              {featuredCommunities.map((community) => (
                <CommunityCard key={community.slug} community={community} />
              ))}
            </div>
            <div className="home-section-more">
              <Link href="/community">all communities →</Link>
            </div>
          </section>
        ) : null}

        {/* ---- The Blog / 最新文章 ---- */}
        {home.showPosts && homePosts.length > 0 ? (
          <section className="home-section">
            <div className="section-head centered">
              <div className="eyebrow">The Blog</div>
              <h2>最新文章</h2>
            </div>
            <div className="home-post-grid">
              {homePosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="home-section-more">
              <Link href="/blog">all articles ({posts.length}) →</Link>
            </div>
          </section>
        ) : null}

        {/* ---- Building / 在做的项目 ---- */}
        {home.showProjects && featuredProjects.length > 0 ? (
          <section className="home-section">
            <div className="section-head centered">
              <div className="eyebrow">Building</div>
              <h2>在做的项目</h2>
            </div>
            <div className="project-grid">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
            <div className="home-section-more">
              <Link href="/projects">all projects →</Link>
            </div>
          </section>
        ) : null}

        {/* ---- About / 关于我 ---- */}
        {aboutIntro ? (
          <section className="home-section">
            <div className="section-head centered">
              <div className="eyebrow">About</div>
              <h2>关于我</h2>
            </div>
            <div className="home-about">
              <div className="home-about-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/panda-avatar.png" alt="Mr Panda" />
              </div>
              <div className="home-about-copy">
                {aboutIntro.paragraphs.slice(0, 2).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <Link href="/about" className="home-about-link">
                  了解更多 →
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
