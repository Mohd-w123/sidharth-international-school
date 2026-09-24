/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MediaPicker } from "@/features/media/components/media-picker";
import { createNews, updateNews } from "@/actions/news.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";

interface Props { initialData?: any; }

export function NewsForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        category: category || undefined,
        tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        isFeatured,
        status,
      };
      const result = initialData?._id
        ? await updateNews({ id: initialData._id, ...payload })
        : await createNews(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/news"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Article Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. School Wins National Award" /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              </div>
              <div className="space-y-2"><Label>Excerpt</Label><Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the article (max 300 chars)..." maxLength={300} /></div>
              <div className="space-y-2"><Label>Content</Label><RichTextEditor value={content} onChange={setContent} placeholder="Full article content..." /></div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Featured Image</CardTitle></CardHeader>
            <CardContent>
              {featuredImage ? (
                <div className="relative group rounded-lg overflow-hidden">
                  <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setMediaPickerOpen(true)}>Change</Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setFeaturedImage("")}>Remove</Button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setMediaPickerOpen(true)} className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <ImageIcon className="h-8 w-8" /><span className="text-xs">Click to select image</span>
                </button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Categorization & Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Achievements, Sports" /></div>
              <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. awards, students, 2025" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300" />
                <Label htmlFor="isFeatured">Featured Article</Label>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/news")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Article"}</Button>
      </div>
      <MediaPicker open={mediaPickerOpen} onOpenChange={setMediaPickerOpen} onSelect={setFeaturedImage} />
    </form>
  );
}
