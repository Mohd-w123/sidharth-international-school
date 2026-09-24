import { requirePermission } from "@/lib/auth/session";
import { getUsers, getRoles } from "@/actions/user.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { UsersManager } from "@/features/users/components/users-manager";

export const metadata = { title: "Users | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  await requirePermission("users.view");
  const params = await searchParams;
  const [result, roles] = await Promise.all([getUsers(params), getRoles()]);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Users"
        description="Manage admin users and their roles"
      />
      <UsersManager
        data={JSON.parse(JSON.stringify(result))}
        roles={roles}
      />
    </AdminPageLayout>
  );
}
