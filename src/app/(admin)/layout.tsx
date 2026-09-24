import { requireAuth } from "@/lib/auth/session";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const { name, email, image, role, permissions } = session.user;

  return (
    <AdminShell
      user={{ name, email, image, role }}
      permissions={permissions ?? []}
    >
      {children}
    </AdminShell>
  );
}
