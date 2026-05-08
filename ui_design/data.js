// Site content — posts, projects, about (English)

window.SITE = {
  name: "PandaTalk",
  nameEn: "PandaTalk",
  tagline: {
    en: "Ex-engineer. Now a solo AI founder, creator, and builder-in-public."
  },
  location: "Online",
  socials: [
    { label: "X", handle: "@pandatalk", href: "https://x.com" },
    { label: "GitHub", handle: "pandatalk", href: "https://github.com" },
    { label: "YouTube", handle: "@pandatalk", href: "https://youtube.com" },
    { label: "Newsletter", handle: "Daily Panda", href: "#" },
    { label: "Email", handle: "hi@pandatalk.dev", href: "mailto:hi@pandatalk.dev" }
  ],
  now: {
    status: "currently",
    text: "Building an AI toolkit for indie developers and shipping content daily."
  }
};

window.POSTS = [
  {
    slug: "from-coder-to-creator",
    date: "2026-04-10",
    readTime: "8 min",
    lang: "EN",
    tag: "essay",
    title: "From Coder to Creator: One Year After Quitting My Job",
    excerpt: "A year ago I left a comfortable engineering job to bet everything on AI content and solo products. No audience, no plan, no safety net. Here's what kept me alive.",
    body: [
      {type:"p", text:"A year ago, I quit a stable engineering job I'd held for six years. I was 30, well-paid, on a team I liked. I know how dumb that sounds. But every evening on the subway home, I was scrolling X, looking at strangers' screenshots of their own little products, thinking: why not me."},
      {type:"p", text:"So I quit. The next morning I opened an X account called @pandatalk, used a pixel panda in a green hoodie as the avatar, and then — nothing happened."},
      {type:"h2", text:"Month one: zero"},
      {type:"p", text:"Zero followers, zero revenue, zero posts. Every morning I sat down at 9am to write my first tweet, deleted it, rewrote it. By 4pm I still hadn't posted. I realized: making content is not writing code. Code either runs or it doesn't. A post doesn't go out because you're afraid."},
      {type:"p", text:"So I made one rule: three posts a day, no matter how bad."},
      {type:"h2", text:"Month three: the first 10k"},
      {type:"p", text:"It was a Wednesday night. I'd written a tutorial about Claude Projects with eight screenshots. Woke up to a vibrating phone. 1.2k likes, 200 replies."},
      {type:"p", text:"For the first time I thought: maybe it isn't me. Maybe there are just a lot of people who want to hear this."},
      {type:"h2", text:"Month twelve: today"},
      {type:"p", text:"I have 28k followers, a paid community, two small products, and enough revenue to cover rent and ramen. I'm not famous. But I pay for my own life, and none of what I do every day is something I hate."},
      {type:"p", text:"People ask if it was worth it. I don't know. But if I could go back, I'd quit again."}
    ]
  },
  {
    slug: "claude-code-workflow",
    date: "2026-03-28",
    readTime: "12 min",
    lang: "EN",
    tag: "dev",
    title: "My Claude Code Workflow: Two SaaS in Three Months, Solo",
    excerpt: "Not a tutorial. The honest operations manual of one indie dev using Claude to stretch a one-person team into something closer to three.",
    body: [
      {type:"p", text:"This isn't a feel-good \"AI replaces programmers\" post. It's a logbook of how one solo developer, doing every job in the company, uses AI to pull himself back from the edge of burnout."},
      {type:"h2", text:"Step 1: become your own PM"},
      {type:"p", text:"When I wrote code by hand, I'd think one line and write one line. That doesn't work anymore — AI writes faster than I can think, but it needs direction. So every morning I spend thirty minutes writing Issues, as if assigning work to a direct report."},
      {type:"h2", text:"Step 2: let Claude run in the background"},
      {type:"p", text:"I keep two terminal windows open. One for me. One running Claude Code. It handles the repetitive work — tests, styles, copy — and I handle the judgment calls."},
      {type:"h2", text:"Step 3: review, don't merge"},
      {type:"p", text:"AI writes code that runs and is also garbage. I read every diff. If I don't understand a line, I ask. You cannot skip this step. Skip it once and two weeks later you're maintaining something you don't recognize."}
    ]
  },
  {
    slug: "why-indie-hackers",
    date: "2026-03-15",
    readTime: "6 min",
    lang: "EN",
    tag: "thought",
    title: "Why Indie Hackers Have It Harder — and Better",
    excerpt: "Information gap, language gap, payment gap. Three walls. Very few people get over them, which means once you do, it's a blue ocean on the other side.",
    body: [
      {type:"p", text:"I'm not here to sell anyone inspiration. I'll just say what I see."},
      {type:"p", text:"As an indie hacker, you do one extra job: you translate — tools, ideas, frameworks — from one world to another. It's tedious. It's not technically impressive. And that's exactly why it pays."}
    ]
  },
  {
    slug: "x-growth-journey",
    date: "2026-02-22",
    readTime: "10 min",
    lang: "EN",
    tag: "growth",
    title: "0 → 20k on X: What Actually Worked (And What Didn't)",
    excerpt: "No threads, no bait, no \"10x your engagement\" tricks. What a non-native English speaker learned in a year of posting in public.",
    body: [
      {type:"p", text:"I'm not American. I don't live in SF. English is my second language. And still, X has been the single best business decision I've made in a decade."},
      {type:"h2", text:"The meta nobody shows you"},
      {type:"p", text:"Most growth advice is written by people who already have an audience. The early game is a different game. It's lonely. Your first 100 followers take three months. Your next 10,000 take two weeks."}
    ]
  },
  {
    slug: "tools-i-use-2026",
    date: "2026-02-08",
    readTime: "4 min",
    lang: "EN",
    tag: "uses",
    title: "The Tools I Use Every Day in 2026",
    excerpt: "Editor, writing, video, design, bookkeeping. The full setup for a solo dev who's also a content creator. No affiliate links.",
    body: [
      {type:"p", text:"People ask what I use. Here's the full list. No sponsorships, no affiliate codes."}
    ]
  },
  {
    slug: "building-in-public",
    date: "2026-01-18",
    readTime: "7 min",
    lang: "EN",
    tag: "essay",
    title: "The Year I Wrote Every Commit Message in Public",
    excerpt: "A small rebellion that turned into a ritual. By the end of the year, the way I wrote software had quietly, completely changed.",
    body: [
      {type:"p", text:"At first it was just easier. Later it became a ritual."}
    ]
  }
];

