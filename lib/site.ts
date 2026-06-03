import type { About, Site } from "./types";

export const SITE: Site = {
  name: "PandaTalk8",
  displayName: "Mr Panda",
  brandName: "PandaTalk8",
  tagline: "AI builder & indie founder. Building products, writing ideas, and selling myself in public.",
  location: "Online",
  xHandle: "@PandaTalk8",
  xUrl: "https://x.com/PandaTalk8",
  xFollowers: "75K",
  wechatName: "PandaTalk8",
  wechatQr: "/assets/wechat/qrcode-pandatalk8.jpg",
  wechatMaterial: "/assets/wechat/material-2.png",
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
        "I'm Mr Panda — a mid-career developer turned indie creator. I spent years on the front lines of the internet industry as an engineer, shipping backend systems and leading teams. Now I work for myself.",
        "I left the corporate world to build my own thing. Today I create content full-time, run paid courses, and stay embarrassingly active on X/Twitter every single day.",
      ],
    },
    {
      heading: "What I do now",
      paragraphs: [
        "I make a living through **self-media traffic and online courses** — teaching AI, programming, and creator growth to thousands of students.",
        "I'm also a long-time X/Twitter native. Most of my audience found me there, and it's still where I spend the most energy: writing threads, sharing lessons, and connecting with other builders.",
      ],
    },
    {
      heading: "What I believe",
      paragraphs: [
        "That the best era for solo creators is right now — one person with AI tools, a distribution channel, and genuine expertise can build a real business.",
        "That content is the product. The course, the community, the brand — they all start from a single tweet or article that resonated.",
        "That mid-career reinvention is hard but worth it. Trading a salary for autonomy is a bet on yourself, and the odds improve every year you keep showing up.",
      ],
    },
    {
      heading: "Say hi",
      paragraphs: [
        "The fastest way to reach me is a DM on X, or search the WeChat public account PandaTalk8. I read everything. I can't always reply — please don't take it personally.",
        "If you're also navigating a career pivot, building courses, or just curious about the indie creator life — come say hi.",
      ],
    },
  ],
  timeline: [
    { year: "2026", what: "Scaling courses & community", detail: "AI courses, creator growth programs, 12K+ learning group." },
    { year: "2025", what: "Went full-time indie", detail: "Left the industry. Content creation, courses, and X growth became the main gig." },
    { year: "2024", what: "Started posting AI content on X", detail: "First tweet to break 10k. Built an audience from zero." },
    { year: "2018–2024", what: "Engineer at a large tech company", detail: "Backend systems, Go, team lead. Six years on the front lines." },
    { year: "2014", what: "First time writing code", detail: "Freshman year. Built a campus used-book trading site." },
  ],
};

export const HOME = {
  kicker: "online · AI builder & indie founder",
  title: "Build products. Write ideas. Create media.",
  titleAccent: "Sell in public",
  lede: "每周分享 AI、编程与独立开发的实战思考。和我一起，在公开场合构建自己的事业。",
  primaryCtaLabel: "Follow @PandaTalk8 →",
  primaryCtaHref: "https://x.com/PandaTalk8",
  secondaryCtaLabel: "订阅公众号",
  secondaryCtaHref: "/about#wechat",
  socialsTitle: "Follow the build",
  showSocials: true,
  showCommunities: true,
  showPosts: true,
  showProjects: true,
  showCourses: true,
};

// Free ebooks shown on the home page. Each PDF lives in R2; covers are static
// assets rendered from HTML in public/assets/books.
export const BOOKS_SECTION = {
  show: true,
  eyebrow: "Free ebooks",
  heading: "免费电子书",
};

export const BOOKS = [
  {
    slug: "x-growth-system",
    title: "X 增长系统方法",
    subtitle: "从 0 到 75K 关注者的实战方法论",
    cover: "/assets/books/x-growth-system-cover.png",
    pages: "112 页",
    lang: "中文",
    format: "PDF",
    href: "https://course-media.xlearnity.ai/pandatalk/books/x-growth-system-method.pdf",
  },
  {
    slug: "ai-agent-framework",
    title: "智能体框架设计",
    subtitle: "从零设计一个 AI Agent 框架",
    cover: "/assets/books/ai-agent-framework-cover.png",
    pages: "142 页",
    lang: "中文",
    format: "PDF",
    href: "https://course-media.xlearnity.ai/pandatalk/books/ai-agent-framework.pdf",
  },
];
