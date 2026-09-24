import { requirePermission } from "@/lib/auth/session";
import { getFaculty } from "@/actions/faculty.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FacultyTable } from "@/features/faculty/components/faculty-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Faculty | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminFacultyPage({ searchParams }: Props) {
  await requirePermission("faculty.view");
  const params = await searchParams;
  const result = await getFaculty(params);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Faculty"
        description="Manage teaching staff profiles"
        actions={
          <Link href="/admin/faculty/create" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" /> Add Faculty
          </Link>
        }
      />
      <FacultyTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
