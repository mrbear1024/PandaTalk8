import type { Community, Course, Post, Project } from "./types";

export const SEED_POSTS: Post[] = [
  {
    slug: "from-coder-to-creator",
    date: "2026-04-10",
    read_time: "8 min",
    lang: "EN",
    tag: "essay",
    featured: true,
    title: "From Coder to Creator: One Year After Quitting My Job",
    excerpt:
      "A year ago I left a comfortable engineering job to bet everything on AI content and solo products. No audience, no plan, no safety net. Here's what kept me alive.",
    body: [
      { type: "p", text: "A year ago, I quit a stable engineering job I'd held for six years. I was 30, well-paid, on a team I liked. I know how dumb that sounds. But every evening on the subway home, I was scrolling X, looking at strangers' screenshots of their own little products, thinking: why not me." },
      { type: "p", text: "So I quit. The next morning I opened an X account called @pandatalk, used a pixel panda in a green hoodie as the avatar, and then — nothing happened." },
      { type: "h2", text: "Month one: zero" },
      { type: "p", text: "Zero followers, zero revenue, zero posts. Every morning I sat down at 9am to write my first tweet, deleted it, rewrote it. By 4pm I still hadn't posted. I realized: making content is not writing code. Code either runs or it doesn't. A post doesn't go out because you're afraid." },
      { type: "p", text: "So I made one rule: three posts a day, no matter how bad." },
      { type: "h2", text: "Month three: the first 10k" },
      { type: "p", text: "It was a Wednesday night. I'd written a tutorial about Claude Projects with eight screenshots. Woke up to a vibrating phone. 1.2k likes, 200 replies." },
      { type: "p", text: "For the first time I thought: maybe it isn't me. Maybe there are just a lot of people who want to hear this." },
      { type: "h2", text: "Month twelve: today" },
      { type: "p", text: "I have 28k followers, a paid community, two small products, and enough revenue to cover rent and ramen. I'm not famous. But I pay for my own life, and none of what I do every day is something I hate." },
      { type: "p", text: "People ask if it was worth it. I don't know. But if I could go back, I'd quit again." },
    ],
  },
  {
    slug: "claude-code-workflow",
    date: "2026-03-28",
    read_time: "12 min",
    lang: "EN",
    tag: "dev",
    title: "My Claude Code Workflow: Two SaaS in Three Months, Solo",
    excerpt:
      "Not a tutorial. The honest operations manual of one indie dev using Claude to stretch a one-person team into something closer to three.",
    body: [
      { type: "p", text: "This isn't a feel-good \"AI replaces programmers\" post. It's a logbook of how one solo developer, doing every job in the company, uses AI to pull himself back from the edge of burnout." },
      { type: "h2", text: "Step 1: become your own PM" },
      { type: "p", text: "When I wrote code by hand, I'd think one line and write one line. That doesn't work anymore — AI writes faster than I can think, but it needs direction. So every morning I spend thirty minutes writing Issues, as if assigning work to a direct report." },
      { type: "h2", text: "Step 2: let Claude run in the background" },
      { type: "p", text: "I keep two terminal windows open. One for me. One running Claude Code. It handles the repetitive work — tests, styles, copy — and I handle the judgment calls." },
      { type: "h2", text: "Step 3: review, don't merge" },
      { type: "p", text: "AI writes code that runs and is also garbage. I read every diff. If I don't understand a line, I ask. You cannot skip this step. Skip it once and two weeks later you're maintaining something you don't recognize." },
    ],
  },
  {
    slug: "why-indie-hackers",
    date: "2026-03-15",
    read_time: "6 min",
    lang: "EN",
    tag: "thought",
    title: "Why Indie Hackers Have It Harder — and Better",
    excerpt:
      "Information gap, language gap, payment gap. Three walls. Very few people get over them, which means once you do, it's a blue ocean on the other side.",
    body: [
      { type: "p", text: "I'm not here to sell anyone inspiration. I'll just say what I see." },
      { type: "p", text: "As an indie hacker, you do one extra job: you translate — tools, ideas, frameworks — from one world to another. It's tedious. It's not technically impressive. And that's exactly why it pays." },
    ],
  },
  {
    slug: "x-growth-journey",
    date: "2026-02-22",
    read_time: "10 min",
    lang: "EN",
    tag: "growth",
    title: "0 → 20k on X: What Actually Worked (And What Didn't)",
    excerpt:
      "No threads, no bait, no \"10x your engagement\" tricks. What a non-native English speaker learned in a year of posting in public.",
    body: [
      { type: "p", text: "I'm not American. I don't live in SF. English is my second language. And still, X has been the single best business decision I've made in a decade." },
      { type: "h2", text: "The meta nobody shows you" },
      { type: "p", text: "Most growth advice is written by people who already have an audience. The early game is a different game. It's lonely. Your first 100 followers take three months. Your next 10,000 take two weeks." },
    ],
  },
  {
    slug: "tools-i-use-2026",
    date: "2026-02-08",
    read_time: "4 min",
    lang: "EN",
    tag: "uses",
    title: "The Tools I Use Every Day in 2026",
    excerpt:
      "Editor, writing, video, design, bookkeeping. The full setup for a solo dev who's also a content creator. No affiliate links.",
    body: [
      { type: "p", text: "People ask what I use. Here's the full list. No sponsorships, no affiliate codes." },
    ],
  },
  {
    slug: "building-in-public",
    date: "2026-01-18",
    read_time: "7 min",
    lang: "EN",
    tag: "essay",
    title: "The Year I Wrote Every Commit Message in Public",
    excerpt:
      "A small rebellion that turned into a ritual. By the end of the year, the way I wrote software had quietly, completely changed.",
    body: [
      { type: "p", text: "At first it was just easier. Later it became a ritual." },
    ],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    slug: "xlearnity-ai",
    glyph: "X/",
    title: "xlearnity.ai",
    description:
      "An AI-powered learning platform that turns any topic into a personalised, structured curriculum.",
    status: "ship",
    status_label: "Live",
    stack: ["Next.js", "AI", "Supabase"],
    year: "2025–",
    href: "https://xlearnity.ai",
    cta_label: "Open project",
    cta_href: "https://xlearnity.ai",
    audience: "AI learners and indie builders who want a structured path from topic to practice.",
    sort_order: 1,
    featured: true,
    long:
      "xlearnity.ai is my flagship project: an AI-powered learning platform that turns any topic into a personalised, structured curriculum. It's where most of my time goes right now.",
  },
];

