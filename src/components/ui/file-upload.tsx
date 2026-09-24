"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function FileUpload({
  value,
  onChange,
  accept,
  maxSize = 10 * 1024 * 1024,
  disabled,
  className,
  placeholder = "Click to upload or drag and drop",
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (maxSize && file.size > maxSize) {
        setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return false;
      }
      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const fileType = file.type;
        const fileExt = `.${file.name.split(".").pop()}`;
        const isValid = acceptedTypes.some(
          (t) => t === fileType || t === fileExt || (t.endsWith("/*") && fileType.startsWith(t.replace("/*", "/")))
        );
        if (!isValid) {
          setError("File type not accepted");
          return false;
        }
      }
      setError(null);
      return true;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onChange?.(file);
      }
    },
    [onChange, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (value) {
    return (
      <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3", className)}>
        <FileIcon className="size-5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-sm">{value.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            onChange?.(null);
            setError(null);
          }}
          disabled={disabled}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mb-2 size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{placeholder}</p>
        {accept && (
          <p className="mt-1 text-xs text-muted-foreground/70">
            Accepted: {accept}
          </p>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
