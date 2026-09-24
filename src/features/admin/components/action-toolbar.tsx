import { cn } from "@/lib/utils";

interface ActionToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionToolbar({ children, className }: ActionToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
