/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, FileText } from "lucide-react";
import { deleteTC } from "@/actions/tc.actions";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { PaginatedResult } from "@/lib/cms";

interface Props { data: PaginatedResult<any>; }

export function TCTable({ data }: Props) {
  const [isPending, startTransition] = useTransition();
  const handleDelete = (id: string) => {
    startTransition(async () => { const r = await deleteTC(id); if (r.error) toast.error(r.error); else toast.success(r.success); });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search TC by student name, admission no, or TC no..." />
      <DataTableContainer>
        {data.data.length === 0 ? <EmptyState title="No transfer certificates" description="Issue your first student transfer certificate." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>TC No</TableHead><TableHead>Student Name</TableHead><TableHead>Adm No</TableHead><TableHead>Class</TableHead><TableHead>Issue Date</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>
              {data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="font-mono text-sm font-semibold">{item.tcNumber}</TableCell>
                  <TableCell className="font-medium">{item.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.admissionNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{item.class}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(item.issueDate, { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "active" ? "default" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/admin/tc/${item._id}`}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        {item.documentUrl && <DropdownMenuItem onClick={() => window.open(item.documentUrl, "_blank")}><FileText className="h-4 w-4 mr-2" /> View PDF</DropdownMenuItem>}
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item._id)} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
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
