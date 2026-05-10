import Link from "next/link";
import { notFound } from "next/navigation";
import WechatPromo from "@/components/WechatPromo";
import { getAllCommunities, getCommunity } from "@/lib/communities";
import { getSiteSettings } from "@/lib/site-settings";
import type { Metadata } from "next";

type Params = { slug: string };

export const dynamic = "force-dynamic";

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const communities = await getAllCommunities();
  return communities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const community = await getCommunity(decodeSlug(params.slug));
  if (!community) return { title: "Not found" };
  return {
    title: `${community.name} · PandaTalk8`,
    description: community.subtitle,
  };
}

export default async function CommunityDetailPage({ params }: { params: Params }) {
  const community = await getCommunity(decodeSlug(params.slug));
  if (!community) notFound();
  const { site } = await getSiteSettings();

  return (
    <div className="route-enter container-narrow">
      <article className="article">
        <Link href="/community" className="back-link">
          all communities
        </Link>
        {community.cover ? (
          <div className="article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={community.cover} alt="" />
          </div>
        ) : null}
        <header>
          <div className="eyebrow">{community.featured ? "Flagship" : "Community"}</div>
          <h1>{community.name}</h1>
          <p style={{ fontSize: "var(--step-1)", color: "var(--ink-2)", lineHeight: 1.55 }}>
            {community.subtitle}
          </p>
          <div className="meta">
            <span>{community.currency}{community.price}</span>
            <span>·</span>
            <span>{community.status}</span>
          </div>
        </header>
        <div className="prose">
          <h2>适合人群</h2>
          <p>{community.audience}</p>
          <h2>你会获得</h2>
          <ul>
            {community.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2>包含内容</h2>
          <ul>
            {community.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2>加入方式</h2>
          <p>{community.join_instructions}</p>
          {community.cover ? (
            <div className="community-qr-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={community.cover} alt={`${community.name} 二维码`} />
            </div>
          ) : null}
          <div className="join-box" id="join">
            <div>
              <strong>{community.cta_label}</strong>
              <p>微信搜索公众号：{site.wechatName}，按页面说明发送关键词。</p>
            </div>
          </div>
          <WechatPromo compact />
          {community.faq.length > 0 ? (
            <>
              <h2>FAQ</h2>
              {community.faq.map((item) => (
                <div key={item.q} className="faq-item">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </article>
    </div>
  );
}
