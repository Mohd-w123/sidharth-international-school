/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createMenu, updateMenu } from "@/actions/menu.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";

interface MenuItem {
  label: string;
  url: string;
  target: "_self" | "_blank";
  isEnabled: boolean;
  order: number;
  children: MenuItem[];
}

interface Props { initialData?: any; }

export function MenuBuilder({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [location, setLocation] = useState<string>(initialData?.location ?? "header");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [items, setItems] = useState<MenuItem[]>(
    initialData?.items?.map((i: any, idx: number) => ({
      label: i?.label ?? "",
      url: i?.url ?? "",
      target: (i?.target === "_blank" ? "_blank" : "_self") as "_self" | "_blank",
      isEnabled: i?.isEnabled ?? true,
      order: i?.order ?? idx,
      children: i?.children?.map((c: any, ci: number) => ({
        label: c?.label ?? "",
        url: c?.url ?? "",
        target: (c?.target === "_blank" ? "_blank" : "_self") as "_self" | "_blank",
        isEnabled: c?.isEnabled ?? true,
        order: c?.order ?? ci,
        children: [],
      })) ?? [],
    })) ?? []
  );

  const addItem = () => {
    setItems((prev) => [...prev, { label: "", url: "", target: "_self", isEnabled: true, order: prev.length, children: [] }]);
  };

  const addChild = (parentIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      const parent = next[parentIndex];
      if (!parent) return prev;
      next[parentIndex] = {
        ...parent,
        children: [
          ...parent.children,
          { label: "", url: "", target: "_self", isEnabled: true, order: parent.children.length, children: [] },
        ],
      };
      return next;
    });
  };

  const updateItem = (index: number, field: keyof MenuItem, value: string | boolean) => {
    setItems((prev) => {
      const n = [...prev];
      const item = n[index];
      if (!item) return prev;
      n[index] = { ...item, [field]: value };
      return n;
    });
  };

  const updateChild = (pi: number, ci: number, field: keyof MenuItem, value: string | boolean) => {
    setItems((prev) => {
      const n = [...prev];
      const parent = n[pi];
      if (!parent) return prev;
      const children = [...parent.children];
      const child = children[ci];
      if (!child) return prev;
      children[ci] = { ...child, [field]: value };
      n[pi] = { ...parent, children };
      return n;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removeChild = (pi: number, ci: number) => {
    setItems((prev) => {
      const n = [...prev];
      const parent = n[pi];
      if (!parent) return prev;
      n[pi] = { ...parent, children: parent.children.filter((_, i) => i !== ci) };
      return n;
    });
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    setItems((prev) => {
      const n = [...prev];
      const itemA = n[index];
      const itemB = n[targetIdx];
      if (!itemA || !itemB) return prev;
      n[index] = itemB;
      n[targetIdx] = itemA;
      return n.map((it, i) => ({ ...it, order: i }));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name, slug: slug || generateSlug(name), location, isActive,
        items: items.map((it, i) => ({ ...it, order: i, children: it.children.map((c, ci) => ({ ...c, order: ci })) })),
      };
      const result = initialData?._id ? await updateMenu({ id: initialData._id, ...payload }) : await createMenu(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/menus"); }
    });
  };

  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const toggleExpand = (idx: number) => {
    setExpandedItems((prev) => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Menu Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No items yet. Click &quot;Add Item&quot; to start building your menu.</p>
            )}
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-t-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                  <button type="button" onClick={() => toggleExpand(index)} className="p-0.5">
                    {expandedItems.has(index) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <Input value={item.label} onChange={(e) => updateItem(index, "label", e.target.value)} placeholder="Label" className="flex-1 h-8" />
                  <Input value={item.url} onChange={(e) => updateItem(index, "url", e.target.value)} placeholder="/path" className="flex-1 h-8" />
                  <Switch checked={item.isEnabled} onCheckedChange={(v) => updateItem(index, "isEnabled", v)} />
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => moveItem(index, "up")} disabled={index === 0} className="h-7 w-7 p-0">↑</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => moveItem(index, "down")} disabled={index === items.length - 1} className="h-7 w-7 p-0">↓</Button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                {expandedItems.has(index) && (
                  <div className="p-3 space-y-2 border-t">
                    <div className="flex items-center gap-3">
                      <div className="space-y-1"><Label className="text-xs">Target</Label>
                        <Select value={item.target} onValueChange={(v) => updateItem(index, "target", v || "_self")}>
                          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="_self">Same Tab</SelectItem><SelectItem value="_blank">New Tab</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="ml-6 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Sub-items:</p>
                      {item.children.map((child, ci) => (
                        <div key={ci} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                          <span className="text-xs text-muted-foreground">↳</span>
                          <Input value={child.label} onChange={(e) => updateChild(index, ci, "label", e.target.value)} placeholder="Label" className="flex-1 h-7 text-sm" />
                          <Input value={child.url} onChange={(e) => updateChild(index, ci, "url", e.target.value)} placeholder="/path" className="flex-1 h-7 text-sm" />
                          <Switch checked={child.isEnabled} onCheckedChange={(v) => updateChild(index, ci, "isEnabled", v)} />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeChild(index, ci)} className="h-6 w-6 p-0 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addChild(index)} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Sub-item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Menu Item
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Menu Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!initialData) setSlug(generateSlug(e.target.value)); }} placeholder="Main Navigation" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="font-mono text-sm" /></div>
              <div className="space-y-2"><Label>Location</Label>
                <Select value={location} onValueChange={(v) => setLocation(v || "header")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header (Main Navigation)</SelectItem>
                    <SelectItem value="footer">Footer (Column 2: Quick Links)</SelectItem>
                    <SelectItem value="secondary">Secondary (Column 3: CBSE & Compliance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/menus")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Menu" : "Create Menu"}</Button>
      </div>
    </form>
  );
}
