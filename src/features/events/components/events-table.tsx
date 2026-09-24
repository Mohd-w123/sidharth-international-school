"use client";

import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Send, Archive, Trash2 } from "lucide-react";
import { publishEvent, unpublishEvent, deleteEvent } from "@/actions/event.actions";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { PaginatedResult } from "@/lib/cms";

interface EventsTableProps {
  data: PaginatedResult<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    eventDate: string;
    location?: string;
    createdAt: string;
  }>;
}

export function EventsTable({ data }: EventsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<{ error?: string; success?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search events..." />

      <DataTableContainer>
        {data.data.length === 0 ? (
          <EmptyState title="No events" description="Create your first event." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(item.eventDate, { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.location || "—"}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/admin/events/${item._id}`}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {item.status !== "published" && (
                          <DropdownMenuItem onClick={() => handleAction(() => publishEvent(item._id))} disabled={isPending}>
                            <Send className="h-4 w-4 mr-2" /> Publish
                          </DropdownMenuItem>
                        )}
                        {item.status === "published" && (
                          <DropdownMenuItem onClick={() => handleAction(() => unpublishEvent(item._id))} disabled={isPending}>
                            <Archive className="h-4 w-4 mr-2" /> Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem variant="destructive" onClick={() => handleAction(() => deleteEvent(item._id))} disabled={isPending}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
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