window.PROJECTS = [
  {
    slug: "pandatalk-ai",
    glyph: "P/",
    title: "PandaTalk AI",
    desc: "An AI toolkit for indie developers — unified access to frontier models, a curated prompt library, and a paid community.",
    status: "ship",
    statusLabel: "Live",
    stack: ["Next.js", "Claude", "Stripe"],
    year: "2025–",
    href: "#",
    long: "The project I've worked on the longest. It started as a little tool I built for myself to save on API costs, then I shared it with friends, and a year later it has 800+ paying users. It isn't trying to beat anyone — it just happens to understand its users better than the generic tools do."
  },
  {
    slug: "bamboo-notes",
    glyph: "¶/",
    title: "Bamboo Notes",
    desc: "A Markdown editor built for writers: built-in AI editing, auto illustrations, and one-click publishing to X and newsletter.",
    status: "wip",
    statusLabel: "In progress",
    stack: ["Tauri", "Rust", "React"],
    year: "2026",
    href: "#",
    long: "My own biggest pain as a content person: cross-platform formatting. Bamboo Notes is the thing I built for myself. 30 beta users are testing it now. Launching in June."
  },
  {
    slug: "daily-panda",
    glyph: "✉/",
    title: "Daily Panda",
    desc: "One email every weekday: three deep reads from the AI world, with my commentary. Over 2,000 subscribers.",
    status: "ship",
    statusLabel: "Daily",
    stack: ["Resend", "cron", "Notion"],
    year: "2025–",
    href: "#",
    long: "Since June 2025, every weekday. Never missed one. It's the project I'm most proud of, and by far the one that's brought me the most opportunity — nearly every partnership I have came from a subscriber."
  },
  {
    slug: "prompt-market",
    glyph: "$/",
    title: "PromptMarket",
    desc: "A marketplace for prompts — so good prompts can be paid for, shared, forked, and improved over time.",
    status: "idea",
    statusLabel: "Idea",
    stack: ["idea stage"],
    year: "2026",
    href: "#",
    long: "Still just a thought. If prompts are a new kind of code, they deserve their own GitHub and npm. There isn't one. Maybe I build it."
  },
  {
    slug: "x-lens",
    glyph: "X/",
    title: "X-Lens",
    desc: "Analytics for creators on X — what actually grows your audience, vs. what just felt good to post.",
    status: "ship",
    statusLabel: "Soft launch",
    stack: ["Cloudflare", "D1", "React"],
    year: "2025",
    href: "#",
    long: "A tool I built for myself. A friend saw it and asked me to open it up. Now it has 200 paying users."
  },
  {
    slug: "panda-cursor",
    glyph: ">_",
    title: "panda-cursor.css",
    desc: "A tiny open-source project: replace your website's cursor with a pixel-art panda. 400 stars on GitHub.",
    status: "ship",
    statusLabel: "Open source",
    stack: ["CSS", "OSS"],
    year: "2025",
    href: "#",
    long: "Wrote it over a weekend. Didn't expect anyone to care."
  }
];

window.ABOUT = {
  sections: [
    {
      heading: "Hello",
      paragraphs: [
        "I'm PandaTalk. I spent six years writing backend code at a large tech company, and now I sit in my own rented apartment shipping AI products, recording content, writing code, and talking to strangers on X all day.",
        "I quit in March 2025 to go full-time indie. A year later I'm still alive, and I sleep better than I did in the office."
      ]
    },
    {
      heading: "What I build",
      paragraphs: [
        "I build **AI tools** (mostly for indie developers), I make **content** (X, YouTube, newsletter), and I run a **community** (a paid group, 800 members and counting).",
        "I believe the best products come from tools the maker actually uses. So everything I ship, I use every day."
      ]
    },
    {
      heading: "What I believe",
      paragraphs: [
        "That one person can build something that serves a hundred thousand — as long as they are honest enough, patient enough, and willing to reply to every comment.",
        "That AI is still wildly under-used, especially by non-technical creators. There's a decade of product work in that gap.",
        "That content and products are the same thing, not two different things."
      ]
    },
    {
      heading: "Say hi",
      paragraphs: [
        "The fastest way to reach me is a DM on X, or email at hi@pandatalk.dev. I read everything. I can't always reply — please don't take it personally.",
        "If you're also a solo builder, an AI founder, or just curious — come say hi."
      ]
    }
  ],
  timeline: [
    { year: "2026", what: "Launching Bamboo Notes", detail: "Writing tool for indie creators. June." },
    { year: "2025", what: "Full-time solo: products + content", detail: "PandaTalk AI, Daily Panda, paid community." },
    { year: "2024", what: "Started posting AI content on X", detail: "First tweet to break 10k." },
    { year: "2018–2024", what: "Backend engineer at a large tech company", detail: "Six years of Go. Led an eight-person team." },
    { year: "2014", what: "First time writing code", detail: "Freshman year. Built a campus used-book trading site." }
  ]
};
