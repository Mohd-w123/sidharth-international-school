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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Send, Trash2, Inbox, ExternalLink } from "lucide-react";
import { publishForm, deleteForm } from "@/actions/form.actions";
import { toast } from "sonner";
import type { PaginatedResult } from "@/lib/cms";

interface Props { data: PaginatedResult<any>; }

export function FormsTable({ data }: Props) {
  const [isPending, startTransition] = useTransition();
  const handleAction = (action: () => Promise<{ error?: string; success?: string }>) => {
    startTransition(async () => { const r = await action(); if (r.error) toast.error(r.error); else toast.success(r.success); });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search forms..." />
      <DataTableContainer>
        {data.data.length === 0 ? <EmptyState title="No dynamic forms" description="Build your first custom inquiry or admission form." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Fields</TableHead><TableHead>Submissions</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>
              {data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">/{item.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.fields?.length || 0} fields</Badge></TableCell>
                  <TableCell>
                    <button
                      onClick={() => window.location.href = `/admin/forms/${item._id}/submissions`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b5699] hover:underline"
                    >
                      <Inbox className="h-3.5 w-3.5" /> {item.submissionCount || 0} entries
                    </button>
                  </TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/admin/forms/${item._id}`}><Pencil className="h-4 w-4 mr-2" /> Edit Form</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = `/admin/forms/${item._id}/submissions`}><Inbox className="h-4 w-4 mr-2" /> Submissions</DropdownMenuItem>
                        {item.status === "published" && <DropdownMenuItem onClick={() => window.open(`/forms/${item.slug}`, "_blank")}><ExternalLink className="h-4 w-4 mr-2" /> View Public Page</DropdownMenuItem>}
                        {item.status !== "published" && <DropdownMenuItem onClick={() => handleAction(() => publishForm(item._id))} disabled={isPending}><Send className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>}
                        <DropdownMenuItem variant="destructive" onClick={() => handleAction(() => deleteForm(item._id))} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
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
