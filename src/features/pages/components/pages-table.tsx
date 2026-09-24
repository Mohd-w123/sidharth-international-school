"use client";

import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Send, Archive, Trash2, Copy } from "lucide-react";
import { publishPage, unpublishPage, deletePage, duplicatePage } from "@/actions/page.actions";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { PaginatedResult } from "@/lib/cms";

interface PagesTableProps {
  data: PaginatedResult<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
  }>;
}

export function PagesTable({ data }: PagesTableProps) {
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
      <SearchFilterBar searchPlaceholder="Search pages..." />

      <DataTableContainer>
        {data.data.length === 0 ? (
          <EmptyState title="No pages found" description="Create your first page to get started." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((page) => (
                <TableRow key={page._id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell><StatusBadge status={page.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(page.createdAt, { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => window.location.href = `/admin/pages/${page._id}`}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Page"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(() => duplicatePage(page._id))}
                        disabled={isPending}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        title="Duplicate Page"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                            handleAction(() => deletePage(page._id));
                          }
                        }}
                        disabled={isPending}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        title="Delete Page"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/admin/pages/${page._id}`}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(() => duplicatePage(page._id))} disabled={isPending}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate Page
                          </DropdownMenuItem>
                          {page.status !== "published" && (
                            <DropdownMenuItem onClick={() => handleAction(() => publishPage(page._id))} disabled={isPending}>
                              <Send className="h-4 w-4 mr-2" /> Publish Page
                            </DropdownMenuItem>
                          )}
                          {page.status === "published" && (
                            <DropdownMenuItem onClick={() => handleAction(() => unpublishPage(page._id))} disabled={isPending}>
                              <Archive className="h-4 w-4 mr-2" /> Unpublish Page
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                                handleAction(() => deletePage(page._id));
                              }
                            }}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
