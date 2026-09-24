/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/features/media/components/media-picker";
import {
  createAlbum,
  updateAlbum,
  addGalleryItem,
  removeGalleryItem,
} from "@/actions/gallery.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { Trash2, Plus, ImageIcon } from "lucide-react";

interface AlbumFormProps {
  initialData?: any;
  initialItems?: any[];
}

export function AlbumForm({ initialData, initialItems = [] }: AlbumFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage ?? ""
  );
  const [type, setType] = useState<"photo" | "video">(
    initialData?.type ?? "photo"
  );
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [items, setItems] = useState<any[]>(initialItems);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [itemPickerOpen, setItemPickerOpen] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        title,
        slug,
        description,
        coverImage,
        type,
        status,
      };

      if (initialData?._id) {
        const result = await updateAlbum({ id: initialData._id, ...payload });
        if (result.error) toast.error(result.error);
        else {
          toast.success(result.success);
          router.push("/admin/gallery");
        }
      } else {
        const result = await createAlbum(payload);
        if (result.error) toast.error(result.error);
        else {
          toast.success(result.success);
          if (result.id) router.push(`/admin/gallery/${result.id}`);
          else router.push("/admin/gallery");
        }
      }
    });
  };

  const handleAddItem = (url: string) => {
    if (!initialData?._id) return;
    startTransition(async () => {
      const result = await addGalleryItem({
        albumId: initialData._id,
        url,
        type: type === "video" ? "video" : "image",
        order: items.length,
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success("Item added");
        setItems((prev) => [
          ...prev,
          { _id: result.id, url, type: type === "video" ? "video" : "image", order: items.length },
        ]);
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      const result = await removeGalleryItem(itemId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Item removed");
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">
                Album Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="album-title">Title</Label>
                  <Input
                    id="album-title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Annual Day 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="album-slug">Slug</Label>
                  <Input
                    id="album-slug"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="e.g. annual-day-2025"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-desc">Description</Label>
                <Textarea
                  id="album-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this album..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items Management */}
          {initialData?._id && (
            <Card>
              <CardHeader className="py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  {type === "video" ? "Videos" : "Photos"} ({items.length})
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setItemPickerOpen(true)}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add{" "}
                  {type === "video" ? "Video" : "Photo"}
                </Button>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
                    No items yet. Click "Add {type === "video" ? "Video" : "Photo"}" to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
                      >
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.title || "Gallery item"}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isPending}
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border group">
                  <img
                    src={coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setCoverPickerOpen(true)}
                  className="aspect-video rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">Select cover image</span>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Image URL..."
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCoverPickerOpen(true)}
                  className="shrink-0 text-xs"
                >
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Album Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as "photo" | "video")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo Album</SelectItem>
                    <SelectItem value="video">Video Album</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/gallery")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : initialData
            ? "Save Changes"
            : "Create Album"}
        </Button>
      </div>

      <MediaPicker
        open={coverPickerOpen}
        onOpenChange={setCoverPickerOpen}
        onSelect={(url) => setCoverImage(url)}
      />
      <MediaPicker
        open={itemPickerOpen}
        onOpenChange={setItemPickerOpen}
        onSelect={handleAddItem}
      />
    </form>
  );
}
