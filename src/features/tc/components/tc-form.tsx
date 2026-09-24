/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaPicker } from "@/features/media/components/media-picker";
import { createTC, updateTC } from "@/actions/tc.actions";
import { toast } from "sonner";
import { FileText } from "lucide-react";

interface Props { initialData?: any; }

export function TCForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tcNumber, setTcNumber] = useState(initialData?.tcNumber ?? "");
  const [admissionNumber, setAdmissionNumber] = useState(initialData?.admissionNumber ?? "");
  const [studentName, setStudentName] = useState(initialData?.studentName ?? "");
  const [fatherName, setFatherName] = useState(initialData?.fatherName ?? "");
  const [motherName, setMotherName] = useState(initialData?.motherName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split("T")[0] : "");
  const [className, setClassName] = useState(initialData?.class ?? "");
  const [session, setSession] = useState(initialData?.session ?? "");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  const [documentUrl, setDocumentUrl] = useState(initialData?.documentUrl ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { tcNumber, admissionNumber, studentName, fatherName, motherName, dateOfBirth, class: className, session, issueDate, documentUrl, status };
      const result = initialData?._id ? await updateTC({ id: initialData._id, ...payload }) : await createTC(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/tc"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Student & Certificate Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>TC Number</Label><Input value={tcNumber} onChange={(e) => setTcNumber(e.target.value)} placeholder="e.g. TC/2025/001" /></div>
                <div className="space-y-2"><Label>Admission Number</Label><Input value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} placeholder="e.g. ADM-1024" /></div>
              </div>
              <div className="space-y-2"><Label>Student Name</Label><Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Rahul Verma" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Father&apos;s Name</Label><Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Mother&apos;s Name</Label><Input value={motherName} onChange={(e) => setMotherName(e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} /></div>
                <div className="space-y-2"><Label>Class Passed / Leaving</Label><Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Class X" /></div>
                <div className="space-y-2"><Label>Session</Label><Input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2024-25" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Document & Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>PDF Document URL</Label>
                <div className="flex gap-2">
                  <Input value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} placeholder="PDF Link..." className="text-xs" />
                  <Button type="button" variant="outline" size="sm" onClick={() => setMediaPickerOpen(true)} className="shrink-0 text-xs">Select</Button>
                </div>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tc")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Changes" : "Issue TC"}</Button>
      </div>
      <MediaPicker open={mediaPickerOpen} onOpenChange={setMediaPickerOpen} onSelect={setDocumentUrl} />
    </form>
  );
}
