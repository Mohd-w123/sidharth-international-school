"use server";

import { requirePermission } from "@/lib/auth/session";
import { auditLogService } from "@/services/audit-log.service";
import { parseSearchParams } from "@/lib/cms";

export async function getAuditLogs(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("audit.view");
  const parsed = parseSearchParams(searchParams);
  return auditLogService.findPaginated({
    page: parsed.pagination.page,
    limit: parsed.pagination.limit || 25,
    search: parsed.search,
    action: typeof searchParams.action === "string" ? searchParams.action : undefined,
    resource: typeof searchParams.resource === "string" ? searchParams.resource : undefined,
  });
}

export async function getAuditLogFilters() {
  await requirePermission("audit.view");
  const [actions, resources] = await Promise.all([
    auditLogService.getDistinctActions(),
    auditLogService.getDistinctResources(),
  ]);
  return { actions, resources };
}
