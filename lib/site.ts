import type { About, Site } from "./types";

export const SITE: Site = {
  name: "PandaTalk",
  tagline: "Ex-engineer. Now a solo AI founder, creator, and builder-in-public.",
  location: "Online",
  socials: [
    { label: "X", handle: "@pandatalk", href: "https://x.com" },
    { label: "GitHub", handle: "pandatalk", href: "https://github.com" },
    { label: "YouTube", handle: "@pandatalk", href: "https://youtube.com" },
    { label: "Newsletter", handle: "Daily Panda", href: "#" },
    { label: "Email", handle: "hi@pandatalk.dev", href: "mailto:hi@pandatalk.dev" },
  ],
  now: {
    status: "currently",
    text: "Building an AI toolkit for indie developers and shipping content daily.",
  },
};

export const ABOUT: About = {
  sections: [
    {
      heading: "Hello",
      paragraphs: [
        "I'm PandaTalk. I spent six years writing backend code at a large tech company, and now I sit in my own rented apartment shipping AI products, recording content, writing code, and talking to strangers on X all day.",
        "I quit in March 2025 to go full-time indie. A year later I'm still alive, and I sleep better than I did in the office.",
      ],
    },
    {
      heading: "What I build",
      paragraphs: [
        "I build **AI tools** (mostly for indie developers), I make **content** (X, YouTube, newsletter), and I run a **community** (a paid group, 800 members and counting).",
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
        "The fastest way to reach me is a DM on X, or email at hi@pandatalk.dev. I read everything. I can't always reply — please don't take it personally.",
        "If you're also a solo builder, an AI founder, or just curious — come say hi.",
      ],
    },
  ],
  timeline: [
    { year: "2026", what: "Launching Bamboo Notes", detail: "Writing tool for indie creators. June." },
    { year: "2025", what: "Full-time solo: products + content", detail: "PandaTalk AI, Daily Panda, paid community." },
    { year: "2024", what: "Started posting AI content on X", detail: "First tweet to break 10k." },
    { year: "2018–2024", what: "Backend engineer at a large tech company", detail: "Six years of Go. Led an eight-person team." },
    { year: "2014", what: "First time writing code", detail: "Freshman year. Built a campus used-book trading site." },
  ],
};
