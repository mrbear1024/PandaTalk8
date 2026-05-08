import Link from "next/link";
import PostRow from "@/components/PostRow";
import ProjectCard from "@/components/ProjectCard";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

// Posts/projects are written by both the admin UI (which calls revalidatePath)
// and a standalone CLI (scripts/blog.mjs) which can't. Dynamic rendering means
// either path shows up on the next request without coordination.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const latestPosts = posts.slice(0, 5);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="route-enter">
      <section className="container home">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="kicker">online · building in public</div>
            <h1 className="home-title">
              Hi, I&apos;m{" "}
              <span className="stroke">Panda</span>.
            </h1>
            <p className="home-lede">
              Ex-engineer. Now a solo AI founder, creator, and builder-in-public — making
              products, recording content, staying alive.
            </p>
            <div className="hero-actions">
              <Link href="/blog" className="btn">
                Read the blog →
              </Link>
              <Link href="/projects" className="btn ghost">
                See projects
              </Link>
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
          <a href="https://x.com/pandatalk8" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-label">X</span>
            <span className="home-social-handle">@pandatalk8</span>
          </a>
          <a href="https://pandatalk.substack.com/" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-label">Substack</span>
            <span className="home-social-handle">pandatalk</span>
          </a>
          <a href="https://www.youtube.com/@pandatalk8" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-label">YouTube</span>
            <span className="home-social-handle">@pandatalk8</span>
          </a>
          <a href="https://github.com/mrbear1024" target="_blank" rel="noopener noreferrer" className="home-social">
            <span className="home-social-label">GitHub</span>
            <span className="home-social-handle">mrbear1024</span>
          </a>
          <a href="/blog/rss.xml" className="home-social rss">
            <span className="home-social-label">RSS</span>
            <span className="home-social-handle">/blog/rss.xml</span>
          </a>
        </div>

        <div className="home-rss-card">
          <div>
            <div className="eyebrow">Subscribe</div>
            <div className="home-rss-title">Follow the blog by RSS</div>
            <p className="home-rss-copy">
              Get every new post in your reader of choice — no email, no algorithm.
            </p>
          </div>
          <div className="home-rss-actions">
            <code className="home-rss-url">/blog/rss.xml</code>
            <a href="/blog/rss.xml" className="btn">
              Open feed →
            </a>
          </div>
        </div>

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
      </section>
    </div>
  );
}
