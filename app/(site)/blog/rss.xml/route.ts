import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

function siteOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (env) return env.replace(/\/$/, "");
  return "https://pandatalk.dev";
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function blocksToText(post: Post): string {
  if (typeof post.body === "string") return post.body;
  if (!post.body) return "";
  return post.body
    .map((b) => {
      if (b.type === "p") return `<p>${escapeXml(b.text)}</p>`;
      const tag = b.type;
      return `<${tag}>${escapeXml(b.text)}</${tag}>`;
    })
    .join("");
}

function toRfc822(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function GET() {
  const posts = await getAllPosts();
  const origin = siteOrigin();
  const updated = posts[0]?.date ? toRfc822(posts[0].date) : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${origin}/blog/${encodeURIComponent(p.slug)}`;
      const html = blocksToText(p);
      return [
        "<item>",
        `<title>${escapeXml(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${toRfc822(p.date)}</pubDate>`,
        `<description>${escapeXml(p.excerpt)}</description>`,
        `<content:encoded><![CDATA[${html}]]></content:encoded>`,
        `<category>${escapeXml(p.tag)}</category>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>${escapeXml(SITE.name)}</title>` +
    `<link>${origin}</link>` +
    `<description>${escapeXml(SITE.tagline)}</description>` +
    `<language>en</language>` +
    `<lastBuildDate>${updated}</lastBuildDate>` +
    `<atom:link href="${origin}/blog/rss.xml" rel="self" type="application/rss+xml" />` +
    items +
    `</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
}
