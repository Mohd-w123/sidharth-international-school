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
import { createAdmission, updateAdmission } from "@/actions/admission.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";

interface Props { initialData?: any; }

export function AdmissionForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [session, setSession] = useState(initialData?.session ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { title, slug: slug || generateSlug(title), content, session, category, status };
      const result = initialData?._id ? await updateAdmission({ id: initialData._id, ...payload }) : await createAdmission(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/admissions"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Admission Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Admission Process 2025-26" /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              </div>
              <div className="space-y-2"><Label>Content</Label><RichTextEditor value={content} onChange={setContent} placeholder="Admission details..." /></div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Session</Label><Input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2025-26" /></div>
              <div className="space-y-2"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Process, Fees, Eligibility" /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/admissions")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Create"}</Button>
      </div>
    </form>
  );
}
