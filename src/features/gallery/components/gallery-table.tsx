"use client";

import { useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Pencil,
  Send,
  Archive,
  Trash2,
  Images,
  Video,
} from "lucide-react";
import {
  publishAlbum,
  unpublishAlbum,
  deleteAlbum,
} from "@/actions/gallery.actions";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { PaginatedResult } from "@/lib/cms";

interface GalleryTableProps {
  data: PaginatedResult<{
    _id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    coverImage?: string;
    order: number;
    createdAt: string;
  }>;
}

export function GalleryTable({ data }: GalleryTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (
    action: () => Promise<{ error?: string; success?: string }>
  ) => {
    startTransition(async () => {
      const result = await action();
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar searchPlaceholder="Search albums..." />

      <DataTableContainer>
        {data.data.length === 0 ? (
          <EmptyState
            title="No gallery albums"
            description="Create your first album to showcase photos and videos."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Album</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt=""
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                          <Images className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs gap-1">
                      {item.type === "video" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <Images className="h-3 w-3" />
                      )}
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(item.createdAt, { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = `/admin/gallery/${item._id}`)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {item.status !== "published" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(() => publishAlbum(item._id))
                            }
                            disabled={isPending}
                          >
                            <Send className="h-4 w-4 mr-2" /> Publish
                          </DropdownMenuItem>
                        )}
                        {item.status === "published" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(() => unpublishAlbum(item._id))
                            }
                            disabled={isPending}
                          >
                            <Archive className="h-4 w-4 mr-2" /> Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            handleAction(() => deleteAlbum(item._id))
                          }
                          disabled={isPending}
                        >
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

      <PaginationControls
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
      />
    </div>
  );
}
