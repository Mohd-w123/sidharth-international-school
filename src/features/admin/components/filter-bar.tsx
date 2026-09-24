import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  children?: React.ReactNode;
  className?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function FilterBar({
  children,
  className,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}>
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
        </div>
      )}
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
