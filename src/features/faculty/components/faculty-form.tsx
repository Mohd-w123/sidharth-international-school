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
import { MediaPicker } from "@/features/media/components/media-picker";
import { createFaculty, updateFaculty } from "@/actions/faculty.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { Trash2, User } from "lucide-react";

interface FacultyFormProps {
  initialData?: any;
}

export function FacultyForm({ initialData }: FacultyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [photo, setPhoto] = useState(initialData?.photo ?? "");
  const [designation, setDesignation] = useState(initialData?.designation ?? "");
  const [department, setDepartment] = useState(initialData?.department ?? "");
  const [subject, setSubject] = useState(initialData?.subject ?? "");
  const [qualification, setQualification] = useState(initialData?.qualification ?? "");
  const [experience, setExperience] = useState(initialData?.experience ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) setSlug(generateSlug(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { name, slug, photo, designation, department, subject, qualification, experience, bio, email, status };
      if (initialData?._id) {
        const result = await updateFaculty({ id: initialData._id, ...payload });
        if (result.error) toast.error(result.error);
        else { toast.success(result.success); router.push("/admin/faculty"); }
      } else {
        const result = await createFaculty(payload);
        if (result.error) toast.error(result.error);
        else { toast.success(result.success); router.push("/admin/faculty"); }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Faculty Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Dr. Priya Sharma" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="e.g. dr-priya-sharma" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Teacher" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Science" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Physics" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. teacher@school.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="e.g. M.Sc., B.Ed" />
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 10+ years" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short biography..." rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {photo ? (
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border group">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPhoto("")} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div onClick={() => setPhotoPickerOpen(true)} className="w-32 h-32 mx-auto rounded-full border border-dashed flex items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors">
                  <User className="h-10 w-10" />
                </div>
              )}
              <div className="flex gap-2">
                <Input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL..." className="text-xs" />
                <Button type="button" variant="outline" size="sm" onClick={() => setPhotoPickerOpen(true)} className="shrink-0 text-xs">Select</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/faculty")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Add Faculty"}</Button>
      </div>
      <MediaPicker open={photoPickerOpen} onOpenChange={setPhotoPickerOpen} onSelect={setPhoto} />
    </form>
  );
}
