/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import type { PaginatedResult } from "@/lib/cms";

interface Props {
  data: PaginatedResult<any>;
  formFields: any[];
}

export function SubmissionsTable({ data, formFields }: Props) {
  const displayFields = formFields.slice(0, 4);

  return (
    <div className="space-y-4">
      <DataTableContainer>
        {data.data.length === 0 ? <EmptyState title="No submissions yet" description="Submissions from public visitors will appear here." /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted At</TableHead>
                {displayFields.map((f: any) => (
                  <TableHead key={f.name}>{f.label}</TableHead>
                ))}
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString()}
                  </TableCell>
                  {displayFields.map((f: any) => (
                    <TableCell key={f.name} className="max-w-[200px] truncate text-sm">
                      {String(item.data?.[f.name] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {item.ipAddress || "—"}
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
