// Tweaks panel — toggles accent color, theme, density
function Tweaks({ open, onClose, state, onChange }) {
  if (!open) return null;
  const accents = [
    { key: "panda-red", label: "Panda Red", color: "#C8532A" },
    { key: "bamboo", label: "Bamboo", color: "#2E6B3F" },
    { key: "mustard", label: "Mustard", color: "#C9923B" },
    { key: "ink", label: "Ink", color: "#1A1A1A" }
  ];
  const colorVars = {
    "panda-red": "#C8532A",
    "bamboo": "#2E6B3F",
    "mustard": "#C9923B",
    "ink": "#1A1A1A"
  };
  return (
    <div className="tweaks-panel open">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--sp-3)"}}>
        <h4>Tweaks</h4>
        <button onClick={onClose} style={{background:"none", border:"none", cursor:"pointer", color:"var(--muted)", fontFamily:"var(--font-mono)"}}>✕</button>
      </div>
      <div className="field">
        <label>accent</label>
        <div className="swatch-row">
          {accents.map(a => (
            <div
              key={a.key}
              className={`swatch ${state.accent === a.key ? "active" : ""}`}
              style={{background: a.color}}
              title={a.label}
              onClick={() => {
                onChange({accent: a.key});
                document.documentElement.style.setProperty("--panda-red", colorVars[a.key]);
                document.documentElement.style.setProperty("--panda-red-deep", colorVars[a.key]);
              }}
            />
          ))}
        </div>
      </div>
      <div className="field">
        <label>theme</label>
        <select value={state.theme} onChange={e => {
          onChange({theme: e.target.value});
          document.documentElement.setAttribute("data-theme", e.target.value);
          localStorage.setItem("pt-theme", e.target.value);
        }}>
          <option value="light">light — warm paper</option>
          <option value="dark">dark — ink</option>
        </select>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
