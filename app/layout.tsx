import type { Metadata, Viewport } from "next";
import "./globals.css";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="PandaTalk Articles RSS"
          href="/blog/rss.xml"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
