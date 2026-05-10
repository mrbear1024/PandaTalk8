import type { PostBodyBlock } from "./types";

// Public post slugs are intentionally ASCII-only for portable URLs.
// Allowed characters: lowercase English letters and ASCII hyphens.
export function slugify(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug || "post";
}

export function deriveReadTime(blocks: PostBodyBlock[]): string {
  const text = blocks.map((b) => b.text).join(" ");
  return deriveReadTimeFromText(text);
}

export function deriveExcerpt(blocks: PostBodyBlock[]): string {
  const firstP = blocks.find((b) => b.type === "p");
  const text = (firstP?.text ?? blocks[0]?.text ?? "").trim();
  return clipExcerpt(text);
}

export function deriveReadTimeFromText(text: string): string {
  // Mix CJK chars (1 char ≈ 1 word) and Latin words.
  const cjk = (text.match(/[一-鿿]/g) ?? []).length;
  const latin = (text.replace(/[一-鿿]/g, " ").match(/\S+/g) ?? []).length;
  const minutes = Math.max(1, Math.ceil((cjk + latin) / 220));
  return `${minutes} min`;
}

export function deriveExcerptFromText(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // Prefer the first line longer than 30 chars (skips short headings); fall
  // back to the first non-empty line.
  const first = lines.find((l) => l.length > 30) ?? lines[0] ?? "";
  return clipExcerpt(first);
}

function clipExcerpt(text: string): string {
  const t = text.trim();
  if (t.length <= 180) return t;
  return t.slice(0, 177).trimEnd() + "…";
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
