import type { Post, Project } from "./types";

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
    long:
      "xlearnity.ai is my flagship project: an AI-powered learning platform that turns any topic into a personalised, structured curriculum. It's where most of my time goes right now.",
  },
];
