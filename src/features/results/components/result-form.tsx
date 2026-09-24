/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { createResult, updateResult } from "@/actions/result.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";

interface Props { initialData?: any; }

export function ResultForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [session, setSession] = useState(initialData?.session ?? "");
  const [className, setClassName] = useState(initialData?.class ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { title, slug: slug || generateSlug(title), session, class: className, description, content, status };
      const result = initialData?._id ? await updateResult({ id: initialData._id, ...payload }) : await createResult(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/results"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Result Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. CBSE Class X Board Results 2024-25" /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              </div>
              <div className="space-y-2"><Label>Short Summary</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief summary of highlights or toppers..." /></div>
              <div className="space-y-2"><Label>Detailed Analysis / Content</Label><RichTextEditor value={content} onChange={setContent} placeholder="Detailed result write-up or table..." /></div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Academic Session</Label><Input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2024-25" /></div>
              <div className="space-y-2"><Label>Class / Grade</Label><Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Class 10 or All" /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/results")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Result"}</Button>
      </div>
    </form>
  );
}
