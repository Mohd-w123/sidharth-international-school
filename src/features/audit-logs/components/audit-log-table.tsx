/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Shield, User, FileText, Calendar } from "lucide-react";

interface AuditLogEntry {
  _id: string;
  user?: { _id: string; name?: string; email?: string };
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

interface Props {
  data: { data: AuditLogEntry[]; page: number; totalPages: number; total: number };
  filters: { actions: string[]; resources: string[] };
}

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700 border-green-200",
  update: "bg-blue-100 text-blue-700 border-blue-200",
  delete: "bg-red-100 text-red-700 border-red-200",
  publish: "bg-purple-100 text-purple-700 border-purple-200",
  login: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

function getActionColor(action: string) {
  for (const [key, className] of Object.entries(actionColors)) {
    if (action.toLowerCase().includes(key)) return className;
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export function AuditLogTable({ data, filters }: Props) {
  const statusOptions = [
    { value: "all", label: "All Status" },
    ...filters.actions.map((a: string) => ({ value: a, label: a })),
  ];

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search logs..." statusOptions={statusOptions} />

      <DataTableContainer>
        {data.data.length === 0 ? (
          <EmptyState title="No audit logs" description="Activity logs will appear here as actions are performed." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(log.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{(log.user as any)?.name || "System"}</p>
                        <p className="text-xs text-muted-foreground truncate">{(log.user as any)?.email || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{log.resource}</span>
                      {log.resourceId && <code className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{log.resourceId.slice(-6)}</code>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.details ? JSON.stringify(log.details).slice(0, 80) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTableContainer>

      <PaginationControls page={data.page} totalPages={data.totalPages} total={data.total} />
    </div>
  );
}
