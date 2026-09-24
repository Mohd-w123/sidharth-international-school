"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getMedia, uploadMedia } from "@/actions/media.actions";
import { ALL_ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/validations/media";
import { Search, Image as ImageIcon, Upload, Loader2, Link2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  mimeFilter?: string;
}

export function MediaPicker({ open, onOpenChange, onSelect, mimeFilter = "image" }: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [items, setItems] = useState<{ _id: string; url: string; originalName: string; mimeType: string }[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Local Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // External URL state
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setAltText("");
      setCustomUrl("");
      return;
    }
    if (activeTab === "library") {
      startTransition(async () => {
        const result = await getMedia({ search: search || undefined, type: mimeFilter, limit: "24" });
        setItems(result.data as never);
      });
    }
  }, [open, search, mimeFilter, activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      toast.error("File type not allowed. Please choose a valid image/document.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File exceeds 25MB size limit.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAndSelect = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      if (altText) formData.set("alt", altText);
      formData.set("folder", "school-cms");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Upload failed");
      } else if (result.url) {
        toast.success("File uploaded successfully!");
        onSelect(result.url);
        onOpenChange(false);
      }
    } catch {
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomUrlSelect = () => {
    if (!customUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    onSelect(customUrl.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Select or Upload Media</DialogTitle>
        </DialogHeader>

        {/* Tab Headers */}
        <div className="flex border-b gap-2 mb-4">
          <button
            type="button"
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-all ${activeTab === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("library")}
          >
            <ImageIcon className="h-4 w-4 inline mr-1.5" /> Media Library
          </button>
          <button
            type="button"
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-all ${activeTab === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload className="h-4 w-4 inline mr-1.5" /> Upload from Computer
          </button>
          <button
            type="button"
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-all ${activeTab === "url" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("url")}
          >
            <Link2 className="h-4 w-4 inline mr-1.5" /> Direct URL
          </button>
        </div>

        {/* TAB 1: Media Library */}
        {activeTab === "library" && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search media library..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2 pr-1 min-h-[260px]">
              {items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => { onSelect(item.url); onOpenChange(false); }}
                  className="group aspect-square relative rounded-lg border overflow-hidden hover:ring-2 ring-primary transition-all bg-muted flex items-center justify-center text-left"
                >
                  {item.mimeType.startsWith("image/") ? (
                    <Image src={item.url} alt={item.originalName} fill className="object-cover group-hover:scale-105 transition-transform" sizes="150px" />
                  ) : (
                    <div className="p-2 text-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">{item.originalName}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs text-white bg-primary px-2 py-1 rounded shadow font-medium">Select</span>
                  </div>
                </button>
              ))}
              {items.length === 0 && !isPending && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mb-2 stroke-1" />
                  <p className="text-sm">No media files found in library.</p>
                  <Button variant="link" size="sm" onClick={() => setActiveTab("upload")} className="mt-1">
                    Upload a file from your computer
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Upload Local File */}
        {activeTab === "upload" && (
          <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
            {!selectedFile ? (
              <label className="border-2 border-dashed border-muted-foreground/30 hover:border-primary rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/40 transition-all text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Click to upload from local system</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, WEBP, GIF, PDF up to 25MB</p>
                </div>
                <input type="file" accept={ALL_ALLOWED_TYPES.join(",")} onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
                <div className="flex items-center gap-4">
                  {previewUrl && selectedFile.type.startsWith("image/") ? (
                    <div className="h-16 w-16 relative rounded-lg overflow-hidden shrink-0 border">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                    <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="text-xs text-destructive hover:underline mt-1">
                      Choose different file
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Alt Text / Description (Optional)</Label>
                  <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Image description..." />
                </div>

                <Button onClick={handleUploadAndSelect} disabled={isUploading} className="w-full bg-[#003d78] hover:bg-[#002a54] text-white">
                  {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading & Selecting...</> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Upload & Use File</>}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Direct URL */}
        {activeTab === "url" && (
          <div className="flex-1 flex flex-col justify-center space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image / Media URL</Label>
              <Input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
            </div>
            {customUrl && (
              <div className="h-36 relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                <img src={customUrl} alt="Preview" className="max-h-full object-contain" onError={() => toast.error("Unable to load image preview from URL")} />
              </div>
            )}
            <Button onClick={handleCustomUrlSelect} disabled={!customUrl.trim()} className="w-full">
              Use Image URL
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
