import { cn } from "@/lib/utils";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageLayout({ children, className }: AdminPageLayoutProps) {
  return (
    <div className={cn("flex-1 space-y-6 p-4 sm:p-6 lg:p-8", className)}>
      {children}
    </div>
  );
}
