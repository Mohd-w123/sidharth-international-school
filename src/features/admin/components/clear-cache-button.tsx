"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { clearAppCache } from "@/actions/cache.actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ClearCacheButton() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    if (isClearing) return;
    setIsClearing(true);
    const toastId = toast.loading("Clearing website cache...");

    try {
      const result = await clearAppCache();
      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success(result.success || "Website cache purged successfully!", {
          id: toastId,
          duration: 4000,
        });
      }
    } catch (err) {
      toast.error("Failed to clear cache. Please try again.", { id: toastId });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        onClick={handleClearCache}
        disabled={isClearing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60 transition-colors disabled:opacity-50 cursor-pointer"
        aria-label="Clear Website Cache"
      >
        <RotateCw
          className={`h-3.5 w-3.5 text-amber-600 dark:text-amber-400 ${
            isClearing ? "animate-spin text-primary" : ""
          }`}
        />
        <span className="hidden sm:inline">Purge Cache</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">Purge website & layout cache so live edits appear immediately</p>
      </TooltipContent>
    </Tooltip>
  );
}
