"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2, Archive, Send } from "lucide-react";

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkPublish?: (ids: string[]) => Promise<void>;
  onBulkArchive?: (ids: string[]) => Promise<void>;
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  onBulkDelete,
  onBulkPublish,
  onBulkArchive,
}: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"delete" | "publish" | "archive" | null>(null);

  if (selectedIds.length === 0) return null;

  const handleConfirm = () => {
    startTransition(async () => {
      if (confirmAction === "delete" && onBulkDelete) await onBulkDelete(selectedIds);
      if (confirmAction === "publish" && onBulkPublish) await onBulkPublish(selectedIds);
      if (confirmAction === "archive" && onBulkArchive) await onBulkArchive(selectedIds);
      setConfirmAction(null);
      onClearSelection();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
        <span className="text-sm text-muted-foreground px-2">
          {selectedIds.length} selected
        </span>
        {onBulkPublish && (
          <Button size="sm" variant="outline" onClick={() => setConfirmAction("publish")} disabled={isPending}>
            <Send className="h-3.5 w-3.5 mr-1" /> Publish
          </Button>
        )}
        {onBulkArchive && (
          <Button size="sm" variant="outline" onClick={() => setConfirmAction("archive")} disabled={isPending}>
            <Archive className="h-3.5 w-3.5 mr-1" /> Archive
          </Button>
        )}
        {onBulkDelete && (
          <Button size="sm" variant="outline" onClick={() => setConfirmAction("delete")} disabled={isPending}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear
        </Button>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={`${confirmAction === "delete" ? "Delete" : confirmAction === "publish" ? "Publish" : "Archive"} ${selectedIds.length} item(s)?`}
        description="This action will be applied to all selected items."
        confirmLabel="Confirm"
        variant={confirmAction === "delete" ? "destructive" : "default"}
        onConfirm={handleConfirm}
        loading={isPending}
      />
    </>
  );
}
