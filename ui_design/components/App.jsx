// Main app root — renders shell + routes
function App() {
  const { path } = useHashRoute();
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  // Tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({type: "__edit_mode_available"}, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const updateTweak = (patch) => {
    setTweaks(prev => ({...prev, ...patch}));
    window.parent.postMessage({type: "__edit_mode_set_keys", edits: patch}, "*");
  };

  let view;
  if (path.length === 0) view = <Home />;
  else if (path[0] === "blog" && !path[1]) view = <BlogIndex />;
  else if (path[0] === "blog" && path[1]) view = <Article slug={path[1]} />;
  else if (path[0] === "projects" && !path[1]) view = <ProjectsIndex />;
  else if (path[0] === "projects" && path[1]) view = <ProjectDetail slug={path[1]} />;
  else if (path[0] === "about") view = <About />;
  else view = <div className="container" style={{padding:"var(--sp-9) 0"}}><h1>404</h1><a href="#/">← home</a></div>;

  return (
    <>
      <Nav path={path} />
      <main data-screen-label={path[0] || "home"}>{view}</main>
      <Footer />
      <Tweaks open={tweaksOpen} onClose={() => setTweaksOpen(false)} state={tweaks} onChange={updateTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
