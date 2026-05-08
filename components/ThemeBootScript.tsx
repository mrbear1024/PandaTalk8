// Runs before paint to avoid theme flash. Render once in <head>.
export default function ThemeBootScript() {
  const code = `(function(){try{var t=localStorage.getItem("pt-theme")||"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