export const SEED_COMMUNITIES: Community[] = [
  {
    slug: "x-growth-wechat",
    name: "X 增长微信群",
    subtitle: "Flagship community for X growth and monetization.",
    price: "789",
    currency: "¥",
    cover: null,
    description:
      "面向想系统做 X 增长、内容定位和商业化的创作者与独立开发者。这里讨论账号定位、内容策略、案例拆解和实战复盘。",
    audience: "适合已经开始发 X，想把内容增长变成产品、社群或商业机会的人。",
    highlights: ["账号定位与内容策略", "X 增长案例拆解", "商业化路径与产品化思路"],
    includes: ["微信群交流", "增长复盘", "内容选题讨论", "实战案例分享"],
    faq: [
      { q: "适合零基础吗？", a: "更适合已经准备认真做 X 的人；完全零基础可以先看 X 冷启动成长群。" },
      { q: "如何加入？", a: "进入详情页查看公众号或微信引导，按说明完成加入。" },
    ],
    join_instructions: "微信搜索公众号 PandaTalk8，发送「X增长」获取加入方式。",
    cta_label: "查看加入方式",
    sort_order: 1,
    featured: true,
    status: "published",
  },
  {
    slug: "ai-learning-circle",
    name: "熊老板的 AI 学习圈",
    subtitle: "AI tools, workflows, and practical learning notes.",
    price: "199",
    currency: "¥",
    cover: null,
    description:
      "持续学习 AI 工具、工作流、产品案例和创作者实践，适合想把 AI 真正用进工作和产品里的人。",
    audience: "适合 AI 学习者、内容创作者、独立开发者和想提升生产力的人。",
    highlights: ["AI 工具与工作流", "产品案例拆解", "学习资料与实践笔记"],
    includes: ["知识星球内容", "AI 案例分享", "工具清单", "学习路径"],
    faq: [{ q: "内容偏技术吗？", a: "不只面向程序员，更关注 AI 如何进入真实工作流和产品实践。" }],
    join_instructions: "微信搜索公众号 PandaTalk8，发送「AI学习圈」获取加入方式。",
    cta_label: "查看加入方式",
    sort_order: 2,
    featured: false,
    status: "published",
  },
  {
    slug: "x-cold-start",
    name: "X 冷启动成长群",
    subtitle: "Low-friction starter path for building on X.",
    price: "79",
    currency: "¥",
    cover: null,
    description:
      "低价入门产品，帮助刚开始做 X 的人完成账号定位、第一批内容、早期互动和冷启动节奏。",
    audience: "适合刚开始做 X，想用较低门槛建立基础方法的人。",
    highlights: ["0 到 1 冷启动", "账号基础搭建", "早期内容节奏"],
    includes: ["成长群交流", "冷启动资料", "基础方法论", "常见问题答疑"],
    faq: [{ q: "和 789 元微信群有什么区别？", a: "这个是低价入门，旗舰微信群更适合系统增长和商业化。" }],
    join_instructions: "微信搜索公众号 PandaTalk8，发送「冷启动」获取加入方式。",
    cta_label: "查看加入方式",
    sort_order: 3,
    featured: false,
    status: "published",
  },
];

export const SEED_COURSES: Course[] = [
  {
    slug: "x-growth-system",
    title: "X Growth System",
    subtitle: "Build, write, and sell in public.",
    cover: null,
    description: "一门关于 X 账号定位、内容增长和商业化路径的系统课程。课程在独立系统中承接。",
    price: "Coming soon",
    status: "coming_soon",
    external_url: "https://pandatalk8.com",
    cta_label: "查看课程系统",
    sort_order: 1,
    featured: true,
  },
];
