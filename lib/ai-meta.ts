import "server-only";
import OpenAI, { APIError } from "openai";
import { slugify } from "./post-derive";

const TAGS = ["essay", "dev", "growth", "thought", "uses", "note"] as const;
export type Tag = (typeof TAGS)[number];

export type AiMetaResult = {
  slug: string;
  tag: Tag;
  source: "ai" | "fallback";
  error?: string;
};

const SYSTEM_PROMPT = `You generate metadata for a personal bilingual (中/英) blog by an indie AI builder.

For each post, choose:

- A short English slug in ASCII kebab-case.
  - Use 2 to 5 English words that capture the topic.
  - Translate Chinese titles into concise English keywords.
  - Allowed characters: lowercase English letters and ASCII hyphens only.
  - No Chinese characters, digits, spaces, underscores, punctuation, or leading/trailing hyphens.
  - Example: title "AI 如何改变人的劳动？" → slug "ai-labor-change".
  - Example: title "Git 入门教程" → slug "git-beginner-guide".
  - Example: title "Claude Code Workflow" → slug "claude-code-workflow".

- One tag from this fixed taxonomy:
  - "essay" — first-person reflective writing, life/career narrative
  - "dev" — coding, tools, AI development workflows, technical
  - "growth" — audience growth, content strategy, marketing
  - "thought" — short-form opinion, philosophy, observation
  - "uses" — tool/setup posts (what I use to do X)
  - "note" — anything else / general

Always respond by calling the set_metadata tool. Never write prose.`;

// DeepSeek is OpenAI API-compatible. Override the base URL.
//   https://api.deepseek.com/v1
// Models: "deepseek-chat" (V3, fast/cheap), "deepseek-reasoner" (R1, slower).
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

const CLIENT: OpenAI | null = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: DEEPSEEK_BASE_URL })
  : null;

export async function generateSlugAndTag(
  title: string,
  bodyText: string
): Promise<AiMetaResult> {
  if (!CLIENT) {
    console.info("[ai-meta] no DEEPSEEK_API_KEY set — using fallback slug/tag");
    return {
      slug: slugify(title),
      tag: "note",
      source: "fallback",
      error: "DEEPSEEK_API_KEY not set",
    };
  }

  const sample = bodyText.slice(0, 1500);
  const userInput = `Title: ${title}\n\nBody (excerpt):\n${sample || "(empty)"}`;
  const startedAt = Date.now();

  try {
    const res = await CLIENT.chat.completions.create({
      model: DEEPSEEK_MODEL,
      max_tokens: 200,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "set_metadata",
            description: "Set the slug and tag for the blog post.",
            parameters: {
              type: "object",
              properties: {
                slug: {
                  type: "string",
                  description:
                    "English ASCII kebab-case slug, 2-5 lowercase words. Only a-z and hyphens are allowed. No Chinese characters, digits, spaces, underscores, or punctuation.",
                },
                tag: { type: "string", enum: [...TAGS] },
              },
              required: ["slug", "tag"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "set_metadata" } },
    });

    const elapsed = Date.now() - startedAt;
    const call = res.choices[0]?.message.tool_calls?.[0];
    if (!call || call.type !== "function") {
      console.warn(
        `[ai-meta] DeepSeek returned no tool_call (${elapsed}ms, model=${DEEPSEEK_MODEL}); ` +
          `finish_reason=${res.choices[0]?.finish_reason}; ` +
          `content=${JSON.stringify(res.choices[0]?.message.content)}`
      );
      return {
        slug: slugify(title),
        tag: "note",
        source: "fallback",
        error: "DeepSeek did not return a tool_call",
      };
    }

    const args = safeParseJson(call.function.arguments) as
      | { slug?: unknown; tag?: unknown }
      | null;
    if (!args) {
      console.warn(
        `[ai-meta] DeepSeek tool_call arguments could not be parsed as JSON: ` +
          `${call.function.arguments?.slice(0, 200)}`
      );
      return {
        slug: slugify(title),
        tag: "note",
        source: "fallback",
        error: "DeepSeek tool_call arguments invalid JSON",
      };
    }

    const slug =
      typeof args.slug === "string" && args.slug.length > 0
        ? slugify(args.slug)
        : slugify(title);
    const tag = (TAGS as readonly string[]).includes(args.tag as string)
      ? (args.tag as Tag)
      : "note";
    console.info(
      `[ai-meta] DeepSeek ok in ${elapsed}ms — slug=${slug} tag=${tag} model=${DEEPSEEK_MODEL}`
    );
    return { slug, tag, source: "ai" };
  } catch (e) {
    const elapsed = Date.now() - startedAt;
    const detail = describeError(e);
    console.error(
      `[ai-meta] DeepSeek call FAILED after ${elapsed}ms — ${detail}\n` +
        `  base_url=${DEEPSEEK_BASE_URL} model=${DEEPSEEK_MODEL}`
    );
    return {
      slug: slugify(title),
      tag: "note",
      source: "fallback",
      error: detail,
    };
  }
}

function describeError(e: unknown): string {
  if (e instanceof APIError) {
    // OpenAI SDK error — has status, code, type, message, and the raw response.
    const parts = [
      `APIError`,
      `status=${e.status}`,
      e.code ? `code=${e.code}` : null,
      e.type ? `type=${e.type}` : null,
      e.message ? `message=${e.message}` : null,
    ].filter(Boolean);
    return parts.join(" ");
  }
  if (e instanceof Error) {
    return `${e.name}: ${e.message}`;
  }
  return `unknown error: ${String(e)}`;
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
