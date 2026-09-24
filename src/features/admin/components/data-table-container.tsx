import { cn } from "@/lib/utils";

interface DataTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableContainer({ children, className }: DataTableContainerProps) {
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      {children}
    </div>
  );
}

interface DataTableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between border-b", className)}>
      {children}
    </div>
  );
}

interface DataTableContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableContent({ children, className }: DataTableContentProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  );
}

interface DataTableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableFooter({ children, className }: DataTableFooterProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-t", className)}>
      {children}
    </div>
  );
}
