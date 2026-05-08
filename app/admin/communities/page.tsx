import Link from "next/link";
import { adminListCommunities } from "@/lib/admin-fetch";
import { deleteCommunityAction } from "@/app/admin/_actions/communities";
import DeleteForm from "@/components/admin/DeleteForm";
import type { Community } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_TAG: Record<string, string> = {
  published: "green",
  draft: "mustard",
  archived: "",
};

export default async function AdminCommunitiesPage() {
  let communities: Community[] = [];
  let error: string | null = null;
  try {
    communities = await adminListCommunities();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Communities</h1>
        <Link href="/admin/communities/new" className="btn">
          + new community
        </Link>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      {communities.length === 0 && !error ? (
        <p className="muted">No communities yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>name</th>
              <th style={{ width: "110px" }}>price</th>
              <th style={{ width: "130px" }}>status</th>
              <th style={{ width: "90px" }}>sort</th>
              <th style={{ width: "180px" }}></th>
            </tr>
          </thead>
          <tbody>
            {communities.map((c) => {
              const del = deleteCommunityAction.bind(null, c.slug);
              return (
                <tr key={c.slug}>
                  <td>
                    <div className="row-title">
                      {c.featured ? <span title="Featured" style={{ marginRight: 6 }}>★</span> : null}
                      {c.name}
                    </div>
                    <div className="row-meta">/{c.slug} · {c.subtitle}</div>
                  </td>
                  <td className="mono">{c.currency}{c.price}</td>
                  <td><span className={`tag ${STATUS_TAG[c.status]}`}>{c.status}</span></td>
                  <td className="mono muted">{c.sort_order}</td>
                  <td className="actions">
                    <Link className="link-action" href={`/community/${c.slug}`} target="_blank" rel="noopener">
                      view
                    </Link>
                    <Link className="link-action" href={`/admin/communities/${c.slug}/edit`}>
                      edit
                    </Link>
                    <span style={{ marginLeft: "var(--sp-3)" }}>
                      <DeleteForm action={del} confirm={`Delete "${c.name}"?`} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
