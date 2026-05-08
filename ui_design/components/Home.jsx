// Home page — hero + latest posts + featured projects + now bar

function Home() {
  const latestPosts = window.POSTS.slice(0, 4);
  const featuredProjects = window.PROJECTS.slice(0, 3);
  return (
    <div className="route-enter">
      <section className="container">
        <div className="hero">
          <div className="hero-copy">
            <div className="kicker">online · building in public</div>
            <h1>
              Hi, I'm<br/>
              <span className="stroke">PandaTalk</span>.
            </h1>
            <p className="lede">
              Ex-engineer. Now a solo AI founder, creator, and builder-in-public.
              One person making products, recording content, staying alive.
            </p>
            <div className="hero-actions">
              <a href="#/blog" className="btn">Read recent writing →</a>
              <a href="#/projects" className="btn ghost">See what I'm building</a>
            </div>
            <div className="now-bar">
              <span className="dot"></span>
              <span className="label">{window.SITE.now.status}</span>
              <span>{window.SITE.now.text}</span>
            </div>
          </div>
          <div className="hero-portrait">
            <span className="stamp">est. 2025</span>
            <div className="frame">
              <img src="assets/panda-avatar.png" alt="Panda avatar" />
            </div>
            <div className="caption">// pixel panda · self-portrait</div>
          </div>
        </div>

        <ASCIIDivider>━━━━━━ recent writing ━━━━━━</ASCIIDivider>

        <div className="section-head">
          <div>
            <div className="eyebrow">§ 01 · Blog</div>
            <h2>What I've been thinking about</h2>
          </div>
          <div className="index"><a href="#/blog">all posts ({window.POSTS.length}) →</a></div>
        </div>
        <ul className="post-list">
          {latestPosts.map(p => <PostRow key={p.slug} post={p} />)}
        </ul>

        <div style={{height:"var(--sp-9)"}} />

        <div className="section-head">
          <div>
            <div className="eyebrow">§ 02 · Projects</div>
            <h2>Things I'm making</h2>
          </div>
          <div className="index"><a href="#/projects">all projects →</a></div>
        </div>
        <div className="project-grid">
          {featuredProjects.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>

        <div style={{height:"var(--sp-9)"}} />

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

function PostRow({ post }) {
  return (
    <li className="post-item">
      <span className="date">{formatDate(post.date)}</span>
      <div>
        <a href={`#/blog/${post.slug}`} className="title">{post.title}</a>
        <div className="excerpt">{post.excerpt}</div>
        <div style={{marginTop:"10px", display:"flex", gap:"8px"}}>
          <span className={`tag ${post.tag === 'dev' ? 'green' : post.tag === 'growth' ? 'mustard' : 'red'}`}>{post.tag}</span>
          <span className="tag">{post.lang}</span>
        </div>
      </div>
      <span className="meta">{post.readTime}</span>
    </li>
  );
}

function ProjectCard({ project }) {
  return (
    <a href={`#/projects/${project.slug}`} className="project-card">
      <div className="head">
        <div className="emoji">{project.glyph}</div>
        <span className={`status ${project.status}`}>
          <span className="dot"></span>
          {project.statusLabel}
        </span>
      </div>
      <h3>{project.title}</h3>
      <p className="project-desc">{project.desc}</p>
      <div className="project-meta">
        <div className="tags">
          {project.stack.map(s => <span key={s} className="tag">{s}</span>)}
        </div>
        <span>{project.year}</span>
      </div>
    </a>
  );
}

Object.assign(window, { Home, PostRow, ProjectCard });
