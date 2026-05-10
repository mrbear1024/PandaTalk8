import type { Metadata } from "next";
import type { Post } from "./types";
import { SITE } from "./site";

const FALLBACK_SITE_URL = "https://pandatalk8.com";

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    FALLBACK_SITE_URL
);

export const siteName = `${SITE.displayName} · ${SITE.brandName}`;
export const defaultDescription = SITE.tagline;
export const defaultOgImage = absoluteUrl("/api/og/brand");

function normalizeSiteUrl(value: string): string {
  const withProtocol = value.startsWith("http") ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path: string | null | undefined): string {
  if (!path) return defaultOgImage;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("//")) return `https:${path}`;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalPath(path: string): string {
  return absoluteUrl(path);
}

export function articlePath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}`;
}

export function articleOgImage(post: Post): string {
  if (post.cover) return absoluteUrl(post.cover);
  const url = new URL("/api/og/article", siteUrl);
  url.searchParams.set("title", truncate(post.title, 82));
  url.searchParams.set("tag", truncate(post.tag, 24));
  url.searchParams.set("excerpt", truncate(post.excerpt, 128));
  return url.toString();
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: siteName,
    description: defaultDescription,
    icons: { icon: "/assets/panda-avatar.png" },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description: defaultDescription,
      url: siteUrl,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.xHandle,
      creator: SITE.xHandle,
      title: siteName,
      description: defaultDescription,
      images: [defaultOgImage],
    },
  };
}
