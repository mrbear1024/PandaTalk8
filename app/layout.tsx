import type { Metadata } from "next";
import "./globals.css";
import ThemeBootScript from "@/components/ThemeBootScript";

export const metadata: Metadata = {
  title: "PandaTalk8 · Mr Panda",
  description: "AI builder & indie founder. Building products, writing ideas, and selling myself in public.",
  icons: { icon: "/assets/panda-avatar.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="PandaTalk Articles RSS"
          href="/blog/rss.xml"
        />
        <ThemeBootScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
