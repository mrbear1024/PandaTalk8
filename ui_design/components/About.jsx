// About page

function About() {
  const a = window.ABOUT;
  const renderPara = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 03 — about</div>
          <h1>About<br/><span className="serif" style={{fontStyle:"italic", color:"var(--panda-red-deep)"}}>me</span></h1>
        </div>
        <div className="side">
          A pixel panda in glasses and a hoodie — and how he got here.
        </div>
      </section>

      <div className="about-grid">
        <aside className="side">
          <div className="about-card">
            <img src="assets/panda-avatar.png" alt="Panda avatar" />
            <div className="name">PandaTalk</div>
            <div className="handle">@pandatalk · he/him</div>
            <div className="stats">
              <div className="row"><span className="k">location</span><span className="v">{window.SITE.location}</span></div>
              <div className="row"><span className="k">status</span><span className="v" style={{color:"var(--bamboo-deep)"}}>●&nbsp; open to chat</span></div>
              <div className="row"><span className="k">years coding</span><span className="v">12</span></div>
              <div className="row"><span className="k">years solo</span><span className="v">1</span></div>
              <div className="row"><span className="k">coffee/day</span><span className="v">3 ☕</span></div>
            </div>
            <Socials />
          </div>
        </aside>
        <div className="main">
          <div className="prose">
            {a.sections.map((s, i) => (
              <React.Fragment key={i}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, j) => <p key={j}>{renderPara(p)}</p>)}
              </React.Fragment>
            ))}
            <h2>Timeline</h2>
            <ul className="timeline">
              {a.timeline.map((t, i) => (
                <li key={i}>
                  <span className="year">{t.year}</span>
                  <span className="what">{t.what}<span className="detail">{t.detail}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { About });
