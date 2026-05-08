import Link from "next/link";
import CommunityCard from "@/components/CommunityCard";
import CourseCard from "@/components/CourseCard";
import PostRow from "@/components/PostRow";
import ProjectCard from "@/components/ProjectCard";
import SocialIcon from "@/components/SocialIcon";
import { getAllCommunities } from "@/lib/communities";
import { getAllCourses } from "@/lib/courses";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

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
  const featuredPosts = posts.filter((p) => p.featured).slice(0, 1);
  const latestPosts = posts.filter((p) => !p.featured).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredCourses = courses.slice(0, 2);

  return (
    <div className="route-enter">
      <section className="container home">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="kicker">online · building in public</div>
            <h1 className="home-title">
              AI builder &amp;{" "}
              <span className="stroke">indie founder</span>.
            </h1>
            <p className="home-lede">
              Building products, writing ideas, and selling myself in public.
            </p>
            <div className="hero-actions">
              <a href={SITE.xUrl} target="_blank" rel="noopener noreferrer" className="btn">
                Follow {SITE.xHandle} →
              </a>
              <Link href="/about#wechat" className="btn ghost">
                订阅公众号
              </Link>
            </div>
            <div className="trust-strip">
              <strong>{SITE.xFollowers}</strong> followers on X <span>·</span> 公众号 {SITE.wechatName}
            </div>
            <div className="now-bar">
              <span className="dot" />
              <span className="label">{SITE.now.status}</span>
              <span>{SITE.now.text}</span>
            </div>
          </div>
          <div className="home-hero-portrait">
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/panda-avatar.png" alt="Panda avatar" />
            </div>
          </div>
        </div>

        <div className="home-socials" aria-label="Social media">
          <a href={SITE.xUrl} target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-icon"><SocialIcon kind="x" /></span>
            <span className="home-social-text">
              <span className="home-social-label">X</span>
              <span className="home-social-handle">{SITE.xHandle}</span>
            </span>
          </a>
          <Link href="/about#wechat" className="home-social">
            <span className="home-social-icon"><SocialIcon kind="substack" /></span>
            <span className="home-social-text">
              <span className="home-social-label">公众号</span>
              <span className="home-social-handle">{SITE.wechatName}</span>
            </span>
          </Link>
          <a href="https://www.youtube.com/@pandatalk8" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-icon"><SocialIcon kind="youtube" /></span>
            <span className="home-social-text">
              <span className="home-social-label">YouTube</span>
              <span className="home-social-handle">@pandatalk8</span>
            </span>
          </a>
          <a href="https://github.com/mrbear1024" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-icon"><SocialIcon kind="github" /></span>
            <span className="home-social-text">
              <span className="home-social-label">GitHub</span>
              <span className="home-social-handle">mrbear1024</span>
            </span>
          </a>
        </div>

        <section className="home-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Community</div>
              <h2>Learn, grow, and ship with Mr Panda</h2>
            </div>
            <div className="index">
              <Link href="/community">all communities →</Link>
            </div>
          </div>
          <div className="offer-grid">
            {communities.slice(0, 3).map((community) => (
              <CommunityCard key={community.slug} community={community} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Writing</div>
              <h2>Latest posts</h2>
            </div>
            <div className="index">
              <Link href="/blog">all posts ({posts.length}) →</Link>
            </div>
          </div>
          <ul className="post-list">
            {featuredPosts.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
            {latestPosts.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </ul>
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Projects</div>
              <h2>What I&apos;m building</h2>
            </div>
            <div className="index">
              <Link href="/projects">all projects →</Link>
            </div>
          </div>
          <div className="project-grid">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        {featuredCourses.length > 0 ? (
          <section className="home-section">
            <div className="section-head">
              <div>
                <div className="eyebrow">Courses</div>
                <h2>Courses and systems</h2>
              </div>
              <div className="index">
                <Link href="/courses">all courses →</Link>
              </div>
            </div>
            <div className="course-grid">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
