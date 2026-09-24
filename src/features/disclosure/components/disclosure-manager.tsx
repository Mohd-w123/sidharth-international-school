/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Plus, Send, ChevronRight } from "lucide-react";
import { createDisclosureCategory, updateDisclosureCategory, publishDisclosureCategory, deleteDisclosureCategory } from "@/actions/disclosure.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import type { PaginatedResult } from "@/lib/cms";

interface Props { data: PaginatedResult<any>; }

export function DisclosureManager({ data }: Props) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");

  const resetForm = () => { setName(""); setSlug(""); setDescription(""); setStatus("draft"); setEditItem(null); };
  const openEdit = (item: any) => { setEditItem(item); setName(item.name); setSlug(item.slug); setDescription(item.description || ""); setStatus(item.status); setDialogOpen(true); };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = { name, slug: slug || generateSlug(name), description, status };
      const result = editItem ? await updateDisclosureCategory({ id: editItem._id, ...payload }) : await createDisclosureCategory(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); setDialogOpen(false); resetForm(); }
    });
  };

  const handleAction = (action: () => Promise<{ error?: string; success?: string }>) => {
    startTransition(async () => { const r = await action(); if (r.error) toast.error(r.error); else toast.success(r.success); });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Category</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!editItem) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. General Information" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full">{isPending ? "Saving..." : editItem ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {data.data.length === 0 ? <EmptyState title="No disclosure categories" description="Create categories like General Information, Documents, etc." /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
              <TableBody>
                {data.data.map((item: any) => (
                  <TableRow key={item._id} className="cursor-pointer hover:bg-muted/50" onClick={() => window.location.href = `/admin/disclosure/${item._id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(item)}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          {item.status !== "published" && <DropdownMenuItem onClick={() => handleAction(() => publishDisclosureCategory(item._id))} disabled={isPending}><Send className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>}
                          <DropdownMenuItem variant="destructive" onClick={() => handleAction(() => deleteDisclosureCategory(item._id))} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
