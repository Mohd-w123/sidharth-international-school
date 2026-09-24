"use client";

import { useRef, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/actions/media.actions";
import { ALL_ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/validations/media";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaUploadDialog({ open, onOpenChange }: MediaUploadDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      toast.error("File type not allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File exceeds 25MB limit");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("file", file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();

        if (!res.ok || result.error) {
          toast.error(result.error || "Upload failed");
        } else {
          toast.success("File uploaded successfully");
          setFile(null);
          formRef.current?.reset();
          onOpenChange(false);
        }
      } catch {
        toast.error("Upload failed");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>File</Label>
            <Input
              type="file"
              accept={ALL_ALLOWED_TYPES.join(",")}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
            {file && <p className="text-xs text-muted-foreground mt-1">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input name="alt" placeholder="Describe the image" className="mt-1" />
          </div>
          <div>
            <Label>Folder</Label>
            <Input name="folder" placeholder="school-cms" defaultValue="school-cms" className="mt-1" />
          </div>
          <Button type="submit" disabled={!file || isPending} className="w-full">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
