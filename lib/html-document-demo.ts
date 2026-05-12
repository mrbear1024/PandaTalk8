import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Post } from "./types";

export const HTML_DOCUMENT_DEMO_SLUG = "blog-architecture-demo";

export async function getHtmlDocumentDemoPost(slug: string): Promise<Post | null> {
  if (slug !== HTML_DOCUMENT_DEMO_SLUG) return null;

  const body = await readFile(
    path.join(process.cwd(), "docs", "blog-architecture.html"),
    "utf8"
  );

  return {
    slug: HTML_DOCUMENT_DEMO_SLUG,
    date: "2026-05-11",
    read_time: "8 min",
    lang: "ZH",
    tag: "dev",
    title: "PandaTalk8 博客文章发布技术方案",
    excerpt: "支持 HTML 预渲染、Markdown 动态渲染和完整 HTML 文档隔离发布的博客架构方案。",
    body,
    body_format: "html_document",
    cover: null,
    featured: false,
  };
}
