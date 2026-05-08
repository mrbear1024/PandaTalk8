import Link from "next/link";
import { notFound } from "next/navigation";
import ASCIIDivider from "@/components/ASCIIDivider";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { highlightCodeBlocks } from "@/lib/highlight";
import type { Metadata } from "next";

type Params = { slug: string };

// Posts are written by the admin UI AND by a standalone CLI that can't
// trigger revalidatePath. Render dynamically so any write is reflected on
// the next request. generateStaticParams is kept for production warm-up.
export const dynamic = "force-dynamic";

// Slugs may include non-ASCII characters (Chinese). Browsers send them
// percent-encoded, but our DB stores the decoded form, so decode before
// querying. Wrap in try/catch to tolerate malformed sequences.
function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getPost(decodeSlug(params.slug));
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} · PandaTalk`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const post = await getPost(decodeSlug(params.slug));
  if (!post) notFound();

  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <Link href="/blog" className="back-link">
          all posts
        </Link>
        {post.cover ? (
          <div className="article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" />
          </div>
        ) : null}
        <header>
          <div className="eyebrow">
            {post.tag} · {post.lang}
          </div>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.read_time} read</span>
            <span>·</span>
            <span>by PandaTalk</span>
          </div>
        </header>
        <div className="prose">
          {typeof post.body === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: highlightCodeBlocks(post.body) }} />
          ) : (
            (post.body ?? []).map((b, i) => {
              if (b.type === "h1") return <h1 key={i}>{b.text}</h1>;
              if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
              if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
              if (b.type === "h4") return <h4 key={i}>{b.text}</h4>;
              if (b.type === "h5") return <h5 key={i}>{b.text}</h5>;
              if (b.type === "h6") return <h6 key={i}>{b.text}</h6>;
              return <p key={i}>{b.text}</p>;
            })
          )}
          <ASCIIDivider>━━━ fin ━━━</ASCIIDivider>
          <p className="mono muted" style={{ fontSize: "0.85rem", textAlign: "center" }}>
            If you read this far — thank you.
            <br />
            Come tell me what you thought on{" "}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              X
            </a>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
