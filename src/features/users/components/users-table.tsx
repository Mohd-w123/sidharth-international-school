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
import { Badge } from "@/components/ui/badge";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { DataTableContainer } from "@/features/admin/components/data-table-container";
import { EmptyState } from "@/components/shared/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, User, Power } from "lucide-react";
import { deleteUser, toggleUserActive } from "@/actions/user.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useState } from "react";
import type { PaginatedResult } from "@/lib/cms";

export interface UserRow {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: { _id: string; name: string; slug: string } | string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface UsersTableProps {
  data: PaginatedResult<UserRow>;
  onEdit: (user: UserRow) => void;
}

export function UsersTable({ data, onEdit }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteUser(deleteId);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
      setDeleteId(null);
    });
  };

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await toggleUserActive(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const getRoleName = (role: UserRow["role"]) => {
    if (typeof role === "object" && role !== null) return role.name;
    return String(role);
  };

  const getRoleSlug = (role: UserRow["role"]) => {
    if (typeof role === "object" && role !== null) return role.slug;
    return "";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchPlaceholder="Search users..."
        statusOptions={[]}
      />
      <DataTableContainer>
        {data.data.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Add your first admin user to get started."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        getRoleSlug(item.role) === "super-admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          : ""
                      }
                    >
                      {getRoleName(item.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.isActive ? "default" : "destructive"}
                      className={
                        item.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(item.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(item._id)}
                          disabled={isPending}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          {item.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteId(item._id)}
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
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete User"
        description="This action cannot be undone. The user will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={isPending}
      />
    </div>
  );
}
