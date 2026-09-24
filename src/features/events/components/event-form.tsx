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
import { createEvent, updateEvent } from "@/actions/event.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";

interface Props { initialData?: any; }

export function EventForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [eventDate, setEventDate] = useState(initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split("T")[0] : "");
  const [startTime, setStartTime] = useState(initialData?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialData?.endTime ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [registrationUrl, setRegistrationUrl] = useState(initialData?.registrationUrl ?? "");
  const [registrationDeadline, setRegistrationDeadline] = useState(initialData?.registrationDeadline ? new Date(initialData.registrationDeadline).toISOString().split("T")[0] : "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        title, slug: slug || generateSlug(title), description, content, image, eventDate, startTime, endTime,
        location, registrationUrl: registrationUrl || undefined, registrationDeadline: registrationDeadline || undefined, status,
      };
      const result = initialData?._id ? await updateEvent({ id: initialData._id, ...payload }) : await createEvent(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/events"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Event Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Annual Day Celebration 2025" /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              </div>
              <div className="space-y-2"><Label>Short Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief event summary..." /></div>
              <div className="space-y-2"><Label>Detailed Content</Label><RichTextEditor value={content} onChange={setContent} placeholder="Full event details, agenda, etc..." /></div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Event Date</Label><Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>
                <div className="space-y-2"><Label>End Time</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. School Auditorium" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Banner Image</CardTitle></CardHeader>
            <CardContent>
              {image ? (
                <div className="relative group rounded-lg overflow-hidden">
                  <img src={image} alt="Event banner" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setMediaPickerOpen(true)}>Change</Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setImage("")}>Remove</Button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setMediaPickerOpen(true)} className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <ImageIcon className="h-8 w-8" /><span className="text-xs">Click to select banner</span>
                </button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Registration & Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Registration URL</Label><Input value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="https://..." /></div>
              <div className="space-y-2"><Label>Registration Deadline</Label><Input type="date" value={registrationDeadline} onChange={(e) => setRegistrationDeadline(e.target.value)} /></div>
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin/events")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Event"}</Button>
      </div>
      <MediaPicker open={mediaPickerOpen} onOpenChange={setMediaPickerOpen} onSelect={setImage} />
    </form>
  );
}
