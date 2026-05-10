import CommunityCard from "@/components/CommunityCard";
import { getAllCommunities } from "@/lib/communities";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Community · PandaTalk8",
  description: "Paid communities for AI learning, X growth, and building in public with Mr Panda.",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const communities = await getAllCommunities();
  const { site } = await getSiteSettings();

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 03 — community</div>
          <h1>
            Paid
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              Communities
            </span>
          </h1>
        </div>
        <div className="side">
          Communities for AI builders, indie founders, and people growing on X. 公众号：{site.wechatName}.
        </div>
      </section>

      {communities.length > 0 ? (
        <div className="offer-grid">
          {communities.map((community) => (
            <CommunityCard key={community.slug} community={community} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-glyph" aria-hidden="true">¥</div>
          <h2 className="empty-title">Communities coming soon</h2>
          <p className="empty-copy">微信搜索公众号：{site.wechatName}</p>
        </div>
      )}
    </div>
  );
}
