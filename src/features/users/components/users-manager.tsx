"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable, type UserRow } from "./users-table";
import { UserDialog } from "./user-dialog";
import type { PaginatedResult } from "@/lib/cms";

interface RoleOption {
  _id: string;
  name: string;
  slug: string;
}

interface UsersManagerProps {
  data: PaginatedResult<UserRow>;
  roles: RoleOption[];
}

export function UsersManager({ data, roles }: UsersManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const handleEdit = (user: UserRow) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>
      <UsersTable data={data} onEdit={handleEdit} />
      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
        roles={roles}
      />
    </>
  );
}
