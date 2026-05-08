// Projects index + detail

function ProjectsIndex() {
  const ship = window.PROJECTS.filter(p => p.status === "ship");
  const wip = window.PROJECTS.filter(p => p.status === "wip");
  const idea = window.PROJECTS.filter(p => p.status === "idea");
  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 02 — projects</div>
          <h1>Things<br/><span className="serif" style={{fontStyle:"italic", color:"var(--panda-red-deep)"}}>I make</span></h1>
        </div>
        <div className="side">
          Products built by one person. Some shipped, some in progress, some still only ideas.
        </div>
      </section>

      <Group title="Shipped" count={ship.length} projects={ship} />
      <div style={{height:"var(--sp-7)"}} />
      <Group title="In progress" count={wip.length} projects={wip} />
      <div style={{height:"var(--sp-7)"}} />
      <Group title="Ideas" count={idea.length} projects={idea} />
    </div>
  );
}

function Group({ title, count, projects }) {
  if (!projects.length) return null;
  return (
    <>
      <div className="section-head">
        <div>
          <h2 style={{fontSize:"var(--step-2)", margin:0}}>{title}</h2>
        </div>
        <div className="index">{String(count).padStart(2,'0')} projects</div>
      </div>
      <div className="project-grid">
        {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </>
  );
}

function ProjectDetail({ slug }) {
  const project = window.PROJECTS.find(p => p.slug === slug);
  if (!project) return <div className="container" style={{padding:"var(--sp-9) 0"}}><h2>404</h2><a href="#/projects">← back</a></div>;
  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <a href="#/projects" className="back-link">all projects</a>
        <header>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp-4)", marginBottom:"var(--sp-5)"}}>
            <div className="emoji" style={{fontSize:"2.25rem", width:"72px", height:"72px", background:"var(--paper-2)", border:"1.5px solid var(--ink)", display:"grid", placeItems:"center", borderRadius:"var(--radius-md)", boxShadow:"4px 4px 0 var(--panda-red)", fontFamily:"var(--font-mono)", fontWeight:700}}>{project.glyph}</div>
            <div>
              <h1 style={{fontSize:"var(--step-3)", margin:0}}>{project.title}</h1>
              <div className="mono muted" style={{fontSize:"0.82rem", marginTop:"6px"}}>{project.year} · {project.statusLabel}</div>
            </div>
          </div>
          <p style={{fontSize:"var(--step-1)", color:"var(--ink-2)", fontFamily:"var(--font-serif-en), var(--font-serif-zh)", fontStyle:"italic", lineHeight:1.5}}>{project.desc}</p>
          <div className="meta">
            <span>stack:</span>
            {project.stack.map(s => <span key={s} className="tag" style={{marginLeft:"4px"}}>{s}</span>)}
          </div>
        </header>
        <div className="prose">
          <p>{project.long}</p>
          <p className="mono muted" style={{fontSize:"0.85rem", marginTop:"var(--sp-6)"}}>
            ── More project notes coming. DM me on X if you want to talk about this one.
          </p>
        </div>
      </article>
    </div>
  );
}

Object.assign(window, { ProjectsIndex, ProjectDetail });
