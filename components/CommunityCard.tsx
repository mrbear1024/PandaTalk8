import Link from "next/link";
import type { Community } from "@/lib/types";

export default function CommunityCard({ community }: { community: Community }) {
  return (
    <Link href={`/community/${community.slug}`} className={`offer-card${community.featured ? " featured" : ""}`}>
      <div className="offer-card-top">
        <span className="tag">{community.featured ? "Flagship" : community.status}</span>
        <span className="offer-price">{community.currency}{community.price}</span>
      </div>
      {community.cover ? (
        <div className="offer-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={community.cover} alt="" />
        </div>
      ) : null}
      <h3>{community.name}</h3>
      <p>{community.subtitle}</p>
      <div className="offer-meta">
        <span>{community.audience}</span>
      </div>
      <span className="offer-action">{community.cta_label} →</span>
    </Link>
  );
}
