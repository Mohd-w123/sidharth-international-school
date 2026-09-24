/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";
import { publishAdmission, deleteAdmission } from "@/actions/admission.actions";
import { toast } from "sonner";
import type { PaginatedResult } from "@/lib/cms";

interface Props { data: PaginatedResult<any>; }

export function AdmissionsTable({ data }: Props) {
  const [isPending, startTransition] = useTransition();
  const handleAction = (action: () => Promise<{ error?: string; success?: string }>) => {
    startTransition(async () => { const r = await action(); if (r.error) toast.error(r.error); else toast.success(r.success); });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search admissions..." />
      <DataTableContainer>
        {data.data.length === 0 ? <EmptyState title="No admission content" description="Create your first admission page." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Session</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>
              {data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.session}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category || "—"}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/admin/admissions/${item._id}`}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        {item.status !== "published" && <DropdownMenuItem onClick={() => handleAction(() => publishAdmission(item._id))} disabled={isPending}><Send className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>}
                        <DropdownMenuItem variant="destructive" onClick={() => handleAction(() => deleteAdmission(item._id))} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
