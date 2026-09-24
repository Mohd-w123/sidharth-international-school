"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaPicker } from "@/features/media/components/media-picker";
import { ALL_ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/validations/media";
import { Upload, Image as ImageIcon, Link2, X, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

interface ImageSettingInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length < 3) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  );
}

export function ImageSettingInput({
  value,
  onChange,
  placeholder = "https://res.cloudinary.com/... or upload",
  label,
  description,
  disabled = false,
}: ImageSettingInputProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bgDark, setBgDark] = useState(true);
  const [imgLoadError, setImgLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanValue = typeof value === "string" ? value.trim() : "";
  const hasValidUrl = isValidImageUrl(cleanValue) && !imgLoadError;

  // Reset load error when value changes
  useEffect(() => {
    setImgLoadError(false);
  }, [cleanValue]);

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a valid image (PNG, JPG, SVG, WEBP).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 25MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "school-cms/branding");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to upload image.");
      } else if (data.url) {
        onChange(data.url);
        toast.success("Logo/Image uploaded successfully!");
      }
    } catch {
      toast.error("Network error during file upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={handleDirectFileUpload}
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Thumbnail Preview */}
        <div className="relative group shrink-0">
          <div
            className={`w-28 h-28 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden transition-colors ${
              bgDark ? "bg-[#002a54] text-white" : "bg-muted text-foreground"
            }`}
          >
            {hasValidUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cleanValue}
                  alt={label || "Logo Preview"}
                  className="max-h-full max-w-full object-contain"
                  onError={() => setImgLoadError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-xs opacity-50 p-2">
                <ImageIcon className="h-6 w-6 mb-1" />
                <span>{imgLoadError ? "Invalid URL" : "No Logo"}</span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs">
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
                <span>Uploading...</span>
              </div>
            )}
          </div>

          {/* Preview Background Switcher */}
          {hasValidUrl && (
            <button
              type="button"
              onClick={() => setBgDark(!bgDark)}
              className="absolute -bottom-2 -right-2 bg-background border shadow-xs rounded-full p-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
              title="Toggle preview contrast background"
            >
              <Eye className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Inputs and Action Buttons */}
        <div className="flex-1 space-y-2 w-full">
          {description && <p className="text-xs text-muted-foreground">{description}</p>}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={cleanValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-8 text-xs font-mono"
                disabled={disabled || isUploading}
              />
            </div>
            {cleanValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange("")}
                disabled={disabled || isUploading}
                title="Clear logo"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="text-xs"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5 mr-1.5" />
              )}
              Upload from Device
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMediaPicker(true)}
              disabled={disabled || isUploading}
              className="text-xs"
            >
              <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
              Media Library
            </Button>
          </div>
        </div>
      </div>

      {/* Media Picker Dialog */}
      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={(url) => {
          onChange(url);
          toast.success("Logo selected from media library!");
        }}
        mimeFilter="image"
      />
    </div>
  );
}
