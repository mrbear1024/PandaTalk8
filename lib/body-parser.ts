import type { PostBodyBlock } from "./types";

// Parse a markdown-lite textarea into a block array.
// Each non-blank line is one block.
//   "# ..."     → h1
//   "## ..."    → h2
//   "### ..."   → h3
//   "#### ..."  → h4
//   "##### ..." → h5
//   "###### ..."→ h6
//   else        → p
//
// Order matters — longest prefix first, otherwise "#### foo" would match
// "### " and produce an h3 with text "# foo".
const HEADING_LEVELS = [6, 5, 4, 3, 2, 1] as const;

export function parseBody(input: string): PostBodyBlock[] {
  return input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line): PostBodyBlock => {
      for (const lvl of HEADING_LEVELS) {
        const prefix = "#".repeat(lvl) + " ";
        if (line.startsWith(prefix)) {
          const type = (`h${lvl}`) as `h${1 | 2 | 3 | 4 | 5 | 6}`;
          return { type, text: line.slice(prefix.length).trim() } as PostBodyBlock;
        }
      }
      return { type: "p", text: line };
    });
}

// Reverse: blocks → textarea string. Inserts a blank line between blocks.
export function serializeBody(blocks: PostBodyBlock[] | null | undefined): string {
  if (!blocks || blocks.length === 0) return "";
  return blocks
    .map((b) => {
      if (b.type === "h1") return `# ${b.text}`;
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "h3") return `### ${b.text}`;
      if (b.type === "h4") return `#### ${b.text}`;
      if (b.type === "h5") return `##### ${b.text}`;
      if (b.type === "h6") return `###### ${b.text}`;
      return b.text;
    })
    .join("\n\n");
}

// Convert legacy block array → HTML for editing in the rich editor.
const HTML_ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESC[c]);

export function blocksToHtml(blocks: PostBodyBlock[] | null | undefined): string {
  if (!blocks || blocks.length === 0) return "";
  return blocks
    .map((b) => {
      const text = escapeHtml(b.text);
      if (b.type === "p") return `<p>${text}</p>`;
      return `<${b.type}>${text}</${b.type}>`;
    })
    .join("\n");
}
