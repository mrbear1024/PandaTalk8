// Blog index + article detail

function BlogIndex() {
  const [filter, setFilter] = useState("all");
  const tags = useMemo(() => ["all", ...new Set(window.POSTS.map(p => p.tag))], []);
  const list = filter === "all" ? window.POSTS : window.POSTS.filter(p => p.tag === filter);
  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 01 — writing</div>
          <h1>The<br/><span className="serif" style={{fontStyle:"italic", color:"var(--panda-red-deep)"}}>Notes</span></h1>
        </div>
        <div className="side">
          Long-form notes on indie building, AI, and the slow process of learning to make things in public.
        </div>
      </section>

      <div style={{display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"var(--sp-6)"}}>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="tag"
            style={{
              cursor:"pointer",
              border: filter === t ? "1px solid var(--ink)" : undefined,
              color: filter === t ? "var(--ink)" : undefined,
              background: filter === t ? "var(--paper-3)" : undefined,
              fontWeight: filter === t ? 600 : 400
            }}
          >{t} {filter === t && `(${list.length})`}</button>
        ))}
      </div>

      <ul className="post-list">
        {list.map(p => <PostRow key={p.slug} post={p} />)}
      </ul>
    </div>
  );
}

function Article({ slug }) {
  const post = window.POSTS.find(p => p.slug === slug);
  if (!post) return <div className="container" style={{padding:"var(--sp-9) 0"}}><h2>404 · not found</h2><a href="#/blog">← back to blog</a></div>;
  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <a href="#/blog" className="back-link">all posts</a>
        <header>
          <div className="eyebrow">{post.tag} · {post.lang}</div>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} read</span>
            <span>·</span>
            <span>by PandaTalk</span>
          </div>
        </header>
        <div className="prose">
          {post.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
            return <p key={i}>{b.text}</p>;
          })}
          <ASCIIDivider>━━━ fin ━━━</ASCIIDivider>
          <p className="mono muted" style={{fontSize:"0.85rem", textAlign:"center"}}>
            If you read this far — thank you.<br/>
            Come tell me what you thought on <a href="https://x.com" target="_blank" rel="noopener">X</a>.
          </p>
        </div>
      </article>
    </div>
  );
}

Object.assign(window, { BlogIndex, Article });
