// App shell + router

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "panda-red",
  "theme": "light",
  "density": "cozy"
}/*EDITMODE-END*/;

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { path: parts, raw: hash };
}

function Nav({ path }) {
  const current = path[0] || "home";
  const items = [
    { key: "home", label: "home", href: "#/" },
    { key: "blog", label: "blog", href: "#/blog" },
    { key: "projects", label: "projects", href: "#/projects" },
    { key: "about", label: "about", href: "#/about" }
  ];
  return (
    <header className="site-header">
      <div className="inner">
        <a href="#/" className="brand">
          <img src="assets/panda-avatar.png" alt="" className="brand-avatar" style={{borderWidth: "2px 2px 2px 0px"}} />
          <span className="brand-name">
            <span className="zh">Panda</span>
            <span className="en">solo / ai / builder</span>
          </span>
        </a>
        <nav className="primary">
          {items.map(it => (
            <a key={it.key} href={it.href} className={current === it.key || (current === "" && it.key === "home") ? "active" : ""}>
              {it.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("pt-theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pt-theme", theme);
  }, [theme]);
  return (
    <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "◐ dark" : "◑ light"}
    </button>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>© 2026 PandaTalk · built with ♥ and Claude</div>
        <div style={{display:"flex", gap:"20px", flexWrap:"wrap"}}>
          <a href="#/blog">blog</a>
          <a href="#/projects">projects</a>
          <a href="#/about">about</a>
          <a href="https://x.com" target="_blank" rel="noopener">X</a>
          <a href="#">rss</a>
        </div>
      </div>
    </footer>
  );
}

function ASCIIDivider({ children = "· · · panda · · ·" }) {
  return <div className="ascii-divider">{children}</div>;
}

function Socials() {
  return (
    <div className="socials">
      {window.SITE.socials.map(s => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener">
          <strong>{s.label}</strong> <span style={{opacity:0.6}}>·</span> {s.handle}
        </a>
      ))}
    </div>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  return `${m} ${d.getDate()}, ${d.getFullYear()}`;
}

Object.assign(window, { Nav, Footer, ASCIIDivider, Socials, formatDate, useHashRoute, TWEAK_DEFAULTS });
