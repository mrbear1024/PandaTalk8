import Link from "next/link";
import ASCIIDivider from "@/components/ASCIIDivider";
import PostRow from "@/components/PostRow";
import ProjectCard from "@/components/ProjectCard";
import Socials from "@/components/Socials";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

// Posts/projects are written by both the admin UI (which calls revalidatePath)
// and a standalone CLI (scripts/blog.mjs) which can't. Dynamic rendering means
// either path shows up on the next request without coordination.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const latestPosts = posts.slice(0, 4);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="route-enter">
      <section className="container">
        <div className="hero">
          <div className="hero-copy">
            <div className="kicker">online · building in public</div>
            <h1>
              Hi, I&apos;m
              <br />
              <span className="stroke">Panda</span>.
            </h1>
            <p className="lede">
              Ex-engineer. Now a solo AI founder, creator, and builder-in-public. One person making products,
              recording content, staying alive.
            </p>
            <div className="hero-actions">
              <Link href="/blog" className="btn">
                Read recent writing →
              </Link>
              <Link href="/projects" className="btn ghost">
                See what I&apos;m building
              </Link>
            </div>
            <div className="now-bar">
              <span className="dot" />
              <span className="label">{SITE.now.status}</span>
              <span>{SITE.now.text}</span>
            </div>
          </div>
          <div className="hero-portrait">
            <span className="stamp">est. 2025</span>
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/panda-avatar.png" alt="Panda avatar" />
            </div>
            <div className="caption">// pixel panda · self-portrait</div>
          </div>
        </div>

        <ASCIIDivider>━━━━━━ recent writing ━━━━━━</ASCIIDivider>

        <div className="section-head">
          <div>
            <div className="eyebrow">§ 01 · Blog</div>
            <h2>What I&apos;ve been thinking about</h2>
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

        <div style={{ height: "var(--sp-9)" }} />

        <div className="section-head">
          <div>
            <div className="eyebrow">§ 02 · Projects</div>
            <h2>Things I&apos;m making</h2>
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

        <div style={{ height: "var(--sp-9)" }} />

        <div className="section-head">
          <div>
            <div className="eyebrow">§ 03 · Elsewhere</div>
            <h2>Find me elsewhere</h2>
          </div>
        </div>
        <Socials />
      </section>
    </div>
  );
}
