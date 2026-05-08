import "server-only";
import { common, createLowlight } from "lowlight";
import { toHtml } from "hast-util-to-html";

const lowlight = createLowlight(common);

const HTML_DECODE: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
  "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&(amp|lt|gt|quot|#39|#x27|#x2F|nbsp);/g, (m) => HTML_DECODE[m] ?? m);
}

// Walk every <pre><code class="language-XYZ">…</code></pre> in the post body
// and replace the inner text with a lowlight-syntax-highlighted hast tree
// rendered to HTML. Adds the `hljs` class so theme styles apply.
//
// Code without a language hint (or with an unknown one) is rendered as plain
// text inside an hljs container — same look, no token coloring.
export function highlightCodeBlocks(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(
    /<pre>\s*<code(\s+class="(?:[^"]*\s)?language-([A-Za-z0-9_+-]+)(?:\s[^"]*)?")?>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (_match, _classAttr, lang, inner) => {
      const code = decodeEntities(inner);
      const language = lang || "plaintext";
      try {
        const tree = lowlight.registered(language)
          ? lowlight.highlight(language, code)
          : lowlight.highlightAuto(code);
        const rendered = toHtml(tree);
        return `<pre class="post-code-pre"><code class="hljs language-${escapeAttr(language)}">${rendered}</code></pre>`;
      } catch {
        return `<pre class="post-code-pre"><code class="hljs language-${escapeAttr(language)}">${escapeHtml(code)}</code></pre>`;
      }
    }
  );
}

function escapeAttr(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}
