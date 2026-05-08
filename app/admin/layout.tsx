import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { isLoggedIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin · PandaTalk8",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isLoggedIn();
  return (
    <div className="admin-shell">
      {authed ? <AdminNav /> : null}
      <main className="admin-body container">{children}</main>
    </div>
  );
}
