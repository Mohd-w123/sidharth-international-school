"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteMenu } from "@/actions/menu.actions";
import { Pencil, Trash2, Menu } from "lucide-react";
import { toast } from "sonner";

interface MenuData {
  _id: string;
  name: string;
  slug: string;
  location: string;
  isActive: boolean;
  items: unknown[];
}

interface MenusListProps {
  menus: MenuData[];
}

export function MenusList({ menus }: MenusListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteMenu(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  if (menus.length === 0) {
    return <EmptyState title="No menus" description="Create your first menu to configure site navigation." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {menus.map((menu) => (
        <Card key={menu._id}>
          <CardHeader className="flex flex-row items-center gap-2">
            <Menu className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base flex-1">{menu.name}</CardTitle>
            <Badge variant="outline">{menu.location}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {menu.items.length} item{menu.items.length !== 1 ? "s" : ""}
              {!menu.isActive && " · Inactive"}
            </p>
            <div className="flex gap-2">
              <Link href={`/admin/menus/${menu._id}`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Link>
              <Button size="sm" variant="outline" onClick={() => handleDelete(menu._id)} disabled={isPending}>
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
