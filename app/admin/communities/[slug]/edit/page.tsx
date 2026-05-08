import { notFound } from "next/navigation";
import CommunityForm from "@/components/admin/CommunityForm";
import { adminGetCommunity } from "@/lib/admin-fetch";
import { updateCommunityAction } from "@/app/admin/_actions/communities";

type Params = { slug: string };

export default async function EditCommunityPage({ params }: { params: Params }) {
  const community = await adminGetCommunity(decodeURIComponent(params.slug));
  if (!community) notFound();
  const action = updateCommunityAction.bind(null, community.slug);

  return (
    <>
      <div className="admin-toolbar">
        <h1>Edit community</h1>
      </div>
      <CommunityForm initial={community} action={action} submitLabel="Save changes" />
    </>
  );
}
