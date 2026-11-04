import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAdmin } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import "./admin.css";

export const metadata: Metadata = {
  title: "SAmobile Admin",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/icon.svg" },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) {
    return <html lang="vi"><body className="admin-body"><main className="admin-denied">
      <h1>Không có quyền truy cập</h1>
      <p>Trang này chỉ dành cho quản trị viên của SAmobile. Hãy đăng nhập bằng tài khoản được cấp quyền.</p>
    </main></body></html>;
  }
  return <html lang="vi"><body className="admin-body">
    <a className="skip-link" href="#admin-main">Bỏ qua điều hướng</a>
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand" translate="no"><span>SA</span>mobile <em>Admin</em></div>
        <AdminNav />
        <div className="admin-user"><span>Đăng nhập với</span><strong>{admin.email}</strong></div>
      </aside>
      <main id="admin-main" className="admin-main" tabIndex={-1}>{children}</main>
    </div>
  </body></html>;
}
