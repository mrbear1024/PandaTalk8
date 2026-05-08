import type { About, Site } from "./types";

export const SITE: Site = {
  name: "PandaTalk8",
  displayName: "Mr Panda",
  brandName: "PandaTalk8",
  tagline: "AI builder & indie founder. Building products, writing ideas, and selling myself in public.",
  location: "Online",
  xHandle: "@PandaTalk8",
  xUrl: "https://x.com/PandaTalk8",
  xFollowers: "74.9K",
  wechatName: "PandaTalk8",
  domain: "pandatalk8.com",
  socials: [
    { label: "X", handle: "@PandaTalk8", href: "https://x.com/PandaTalk8" },
    { label: "公众号", handle: "PandaTalk8", href: "/about#wechat" },
    { label: "YouTube", handle: "@pandatalk8", href: "https://www.youtube.com/@pandatalk8" },
    { label: "GitHub", handle: "mrbear1024", href: "https://github.com/mrbear1024" },
    { label: "RSS", handle: "/blog/rss.xml", href: "/blog/rss.xml" },
  ],
  now: {
    status: "currently",
    text: "Building AI products, writing in public, and documenting the indie journey.",
  },
};

export const ABOUT: About = {
  sections: [
    {
      heading: "Hello",
      paragraphs: [
        "I'm Mr Panda. I spent six years writing backend code at a large tech company, and now I sit in my own rented apartment shipping AI products, recording content, writing code, and talking to strangers on X all day.",
        "I quit in March 2025 to go full-time indie. A year later I'm still alive, and I sleep better than I did in the office.",
      ],
    },
    {
      heading: "What I build",
      paragraphs: [
        "I build **AI tools**, make **content** on X and WeChat, and run paid communities for AI learning and X growth.",
        "I believe the best products come from tools the maker actually uses. So everything I ship, I use every day.",
      ],
    },
    {
      heading: "What I believe",
      paragraphs: [
        "That one person can build something that serves a hundred thousand — as long as they are honest enough, patient enough, and willing to reply to every comment.",
        "That AI is still wildly under-used, especially by non-technical creators. There's a decade of product work in that gap.",
        "That content and products are the same thing, not two different things.",
      ],
    },
    {
      heading: "Say hi",
      paragraphs: [
        "The fastest way to reach me is a DM on X, or search the WeChat public account PandaTalk8. I read everything. I can't always reply — please don't take it personally.",
        "If you're also a solo builder, an AI founder, or just curious — come say hi.",
      ],
    },
  ],
  timeline: [
    { year: "2026", what: "Launching Bamboo Notes", detail: "Writing tool for indie creators. June." },
    { year: "2025", what: "Full-time solo: products + content", detail: "PandaTalk8, AI learning, X growth, paid communities." },
    { year: "2024", what: "Started posting AI content on X", detail: "First tweet to break 10k." },
    { year: "2018–2024", what: "Backend engineer at a large tech company", detail: "Six years of Go. Led an eight-person team." },
    { year: "2014", what: "First time writing code", detail: "Freshman year. Built a campus used-book trading site." },
  ],
};
