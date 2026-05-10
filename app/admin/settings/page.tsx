import SettingsForm from "@/components/admin/SettingsForm";
import { updateSiteSettingsAction } from "@/app/admin/_actions/settings";
import { adminGetSiteSettings } from "@/lib/admin-fetch";

export const dynamic = "force-dynamic";

type SearchParams = { saved?: string };

export default async function AdminSettingsPage({ searchParams }: { searchParams?: SearchParams }) {
  let settings = null;
  let error: string | null = null;

  try {
    settings = await adminGetSiteSettings();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Settings</h1>
      </div>
      {searchParams?.saved ? <div className="notice">Settings saved.</div> : null}
      {error ? <div className="alert">{error}</div> : null}
      {settings ? <SettingsForm settings={settings} action={updateSiteSettingsAction} /> : null}
    </>
  );
}
