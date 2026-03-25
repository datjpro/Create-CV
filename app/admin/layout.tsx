import { AdminRouteShell } from "@/components/admin/admin-route-shell";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteShell>
      <AdminShell>{children}</AdminShell>
    </AdminRouteShell>
  );
}
