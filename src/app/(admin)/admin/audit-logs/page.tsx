import { requirePermission } from "@/lib/auth/session";
import { getAuditLogs, getAuditLogFilters } from "@/actions/audit-log.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AuditLogTable } from "@/features/audit-logs/components/audit-log-table";

export const metadata = { title: "Audit Logs | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminAuditLogsPage({ searchParams }: Props) {
  await requirePermission("audit.view");
  const params = await searchParams;
  const [logs, filters] = await Promise.all([
    getAuditLogs(params),
    getAuditLogFilters(),
  ]);

  return (
    <AdminPageLayout>
      <PageHeader title="Audit Logs" description="Track all administrative actions and changes" />
      <AuditLogTable data={JSON.parse(JSON.stringify(logs))} filters={filters} />
    </AdminPageLayout>
  );
}
