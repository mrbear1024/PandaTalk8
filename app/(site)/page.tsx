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
import { getSiteSettings } from "@/lib/site-settings";

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
  const { site, home } = await getSiteSettings();
  const featuredPosts = posts.filter((p) => p.featured).slice(0, 1);
  const latestPosts = posts.filter((p) => !p.featured).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredCourses = courses.slice(0, 2);

  return (
    <div className="route-enter">
      <section className="container home">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="kicker">{home.kicker}</div>
            <h1 className="home-title">
              {home.title}{" "}
              <span className="stroke">{home.titleAccent}</span>.
            </h1>
            <p className="home-lede">
              {home.lede}
            </p>
            <div className="hero-actions">
              <a href={home.primaryCtaHref} target="_blank" rel="noopener noreferrer" className="btn">
                {home.primaryCtaLabel}
              </a>
              <Link href={home.secondaryCtaHref} className="btn ghost">
                {home.secondaryCtaLabel}
              </Link>
            </div>
            <div className="trust-strip">
              <strong>{site.xFollowers}</strong> followers on X <span>·</span> 公众号 {site.wechatName}
            </div>
            <div className="now-bar">
              <span className="dot" />
              <span className="label">{site.now.status}</span>
              <span>{site.now.text}</span>
            </div>
          </div>
          <div className="home-hero-portrait">
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/panda-avatar.png" alt="Panda avatar" />
            </div>
          </div>
        </div>

        {home.showSocials ? (
          <section className="home-social-block" aria-labelledby="home-social-title">
            <div className="eyebrow" id="home-social-title">{home.socialsTitle}</div>
            <div className="home-socials" aria-label="Social media">
              {site.socials.slice(0, 4).map((social) => (
                <a key={`${social.label}-${social.href}`} href={social.href} target="_blank" rel="noopener noreferrer" className="home-social">
                  <span className="home-social-icon"><SocialIcon kind={social.label.toLowerCase()} /></span>
                  <span className="home-social-text">
                    <span className="home-social-label">{social.label}</span>
                    <span className="home-social-handle">{social.handle}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {home.showCommunities ? <section className="home-section">
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
        </section> : null}

        {home.showPosts ? <section className="home-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Articles</div>
              <h2>Latest articles</h2>
            </div>
            <div className="index">
              <Link href="/blog">all articles ({posts.length}) →</Link>
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
        </section> : null}

        {home.showProjects ? <section className="home-section">
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
        </section> : null}

        {home.showCourses && featuredCourses.length > 0 ? (
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
