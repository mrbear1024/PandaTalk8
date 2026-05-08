import CommunityForm from "@/components/admin/CommunityForm";
import { createCommunityAction } from "@/app/admin/_actions/communities";

export default function NewCommunityPage() {
  return (
    <>
      <div className="admin-toolbar">
        <h1>New community</h1>
      </div>
      <CommunityForm action={createCommunityAction} submitLabel="Create community →" />
    </>
  );
}
